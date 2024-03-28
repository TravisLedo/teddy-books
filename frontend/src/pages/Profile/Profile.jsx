import {React, useContext, useState, useEffect} from 'react';
import {Button, Dropdown, Form, Image} from 'react-bootstrap';
import Switch from 'react-switch';
import {AuthContext} from '../../contexts/Contexts';
import {Voices} from '../../Enums/Voices';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import './Profile.css';
import {updateUser} from '../../services/apiService';
import {validateEmail, validateUsername} from '../../services/FormValidationService';

function Profile(props) {
  const authContext = useContext(AuthContext);
  const [voiceSelection, setVoiceSelection] = useState(authContext.user.settings.voiceSelection);
  const [autoNextPage, setAutoNextPage] = useState(authContext.user.settings.autoNextPage);
  const [audioEnabled, setAudioEnabled] = useState(authContext.user.settings.audioEnabled);
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState(authContext.user.name);
  const [email, setEmail] = useState(authContext.user.email);

  const handleAutoNextPageToggle = async () => {
    const updated = await authContext.updateAutoNextPage(autoNextPage, true);
    if (autoNextPage && updated) {
      setAutoNextPage(false);
    } else {
      setAutoNextPage(true);
    }
  };

  const handleAudioEnabledToggle = async ()=>{
    const updated = await authContext.updateAudioEnabled(audioEnabled, true);
    if (audioEnabled && updated) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true);
    }
  };

  const handleVoiceSelectionChange = async (voice) => {
    const updated = await authContext.updateVoiceSelection(voice, true);

    if (updated) {
      setVoiceSelection(voice);
    }
  };

  const getVoiceName=()=>{
    for (const [key, value] of Object.entries(Voices)) {
      if (value.voice === voiceSelection) {
        return <span>{value.alt}</span>;
      }
    }
  };

  const validateFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    if (userName.trim().toLowerCase() !== authContext.user.name.trim().toLowerCase()) {
      usernameErrorsList = await validateUsername(userName, true);
    }
    if (email.trim().toLowerCase() !== authContext.user.email.trim().toLowerCase()) {
      emailErrorsList = await validateEmail(email, true);
    }
    const errorsList = usernameErrorsList.concat(emailErrorsList);
    if (errorsList.length>0) {
      authContext.handleErrorModalShow(errorsList);
    } else {
      updateUserValues();
    }
  };

  const updateUserValues = async () => {
    const newUserData = authContext.user;
    newUserData.email = email;
    newUserData.name = userName;
    try {
      await updateUser(newUserData);
      setEditing(false);
    } catch (error) {}
  };

  const resetValues = () => {
    setEditing(false);
    setUserName(authContext.user.name);
    setEmail(authContext.user.email);
  }; ;


  useEffect(() => {
    setAudioEnabled(authContext.user.settings.audioEnabled);
    setAutoNextPage(authContext.user.settings.autoNextPage);
    setVoiceSelection(authContext.user.settings.voiceSelection);
    setUserName(authContext.user.name);
    setEmail(authContext.user.email);
  }, [authContext.user]);

  return (
    <div className='menu-card' style={{
      width:
        props.currentWindowSize.width > props.currentWindowSize.height ?
          '50%' :
          '95%',
    }}>
      <div className="title-label">
        <div className="title-label-text">Profile</div>
      </div>
      <div className='menu-container'>
        <div className='setting-content'>
          {editing ? (
          <div className="editing-buttons-container">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                resetValues();
              }}
            >
              <Image className="edit-button-image" src={close}></Image>
            </Button>
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                validateFields();
              }}
            >
              <Image className="edit-button-image" src={check}></Image>
            </Button>
          </div>
        ) : (
          <div className="editing-buttons-container">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                setEditing(true);
              }}
            >
              <Image className="edit-button-image" src={edit}></Image>
            </Button>
          </div>
        )}
          <div>Username</div>
          <Form.Control type="text" value={userName} disabled={!editing} onChange={(e) => setUserName(e.target.value)}/>
        </div>
        <div className='setting-content'>
          <div>Email</div>
          <Form.Control type="email" value={email} disabled={!editing} onChange={(e) => setEmail(e.target.value)}/>

        </div>
        <div className="setting-content">
          <div>Auto Next Page</div>
          <div> <Switch
            className="react-switch"
            onChange={()=> handleAutoNextPageToggle()}
            checked={autoNextPage}
          /></div>
        </div>
        <div className="setting-content">
          <div>Voice Audio</div>
          <div> <Switch
            className="react-switch"
            onChange={()=> handleAudioEnabledToggle()}
            checked={audioEnabled}
          /></div>
        </div>
        <div className='setting-content'>
          <div>Voice Selection</div>
          <Dropdown className="standard-button">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {getVoiceName()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                style={
                voiceSelection === Voices.OLIVIA.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
                }
                onClick={() =>
                  handleVoiceSelectionChange(Voices.OLIVIA.voice)
                }
              >
                {Voices.OLIVIA.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                voiceSelection === Voices.JOE.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
                }
                onClick={() => handleVoiceSelectionChange(Voices.JOE.voice)}
              >
                {Voices.JOE.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                voiceSelection === Voices.EMILY.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
                }
                onClick={() =>
                  handleVoiceSelectionChange(Voices.EMILY.voice)
                }
              >
                {Voices.EMILY.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                voiceSelection === Voices.MARK.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
                }
                onClick={() =>
                  handleVoiceSelectionChange(Voices.MARK.voice)
                }
              >
                {Voices.MARK.alt}
              </Dropdown.Item>
              <Dropdown.Item
                style={
                voiceSelection === Voices.JESSICA.voice ?
                  {fontWeight: 'bold'} :
                  {fontWeight: 'normal'}
                }
                onClick={() =>
                  handleVoiceSelectionChange(Voices.JESSICA.voice)
                }
              >
                {Voices.JESSICA.alt}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </div>
    </div>
  );
}
export default Profile;
