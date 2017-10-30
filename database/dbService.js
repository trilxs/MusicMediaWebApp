var mysql = require('mysql');
var keys = require('../config/keys');
var queries = require('./queries');

var connection;
module.exports = {
    /* Inserts a given user model given by Google OAuth */
    insertUser: function(user, callback) {

        var placesLived = user._json.placesLived; // Handle situation in which Google gives us back an undefined user location
        if (!placesLived) { placesLived = null; }
        else { placesLived = placesLived[0].value; }

        this.tryConnect().getConnection(function(err, con) {
            var sql = queries.insertUser;
            con.query(sql, [user.id, user.gender, user.name.givenName, user.name.familyName, user.emails[0].value, placesLived, user.phoneNumber]
            , function (err, result) {
                con.release();                                                
                if (err) throw err;
                return callback(result.insertId);
            });
        });
    },

    insertActivityLog: function(ID, action) {
        this.tryConnect().getConnection(function (err, con) {
            var sql = queries.insertActivityLog;
            con.query(sql, [ID, action], function (err, result) {
                con.release();                
                if (err) throw err;
            });
        });
    },

    replaceUserOnDuplicate: function(user, callback) {
        this.tryConnect().getConnection(function(err, con) {
            var sql = queries.replaceUserOnDuplicate;
            // Insert parameters
            con.query(sql, [user.id, user.googleID, user.gender, user.firstName, user.lastName, user.email, user.isProfileSetUp, user.location, user.phoneNumber,
                 // On Duplicate Key Update parameters
                 user.googleID, user.gender, user.firstName, user.lastName, user.email, user.isProfileSetUp, user.location, user.phoneNumber], 
                 function (err, result) {
                con.release();                       
                if (err) throw err;
                return callback(result.insertId);
            });
        });
    },

    /* Retrieves a User model by GoogleID */
    getUserByGoogleID: function(googleID, callback) {
        this.tryConnect().getConnection(function(err, con) {
            var sql = queries.getUserByGoogleID;
            con.query(sql, googleID, function (err, result) {
                con.release();                                                
                if (err) throw err;
                // Call the callback function in the caller of this method so we can do something with this "result"
                return callback(result); // [] if not found
            });
        });
    },

    /* Retrieves a User model by ID */
    getUserByID: function(ID, callback) {

        console.log(ID);
        this.tryConnect().getConnection(function(err, con) {
            var sql = queries.getUserByID;
            con.query({sql, 
                typeCast: function(field, next) {

                // We only want to cast bit fields that have a single-bit in them. If the field
                // has more than one bit, then we cannot assume it is supposed to be a Boolean.
                if ((field.type === "BIT" ) && (field.length === 1)) {
        
                    var bytes = field.buffer(); // AKA parser.parseLengthCodedBuffer()
        
                    // A Buffer in Node represents a collection of 8-bit unsigned integers.
                    // Therefore, our single "bit field" comes back as the bits '0000 0001',
                    // which is equivalent to the number 1.
                    return (bytes[0] === 1);
                }
                return next();
            }}, ID, function (err, result) {
                con.release();
                if (err) throw err;
                // Call the callback function in the caller of this method so we can do something with this "result"
                return callback(result[0]); // [] if not found
            });
        });
    },

    tryConnect: function() {
        // If we've already made a Pool, return it so our consumer can get a connection out of it
        // using getConnection(...)
        if (connection) {
            console.log("Pool already made. Retrieve it to then make connections to it");
            return connection; 
        }

        // Otherwise, recreate the connection since the old one cannot be reused (due to either errors or upon initial app start-up)
        connection = mysql.createPool({
            connectionLimit: 100,
            host: keys.mySQLHost,
            user: keys.mySQLUser,
            password: keys.mySQLPassword,
            database: keys.mySQLDatabaseName
        });

        //Attempt to re-connect. If not, log errors and recall this method
        connection.getConnection(function(err) {
            if (err) {
                console.log('Error when connecting to db:', err);
                setTimeout(tryConnect, 2000); // We introduce a delay before attempting to reconnect,
            }                                     // to avoid a hot loop, and to allow our node script to
        });                                     // process asynchronous requests in the meantime.
    
        // If there is an error connecting to the MySQL server,
        // it's probably because of a connection idle timeout (wait_timeout)
        connection.on('error', function(err) {
            console.log('Database error:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log("Reconnecting");
                tryConnect();
            } else {     
                throw err;
            }
        });

        console.log("New connection");
        return connection;
    }
}