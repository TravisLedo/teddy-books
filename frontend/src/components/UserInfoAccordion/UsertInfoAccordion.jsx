import {React, useState, useContext} from 'react';
import {deleteUserById, updateUser} from '../../services/apiService';
import {Button, Form, Image, Accordion} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import trash from '../../assets/images/trash.png';
import './UserInfoAccordion.css';
import {validateEmail, validateIsAdmin, validateIsBlocked, validateUsername} from '../../services/FormValidationService';
import DeleteModal from '../DeleteModal/DeleteModal';
import {AlertType} from '../../Enums/AlertType';
import {DeleteType} from '../../Enums/DeleteType';

function UserInfoAccordion(props) {
  const authContext = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(props.user.email);
  const [userName, setUserName] = useState(props.user.name);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin);
  const [isBlocked, setIsBlocked] = useState(props.user.isBlocked);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const resetValues = () => {
    setEditing(false);
    setEmail(props.user.email);
    setUserName(props.user.name);
    setIsAdmin(props.user.isAdmin);
    setIsBlocked(props.user.isBlocked);
  };

  const updateUserValues = async () => {
    const newUserData = props.user;
    newUserData.email = email.trim();
    newUserData.name = userName.trim();
    newUserData.isAdmin = isAdmin;
    newUserData.isBlocked = isBlocked;
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
      isBlockedErrors = await validateIsBlocked(isAdmin);
    }
    const errorsList = usernameErrorsList.concat(emailErrorsList).concat(isAdminErrorsList).concat(isBlockedErrors);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      updateUserValues();
    }
  };


  const deleteItem = async () => {
    try {
      await deleteUserById(props.user._id);
      setShowDeleteModal(false);
      props.refreshData();
      if (authContext.user._id === props.user._id) {
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
            <Form.Label>ID:</Form.Label>
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
        </Form> : null}
      </Accordion.Body>
    </Accordion.Item>


  );
}
export default UserInfoAccordion;
