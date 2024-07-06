import {React, useRef, useState, useEffect, useContext} from 'react';
import {Button, Image, Dropdown} from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import play from '../../assets/images/play.png';
import playDisabled from '../../assets/images/play-disabled.png';
import pause from '../../assets/images/pause.png';
import pauseDisabled from '../../assets/images/pause-disabled.png';
import audio from '../../assets/images/audio.png';
import mute from '../../assets/images/mute.png';
import chat from '../../assets/images/chat.png';
import heart1 from '../../assets/images/heart1.png';
import heart2 from '../../assets/images/heart2.png';
import {Voices} from '../../Enums/Voices';
import './ReadControlArea.css';
import {AuthContext} from '../../contexts/Contexts';

export default function ReadControlArea(props) {
  const authContext = useContext(AuthContext);
  const offsetRef = useRef();
  const [offsetSize, setOffsetSize] = useState(0);
  const [userLiked, setUserLiked] = useState();
  const [book, setBook] = useState(props.book);

  const handleLike = async ()=>{
    if (authContext.user) {
      try {
        const newBookData = book;
        if (book.likes.includes(authContext.user._id)) {
          newBookData.likes = newBookData.likes.filter((id) => id === authContext.user.id);
        } else {
          newBookData.likes.push(authContext.user._id);
        }
        const response = await authContext.updateBookDbData(newBookData);
        if (response.likes) {
          setBook(response);
        }
      } catch (error) {
        setBook(props.book);
      }
    }
  };

  useEffect(() => {
    if (authContext.user && book.likes.includes(authContext.user._id)) {
      setUserLiked(true);
    } else {
      setUserLiked(false);
    }
  }, [book, authContext.user]);

  useEffect(() => {
    if (offsetRef) {
      setOffsetSize(offsetRef.current.offsetWidth);
    }
  }, [offsetRef]);

  return (
    <div className="read-control-area-container">
      <div style={{width: offsetSize}} >
      </div>

      <OverlayTrigger
        overlay={(props) => <Tooltip {...props}>Toggle Voice</Tooltip>}
        placement="top"
      >
        <Button
          variant="outline-secondary"
          onClick={() => props.handleAudioEnabledToggle()}
          className="control-button"
        >
                <div className='audio-loading' style={{margin: 0}}>{props.showAudioLoading ? <div className="spinner-border" style={{width: 50, height: 50, color: '#0accb9', opacity: .4}} role="status">
                </div> : null}</div>
          <Image
            className="control-button-image"
            src={props.audioEnabled ? audio : mute}
          ></Image>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={(e) => (
          <Tooltip {...e}>
            {props.voiceSelectionAllowed ? (
              <div>Select Voice</div>
            ) : (
              <div>Log in for more voices.</div>
            )}
          </Tooltip>
        )}
        placement="top"
      >
        <Dropdown drop="up" className="control-button">
          <Dropdown.Toggle
            className="voice-dropdown-toggle"
            disabled={!props.voiceSelectionAllowed}
            variant="outline-secondary"
          >
            <Image className="control-button-image" src={chat}></Image>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.OLIVIA.alt?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.OLIVIA.alt)
              }
            >
              {Voices.OLIVIA.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.JOE.alt?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() => props.handleVoiceSelectionChange(Voices.JOE.alt)}
            >
              {Voices.JOE.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.EMILY.alt?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.EMILY.alt)
              }
            >
              {Voices.EMILY.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.MARK.alt?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.MARK.alt)
              }
            >
              {Voices.MARK.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.JESSICA.alt?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.JESSICA.alt)
              }
            >
              {Voices.JESSICA.alt}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={(props) => <Tooltip {...props}>Toggle Auto Next</Tooltip>}
        placement="top"
      >
        <Button
          variant="outline-secondary"
          disabled={!props.audioEnabled}
          onClick={() => props.handleAutoNextPageToggle()}
          className="control-button"
        >
          <Image
            className="control-button-image"
            src={
              props.autoNextPage && props.audioEnabled ?
                pause :
                !props.autoNextPage && props.audioEnabled ?
                play :
                props.autoNextPage && !props.audioEnabled ?
                pauseDisabled :
                playDisabled
            }
          ></Image>
        </Button>
      </OverlayTrigger>


      <OverlayTrigger
        overlay={(e) => (
          <Tooltip {...e}>
            {!authContext.user ? (
              <div>Log in to like.</div>
            ) : (
              <div>Like</div>
            )}
          </Tooltip>
        )}
        placement="top"
      >
        <div onClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
          handleLike();
        }}
        ref={offsetRef}
        >
          {userLiked ? <Image
            className="like-button"
            rounded
            src={heart2}
          /> : <Image
            className="like-button"
            rounded
            src={heart1}
          />}

        </div>
      </OverlayTrigger>
      <b>{book.likes.length}</b>
    </div>
  );
}
