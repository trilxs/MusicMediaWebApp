import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
    renderContent() {
        var { auth: user } = this.props;
        // Access to the authReducer, which gives us the payload.action (User model)
        switch(user) {
            case null:
                return;
            case false:
                return (
                    <li><a href="/auth/google" id="text-header">Login with Google</a></li>
                );
            default:
                return (
                    <div>
                        <li>
                            <Link 
                                to={"/profile/" + user.id}>
                                Profile
                            </Link>
                        </li>
                        <li><a href="/api/logout" id="text-header">Log out</a></li>
                    </div>  
                );
        }
    }

    render() {
        var { auth: user } = this.props;
        return (
            <div>
                <div className="header">
                    <Link 
                        to={user ? '/dashboard' : '/'}
                        className="left brand-logo" id="text-header">
                        Music Media
                    </Link>
                    <ul className="right" >
                        {this.renderContent()}
                    </ul>
                </div>
            </div>
            
        );
    }
}

// This is how we access updated states from the reducers. "auth" matches our auth: authReducer naming
function mapStateToProps(state) {
    return { auth: state.auth };
}

export default connect(mapStateToProps)(Header);