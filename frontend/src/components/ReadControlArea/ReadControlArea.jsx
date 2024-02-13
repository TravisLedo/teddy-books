import React from 'react';
import {
  Button,
  Image,
  Dropdown,
} from 'react-bootstrap';
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
    <><div style={{width: 'auto'}}>
      <OverlayTrigger
        overlay={(props) => <Tooltip {...props}>Toggle Voice</Tooltip>}
        placement="bottom"
      >
        <Button
          variant="outline-secondary"
          onClick={() => props.handleAudioOnToggle()}
          className="control-button"
        >
          <Image
            className="control-button-image"
            src={props.userSettings.audioOn ? mute : audio}
          ></Image>
        </Button>
      </OverlayTrigger>
    </div><div style={{width: 'auto'}}>
      <OverlayTrigger
        overlay={(props) => <Tooltip {...props}>Select Voice</Tooltip>}
        placement="bottom"
      >
        <Dropdown drop="up">
          <Dropdown.Toggle
            variant="outline-secondary"
            className="control-button"
          >
            <Image className="control-button-image" src={chat}></Image>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              style={props.voiceSelection === Voices.OLIVIA.voice ?
                                  {fontWeight: 'bold'} :
                                  {fontWeight: 'normal'}}
              onClick={() => props.setVoiceSelection(Voices.OLIVIA.voice)}
            >
              {Voices.OLIVIA.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={props.voiceSelection === Voices.JOE.voice ?
                                  {fontWeight: 'bold'} :
                                  {fontWeight: 'normal'}}
              onClick={() => props.setVoiceSelection(Voices.JOE.voice)}
            >
              {Voices.JOE.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={props.voiceSelection === Voices.EMILY.voice ?
                                  {fontWeight: 'bold'} :
                                  {fontWeight: 'normal'}}
              onClick={() => props.setVoiceSelection(Voices.EMILY.voice)}
            >
              {Voices.EMILY.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={props.voiceSelection === Voices.MARK.voice ?
                                  {fontWeight: 'bold'} :
                                  {fontWeight: 'normal'}}
              onClick={() => props.setVoiceSelection(Voices.MARK.voice)}
            >
              {Voices.MARK.alt}
            </Dropdown.Item>
            <Dropdown.Item
              style={props.voiceSelection === Voices.JESSICA.voice ?
                                  {fontWeight: 'bold'} :
                                  {fontWeight: 'normal'}}
              onClick={() => props.setVoiceSelection(Voices.JESSICA.voice)}
            >
              {Voices.JESSICA.alt}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
    </div><div style={{width: 'auto'}}>
      <OverlayTrigger
        overlay={(props) => <Tooltip {...props}>Toggle Auto Next</Tooltip>}
        placement="bottom"
      >
        <Button
          variant="outline-secondary"
          disabled={!props.userSettings.audioOn}
          onClick={() => props.handleAutoNextPageToggle()}
          className="control-button"
        >
          <Image
            className="control-button-image"
            src={props.userSettings.autoNextPage && props.userSettings.audioOn ?
                              pause :
                              props.userSettings.autoNextPage && !props.userSettings.audioOn ?
                                  pauseDisabled :
                                  props.userSettings.autoNextPage && props.serSettings.audioOn ?
                                      playDisabled :
                                      play}
          ></Image>
        </Button>
      </OverlayTrigger>
    </div></>
  );
}
