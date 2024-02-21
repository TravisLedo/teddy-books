import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import {OverlayStatus} from '../../Enums/OverlayStatus';
import './OverlayScreen.css';

export default function OverlayScreen(props) {
  return (
    <div className="overlay-screen">
      {props.status === OverlayStatus.LOADING ? (
        <div className="standard-overlay">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : props.status === OverlayStatus.READY_CLICK ? (
        <div
          className="clickable-overlay"
          onClick={() => props.setStarted(true)}
        >
          Click To Read
        </div>
      ) : null}
    </div>
  );
}
