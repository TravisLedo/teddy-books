import {React, useContext, useState, useEffect} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import Switch from 'react-switch';
import {AuthContext} from '../../contexts/Contexts';
import {Voices} from '../../Enums/Voices';

import './Profile.css';

function Profile(props) {
  const authContext = useContext(AuthContext);
  const [voiceSelection, setVoiceSelection] = useState();
  const [autoNextPage, setAutoNextPage] = useState();
  const [audioEnabled, setAudioEnabled] = useState();

  const handleAutoNextPageToggle = async () => {
    if (autoNextPage) {
      setAutoNextPage(false);
    } else {
      setAutoNextPage(true);
    }
    authContext.updateAutoNextPage(autoNextPage);
  };

  const handleAudioEnabledToggle = ()=>{
    if (audioEnabled) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true);
    }
    authContext.updateAudioEnabled(audioEnabled);
  };

  const handleVoiceSelectionChange = () => {
    authContext.updateVoiceSelection(voiceSelection);
  };

  useEffect(() => {
    setAudioEnabled(authContext.user.settings.audioEnabled);
    setAutoNextPage(authContext.user.settings.autoNextPage);
    setVoiceSelection(authContext.user.settings.voiceSelection);
  }, [authContext.user]);

  return (
    <div className='menu-card' style={{
      width:
          props.currentWindowSize.width > props.currentWindowSize.height ?
            '75vw' :
            '95vw',
    }}>
      <div className="title-label">
        <div className="title-label-text">Profile</div>
      </div>
      <div className='menu-container'>
        <div className="setting-content">
          <div>Voice Audio</div>
          <div> <Switch
            className="react-switch"
            onChange={()=> handleAudioEnabledToggle()}
            checked={audioEnabled}
          /></div>
        </div>
        <div className="setting-content">
          <div>Auto Next Page</div>
          <div> <Switch
            className="react-switch"
            onChange={()=> handleAutoNextPageToggle()}
            checked={autoNextPage}
          /></div>
        </div>

        <div className='setting-content'>
          <div>Voice Selection</div>
          <Dropdown className="standard-button">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {Voices.}
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
        </div>
        <div className='setting-content'>
          <Button
            className=""
            variant="outline-secondary"
            onClick={() => {
              authContext.logout();
            }}
          >
          Logout
          </Button>
        </div>

      </div>
    </div>
  );
}
export default Profile;
