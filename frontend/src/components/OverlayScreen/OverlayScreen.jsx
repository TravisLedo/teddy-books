import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

import './OverlayScreen.css';
import {OverlayStatus} from '../../Enums/OverlayStatus';
export default function OverlayScreen(props) {
  // state for loading
  // state for ready to click to start
  // spinner
  return (
    <div className="overlay-screen">
      {props.status === OverlayStatus.LOADING ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : props.status === OverlayStatus.READY_CLICK ? (
        <div
          onClick={() => props.setStarted(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            cursor: 'pointer',
          }}
        >
          Click To Read
        </div>
      ) : null}
    </div>
  );
}
