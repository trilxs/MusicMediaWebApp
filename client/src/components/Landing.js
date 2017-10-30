import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Landing.css';

class Landing extends Component {
    componentDidMount() {
        this.props.showHeader();
    }

    render() {
        return(
            <div>
                <div id="background">
                    <img src={require('../assets/images/landing-temp.jpg')} alt="" />  
                
                    <div id="now-playing">
                        <div class="now-playing-text">
                            <div id="main-text">You're listening to</div>
                            <img src={require('../assets/images/album-temp.jpg')} alt="" />
                            <div class="song-info"> 
                                <div id="song-title">Song</div>
                                <div id="artist-name">Artist</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { auth: state.auth };
}
export default connect(mapStateToProps)(Landing);