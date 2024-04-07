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
import {updateBook} from '../../services/apiService';

export default function ReadControlArea(props) {
  const authContext = useContext(AuthContext);
  const offsetRef = useRef();
  const [offsetSize, setOffsetSize] = useState(0);
  const [likes, setLikes] = useState(props.book.likes);
  const [likeImage, setLikeImage] = useState(heart1);

  const handleLike = async ()=>{
    if (authContext.user) {
      const newBookData = props.book;
      if (likes.includes(authContext.user._id)) {
        newBookData.likes = newBookData.likes.filter((id) => id === authContext.user.id);
      } else {
        newBookData.likes.push(authContext.user._id);
      }
      const response = await updateBook(newBookData);
      setLikes(response.likes);
    }
  };

  useEffect(() => {
    if (authContext.user && likes.includes(authContext.user._id)) {
      setLikeImage(heart2);
    } else {
      setLikeImage(heart1);
    }
  }, [likes]);


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
                props.voiceSelection === Voices.OLIVIA.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.OLIVIA.voice)
              }
            >
              {Voices.OLIVIA.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.JOE.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() => props.handleVoiceSelectionChange(Voices.JOE.voice)}
            >
              {Voices.JOE.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.EMILY.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.EMILY.voice)
              }
            >
              {Voices.EMILY.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.MARK.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.MARK.voice)
              }
            >
              {Voices.MARK.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={
                props.voiceSelection === Voices.JESSICA.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
              }
              onClick={() =>
                props.handleVoiceSelectionChange(Voices.JESSICA.voice)
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
          <Image
            className="like-button"
            rounded
            src={likeImage}
          />
        </div>
      </OverlayTrigger>
      <b>{props.book.likes.length}</b>
    </div>
  );
}
