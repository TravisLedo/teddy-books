import {React, useState, useContext} from 'react';
import {updateUser} from '../../services/apiService';
import {Button, Form, Image, Accordion} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import './UserInfoAccordion.css';
import {validateEmail, validateIsAdmin, validateIsBlocked, validateUsername} from '../../services/FormValidationService';

function UserInfoAccordion(props) {
  const authContext = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(props.user.email);
  const [userName, setUserName] = useState(props.user.name);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin);
  const [isBlocked, setIsBlocked] = useState(props.user.isBlocked);

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
      await updateUser(newUserData);
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
      authContext.handleErrorModalShow(errorsList);
    } else {
      updateUserValues();
    }
  };

  return (
    <Accordion.Item eventKey={props.user._id}>
      <Accordion.Header>{props.user.email}</Accordion.Header>
      <Accordion.Body>
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
        {props.user ? <Form className="form-container">
          <Form.Group className="mb-3" controlId="id">
            <Form.Label>ID:</Form.Label>
            <Form.Control
              type="text"
              value={props.user._id}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              disabled={!editing}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Name">
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              placeholder="Name"
              value={userName}
              disabled={!editing}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="isAdmin">
            <Form.Label>Admin</Form.Label>
            <Form.Control
              type="text"
              placeholder="Is Admin"
              value={isAdmin}
              disabled={!editing}
              onChange={(e) => setIsAdmin(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="isBlocked">
            <Form.Label>Blocked</Form.Label>
            <Form.Control
              type="text"
              placeholder="Is Blocked"
              value={isBlocked}
              disabled={!editing}
              onChange={(e) => setIsBlocked(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="id">
            <Form.Label>Created</Form.Label>
            <Form.Control
              type="text"
              value={props.user.createdAt}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="id">
            <Form.Label>Modified</Form.Label>
            <Form.Control
              type="text"
              value={props.user.updatedAt}
              disabled
            />
            <Form.Group className="mb-3" controlId="id">
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
