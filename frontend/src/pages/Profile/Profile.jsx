import {React, useContext, useState, useEffect} from 'react';
import {Button, Col, Dropdown, Form, Image, Row} from 'react-bootstrap';
import Switch from 'react-switch';
import {AuthContext} from '../../contexts/Contexts';
import {Voices} from '../../Enums/Voices';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import './Profile.css';
import {
  deactivateUser,
  deleteUserById,
  updateUser,
} from '../../services/apiService';
import {
  validateEmail,
  validatePasswordFormat,
  validateUsername,
} from '../../services/FormValidationService';
import {AlertType} from '../../Enums/AlertType';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import {DeleteType} from '../../Enums/DeleteType';
import {ProfileIcon} from '../../Enums/ProfileIcon';
import frame from '../../assets/images/profile-icons/frame.png';

function Profile(props) {
  const authContext = useContext(AuthContext);
  const [voiceSelection, setVoiceSelection] = useState(
      authContext.user.settings.voiceSelection,
  );
  const [autoNextPage, setAutoNextPage] = useState(
      authContext.user.settings.autoNextPage,
  );
  const [audioEnabled, setAudioEnabled] = useState(
      authContext.user.settings.audioEnabled,
  );
  const [icon, setIcon] = useState(authContext.user.settings.icon);
  const [editingIcon, setEditingIcon] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [userName, setUserName] = useState(authContext.user.name);
  const [email, setEmail] = useState(authContext.user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleAutoNextPageToggle = async () => {
    await authContext.updateAutoNextPage(autoNextPage, true);
    if (autoNextPage) {
      setAutoNextPage(false);
    } else {
      setAutoNextPage(true);
    }
  };

  const handleAudioEnabledToggle = async () => {
    await authContext.updateAudioEnabled(audioEnabled, true);
    if (audioEnabled) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true);
    }
  };

  const handleVoiceSelectionChange = async (voice) => {
    await authContext.updateVoiceSelection(voice, true);
    setVoiceSelection(voice);
  };

  const handleIconChange = async () => {
    if (icon !== authContext.user.settings.icon) {
      await authContext.updateIconSelection(icon);
      setIcon(icon);
      authContext.handleAlertModalShow(AlertType.SUCCESS, [
        'Avatar updated.',
      ]);
    }
    setEditingIcon(false);
  };

  const getVoiceName = () => {
    for (const [key, value] of Object.entries(Voices)) {
      if (value.voice === voiceSelection) {
        return <span>{value.alt}</span>;
      }
    }
  };

  const validateNameValue = async () => {
    let usernameErrorsList = [];
    if (
      userName.trim().toLowerCase() !==
      authContext.user.name.trim().toLowerCase()
    ) {
      usernameErrorsList = await validateUsername(userName);
      if (usernameErrorsList.length > 0) {
        authContext.handleAlertModalShow(AlertType.ERROR, usernameErrorsList);
      } else {
        await updateNameValue();
        authContext.handleAlertModalShow(AlertType.SUCCESS, [
          'Username updated.',
        ]);
      }
    } else {
      resetNameValue();
    }
  };

  const validateEmailValue = async () => {
    let emailErrorsList = [];
    if (
      email.trim().toLowerCase() !== authContext.user.email.trim().toLowerCase()
    ) {
      emailErrorsList = await validateEmail(email, true);
      if (emailErrorsList.length > 0) {
        authContext.handleAlertModalShow(AlertType.ERROR, emailErrorsList);
      } else {
        await updateEmailValue();
        authContext.handleAlertModalShow(AlertType.SUCCESS, ['Email updated.']);
      }
    } else {
      resetEmailValue();
    }
  };

  const validatePasswordValues = async () => {
    let passwordErrorsList = [];

    if (
      newPassword.length < 1 &&
      currentPassword.length < 1 &&
      newPasswordConfirm.length < 1
    ) {
      setEditingPassword(false);
    } else {
      passwordErrorsList = await validatePasswordFormat(newPassword);

      if (newPassword !== newPasswordConfirm) {
        passwordErrorsList.push('New passwords must match.');
      }

      if (passwordErrorsList.length > 0) {
        authContext.handleAlertModalShow(AlertType.ERROR, passwordErrorsList);
      } else {
        await updatePasswordValues();
      }
    }
  };

  const validateDeletePasswordValues = async () => {
    let passwordErrorsList = [];
    passwordErrorsList = await validatePasswordFormat(deletePassword);
    if (passwordErrorsList.length > 0) {
      authContext.handleAlertModalShow(AlertType.ERROR, passwordErrorsList);
    } else {
      try {
        const userToDelete = authContext.user;
        userToDelete.deletePassword = deletePassword;
        const response = await deactivateUser(userToDelete);
        if (response.status === 200) {
          setShowDeleteModal(false);
          authContext.logout();
        } else if (response.status === 204) {
          authContext.handleAlertModalShow(AlertType.ERROR, [
            'Invalid Password.',
          ]);
        } else {
          authContext.handleAlertModalShow(AlertType.ERROR, [
            'Something went wrong.',
          ]);
        }
      } catch (error) {}
    }
  };

  const updateNameValue = async () => {
    const newUserData = authContext.user;
    newUserData.name = userName;
    try {
      await updateUser(newUserData);
      setEditingName(false);
    } catch (error) {}
  };

  const updateEmailValue = async () => {
    const newUserData = authContext.user;
    newUserData.email = email;
    try {
      await updateUser(newUserData);
      setEditingEmail(false);
    } catch (error) {}
  };

  const updatePasswordValues = async () => {
    const newUserData = authContext.user;
    newUserData.currentPassword = currentPassword;
    newUserData.newPassword = newPassword;
    try {
      const successUpdate = await authContext.updateUserDbPassword(newUserData);

      if (successUpdate) {
        authContext.handleAlertModalShow(AlertType.SUCCESS, [
          'Password updated.',
        ]);
        resetPasswordValues();
      } else {
        authContext.handleAlertModalShow(AlertType.ERROR, [
          'Current Password is not correct.',
        ]);
      }
    } catch (error) {}
  };

  const resetIconValue = () => {
    setEditingIcon(false);
    setIcon(authContext.user.settings.icon);
  };

  const resetNameValue = () => {
    setEditingName(false);
    setUserName(authContext.user.name);
  };

  const resetEmailValue = () => {
    setEditingEmail(false);
    setEmail(authContext.user.email);
  };

  const resetPasswordValues = () => {
    setEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  const resetDeletePasswordValue = () => {
    setDeletePassword('');
  };

  const deleteItem = async () => {
    validateDeletePasswordValues();
  };

  const listIcons = Object.values(ProfileIcon).map((iconObj, i) => (
    <Col className="icon-window-col" key={i}>
      <Image
        className={'icon ' + (iconObj.name === icon ? 'icon-selected' : null)}
        src={iconObj.image}
        onClick={() => setIcon(iconObj.name)}
      ></Image>
    </Col>
  ));

  useEffect(() => {
    setAudioEnabled(authContext.user.settings.audioEnabled);
    setAutoNextPage(authContext.user.settings.autoNextPage);
    setVoiceSelection(authContext.user.settings.voiceSelection);
    setUserName(authContext.user.name);
    setEmail(authContext.user.email);
  }, [authContext.user]);

  return (
    <div
      className="menu-card"
      style={{
        width:
          props.currentWindowSize.width > props.currentWindowSize.height ?
            '50%' :
            '95%',
      }}
    >
      <DeleteModal
        type={DeleteType.USER}
        name={authContext.user.email}
        deleteItem={deleteItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
      ></DeleteModal>
      <div className="title-label">
        <div className="title-label-text">Profile</div>
      </div>
      <div className="menu-container">
        <div className="setting-texts">
          <div className="icon-main-container">
            {editingIcon ? (
              <div className="icon-window">
                <Row className="icon-window-row">{listIcons}</Row>
              </div>
            ) : (
                <Image
                  className="icon-main"
                  src={ProfileIcon[icon].image}
                ></Image>
            )}
          </div>
          {editingIcon ? (
            <div className="editing-buttons-container">
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  resetIconValue();
                }}
              >
                <Image className="edit-button-image" src={close}></Image>
              </Button>
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  handleIconChange();
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
                    setEditingIcon(true);
                  }}
                >
                  <Image className="edit-button-image" src={edit}></Image>
                </Button>
              </div>
          )}
        </div>

        <div className="setting-texts">
          <div>Username</div>
          <Form.Control
            type="text"
            value={userName}
            disabled={!editingName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {editingName ? (
            <div className="editing-buttons-container">
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  resetNameValue();
                }}
              >
                <Image className="edit-button-image" src={close}></Image>
              </Button>
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  validateNameValue();
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
                  setEditingName(true);
                }}
              >
                <Image className="edit-button-image" src={edit}></Image>
              </Button>
            </div>
          )}
        </div>

        <div className="setting-texts">
          <div>Email</div>
          <Form.Control
            type="email"
            value={email}
            disabled={!editingEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          {editingEmail ? (
            <div className="editing-buttons-container">
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  resetEmailValue();
                }}
              >
                <Image className="edit-button-image" src={close}></Image>
              </Button>
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  validateEmailValue();
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
                  setEditingEmail(true);
                }}
              >
                <Image className="edit-button-image" src={edit}></Image>
              </Button>
            </div>
          )}
        </div>
        <div className="setting-texts">
          <div>Current Password</div>
          <Form.Control
            type="password"
            value={currentPassword}
            disabled={!editingPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="setting-texts">
          <div>New Password</div>
          <Form.Control
            type="password"
            value={newPassword}
            disabled={!editingPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="setting-texts">
          <div>Confirm New Password</div>
          <Form.Control
            type="password"
            value={newPasswordConfirm}
            disabled={!editingPassword}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          {editingPassword ? (
            <div className="editing-buttons-container">
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  resetPasswordValues();
                }}
              >
                <Image className="edit-button-image" src={close}></Image>
              </Button>
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => {
                  validatePasswordValues();
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
                  setEditingPassword(true);
                }}
              >
                <Image className="edit-button-image" src={edit}></Image>
              </Button>
            </div>
          )}
        </div>
        <Row className="setting-controls">
          <Col>
            <div className="">
              <div>Auto Next Page</div>
              <Switch
                className="react-switch"
                onChange={() => handleAutoNextPageToggle()}
                checked={autoNextPage}
              />
            </div>
          </Col>
          <Col>
            <div className="">
              <div>Voice Audio</div>
              <Switch
                className="react-switch"
                onChange={() => handleAudioEnabledToggle()}
                checked={audioEnabled}
              />
            </div>
          </Col>
        </Row>

        <Row className="setting-controls">
          {' '}
          <Col>
            Voice
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
                  onClick={() => handleVoiceSelectionChange(Voices.EMILY.voice)}
                >
                  {Voices.EMILY.alt}
                </Dropdown.Item>
                <Dropdown.Item
                  style={
                    voiceSelection === Voices.MARK.voice ?
                      {fontWeight: 'bold'} :
                      {fontWeight: 'normal'}
                  }
                  onClick={() => handleVoiceSelectionChange(Voices.MARK.voice)}
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
          </Col>
        </Row>
        <Button
          className="link-text-button"
          variant="outline-secondary"
          style={{paddingTop: '50px'}}
          onClick={() => {
            resetDeletePasswordValue();
            setShowDeleteModal(true);
          }}
        >
          Deactivate
        </Button>
      </div>
    </div>
  );
}
export default Profile;
