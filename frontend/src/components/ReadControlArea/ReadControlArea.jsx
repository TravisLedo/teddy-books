import {React, useEffect} from 'react';
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
import {Voices} from '../../Enums/Voices';
import './ReadControlArea.css';

export default function ReadControlArea(props) {
  return (
    <>
      <div style={{width: 'auto'}}>
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
      </div>
      <div style={{width: 'auto'}}>
        <OverlayTrigger
          overlay={(e) =>
            <Tooltip {...e}>{props.voiceSelectionAllowed ? <div>Select Voice</div> :<div>Log in for more voices.</div>}</Tooltip>}
          placement="top"
        >
          <Dropdown drop="up">
            <Dropdown.Toggle
              disabled={!props.voiceSelectionAllowed}
              variant="outline-secondary"
              className="control-button"
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
                onClick={() => props.handleVoiceSelectionChange(Voices.OLIVIA.voice)}
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
                onClick={() => props.handleVoiceSelectionChange(Voices.EMILY.voice)}
              >
                {Voices.EMILY.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                  props.voiceSelection === Voices.MARK.voice ?
                    {fontWeight: 'bold'} :
                    {fontWeight: 'normal'}
                }
                onClick={() => props.handleVoiceSelectionChange(Voices.MARK.voice)}
              >
                {Voices.MARK.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                  props.voiceSelection === Voices.JESSICA.voice ?
                    {fontWeight: 'bold'} :
                    {fontWeight: 'normal'}
                }
                onClick={() => props.handleVoiceSelectionChange(Voices.JESSICA.voice)}
              >
                {Voices.JESSICA.alt}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>
      </div>
      <div style={{width: 'auto'}}>
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
      </div>
    </>
  );
}
