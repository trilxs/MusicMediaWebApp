import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import completeWorkflowToast from '../../utils/Toasts/default';
import * as actions from '../../actions/index';
import { connect } from 'react-redux';
import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        // Set music state to pause at the beginning of session
        this.state = { isPlaying: false };
        this.togglePlay = this.togglePlay.bind(this);    
    }

    componentDidMount() {
        this.props.showHeader();
        // Update the user model so that components like the Profile can pre-load the up-to-date model
        this.props.fetchUser();

        var { location } = this.props;
        // Toast if the user just finished the workflow
        if (location.state && location.state.finishedWorkflow) {
            toast("You have completed the setup!");
        }
    }

    // Toggle playing state
    togglePlay() {
        var currentState = this.state.isPlaying;
        this.setState({ isPlaying: !currentState });
    }

    render() {
        return (
            <div className="container-bg">      
                {completeWorkflowToast}

                <div className="carousel-suggested-container-container">
                    <div className="carousel-suggested-container">
                        <div className="background-gradient"> 
                            <div className="background-overlay"><span className="hide-overflow"></span></div>
                            <div className="song-player-container">
                                <div className="artwork-wrapper">
                                    <img src={require('../../assets/album-temp.png')}/>
                                </div>
                                <div className="username-title-container"> 
                                    <div className="track-title">Shipwreck - The Coast</div>
                                    <div className="track-username">testuser201</div>
                                </div>
                                <div className="song-player">
                                    <div onClick={this.togglePlay} className={"button " + (this.state.isPlaying ? 'play': 'pause')}></div>
                                    <div className="controls">
                                        <div id="current-time" className="time-fade">0:00</div>
                                        <div id="total-time" className="time-fade">0:00</div>
                                        <div id="slider-time">
                                            <div className="progress"></div>
                                        </div>
                                    </div>
                                </div> 
                                <div className="song-info">
                                    <div class="upload-time">3 months ago</div>
                                    <div class="song-tags">#Pop</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, actions)(withRouter(Dashboard));