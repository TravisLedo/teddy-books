import {React, useState, useContext} from 'react';
import {deleteUserById, updateUser} from '../../services/apiService';
import {Button, Form, Image, Accordion, Dropdown} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import trash from '../../assets/images/trash.png';
import './UserInfoAccordion.css';
import {validateEmail, validateIconName, validateIsAdmin, validateIsBlocked, validateUsername, validateVoiceName} from '../../services/FormValidationService';
import DeleteModal from '../DeleteModal/DeleteModal';
import {AlertType} from '../../Enums/AlertType';
import {DeleteType} from '../../Enums/DeleteType';

function UserInfoAccordion(props) {
  const authContext = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(props.user.email);
  const [userName, setUserName] = useState(props.user.name);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin.toString());
  const [isBlocked, setIsBlocked] = useState(props.user.isBlocked.toString());
  const [voiceSelection, setVoiceSelection] = useState(
      props.user.settings.voiceSelection.toUpperCase(),
  );
  const [autoNextPage, setAutoNextPage] = useState(
      props.user.settings.autoNextPage.toString(),
  );
  const [audioEnabled, setAudioEnabled] = useState(
      props.user.settings.audioEnabled.toString(),
  );
  const [icon, setIcon] = useState(props.user.settings.icon.toUpperCase());

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const resetValues = () => {
    setEditing(false);
    setEmail(props.user.email);
    setUserName(props.user.name);
    setIsAdmin(props.user.isAdmin.toString());
    setIsBlocked(props.user.isBlocked.toString());
    setAudioEnabled(props.user.settings.audioEnabled.toString());
    setAutoNextPage(props.user.settings.autoNextPage.toString());
    setIcon(props.user.settings.icon);
  };

  const updateUserValues = async () => {
    const newUserData = props.user;
    newUserData.email = email.trim();
    newUserData.name = userName.trim();
    newUserData.isAdmin = (isAdmin.trim().toLowerCase() === 'true');
    newUserData.isBlocked = (isBlocked.trim().toLowerCase() === 'true');
    newUserData.settings.audioEnabled = (audioEnabled.trim().toLowerCase() === 'true');
    newUserData.settings.autoNextPage = (autoNextPage.trim().toLowerCase() === 'true');
    newUserData.settings.icon = icon.trim().toUpperCase();
    newUserData.settings.voiceSelection = voiceSelection.trim().toUpperCase();

    setAudioEnabled(audioEnabled.trim().toLowerCase());
    setAutoNextPage(autoNextPage.trim().toLowerCase());
    setIsAdmin(isAdmin.trim().toLowerCase());
    setIsBlocked(isBlocked.trim().toLowerCase());
    setVoiceSelection(voiceSelection.trim().toUpperCase());
    setIcon(icon.trim().toUpperCase());

    try {
      const updatedUserData = await updateUser(newUserData);
      props.refreshData();
      if (updatedUserData._id === authContext.user._id) {
        authContext.setUser(updatedUserData);
      }
      setEditing(false);
    } catch (error) {}
  };

  const validateFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    let isAdminErrorsList = [];
    let isBlockedErrors = [];
    let iconErrors = [];
    let voiceSelectionErrors = [];

    if (userName.trim().toLowerCase() !== props.user.name.trim().toLowerCase()) {
      usernameErrorsList = await validateUsername(userName);
    }
    if (email.trim().toLowerCase() !== props.user.email.trim().toLowerCase()) {
      emailErrorsList = await validateEmail(email, true);
    }
    if (isAdmin !== props.user.isAdmin) {
      isAdminErrorsList = await validateIsAdmin(isAdmin);
    }
    if (isBlocked !== props.user.isBlocked) {
      isBlockedErrors = await validateIsBlocked(isBlocked);
    }

    if (icon !== props.user.settings.icon) {
      iconErrors = await validateIconName(icon.trim());
    }

    if (voiceSelection !== props.user.settings.voiceSelection) {
      voiceSelectionErrors = await validateVoiceName(voiceSelection.trim());
    }

    const errorsList = usernameErrorsList.concat(emailErrorsList).concat(isAdminErrorsList).concat(isBlockedErrors).concat(iconErrors).concat(voiceSelectionErrors);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      updateUserValues();
    }
  };

  const deleteItem = async () => {
    try {
      const response = await deleteUserById(props.user._id);
      setShowDeleteModal(false);
      props.refreshData();
      if (response.status === 200 && authContext.user._id === props.user._id) {
        authContext.logout();
      }
    } catch (error) {}
  };


  return (
    <Accordion.Item eventKey={props.user._id}>
      <DeleteModal
        type={DeleteType.USER_ADMIN}
        name={props.user.email}
        deleteItem={deleteItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      ></DeleteModal>
      <Accordion.Header>{props.user.email}</Accordion.Header>
      <Accordion.Body>
        {editing ? (
          <div className="editing-buttons-container">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              <Image className="edit-button-image" src={trash}></Image>
            </Button>
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
        {props.user ? <Form className="form-container">
          <Form.Group className="mb-3" controlId='userId'>
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              value={props.user._id}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              disabled={!editing}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='username'>
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              placeholder="Name"
              value={userName}
              disabled={!editing}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='isAdmin'>
            <Form.Label>Admin</Form.Label>
            <Form.Control
              type="text"
              placeholder="Is Admin"
              value={isAdmin}
              disabled={!editing}
              onChange={(e) => setIsAdmin(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='isBlocked'>
            <Form.Label>Blocked</Form.Label>
            <Form.Control
              type="text"
              placeholder="Is Blocked"
              value={isBlocked}
              disabled={!editing}
              onChange={(e) => setIsBlocked(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='created'>
            <Form.Label>Created</Form.Label>
            <Form.Control
              type="text"
              value={props.user.createdAt}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='modified'>
            <Form.Label>Modified</Form.Label>
            <Form.Control
              type="text"
              value={props.user.updatedAt}
              disabled
            />
            <Form.Group className="mb-3" controlId='lastLogin'>
              <Form.Label>Last Login</Form.Label>
              <Form.Control
                type="text"
                value={props.user.lastLogin}
                disabled
              />
            </Form.Group>
          </Form.Group>
          <Form.Group className="mb-3" controlId='audioEnabled'>
            <Form.Label>Audio Enabled</Form.Label>
            <Form.Control
              type="text"
              placeholder="Audio Enabled"
              value={audioEnabled}
              disabled={!editing}
              onChange={(e) => setAudioEnabled(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='autoNextPage'>
            <Form.Label>Auto Next Page</Form.Label>
            <Form.Control
              type="text"
              placeholder="Auto Next Page"
              value={autoNextPage}
              disabled={!editing}
              onChange={(e) => setAutoNextPage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='voiceSelection'>
            <Form.Label>Voice Selection</Form.Label>
            <Form.Control
              type="text"
              placeholder="Voice Selection"
              value={voiceSelection}
              disabled={!editing}
              onChange={(e) => setVoiceSelection(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='icon'>
            <Form.Label>Icon</Form.Label>
            <Form.Control
              type="text"
              placeholder="Icon"
              value={icon}
              disabled={!editing}
              onChange={(e) => setIcon(e.target.value)}
            />
          </Form.Group>
        </Form> : null}
      </Accordion.Body>
    </Accordion.Item>


  );
}
export default UserInfoAccordion;
