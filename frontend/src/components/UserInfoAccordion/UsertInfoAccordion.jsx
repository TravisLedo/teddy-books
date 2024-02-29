import {React, useState, useContext} from 'react';
import {addNewUser, updateUserById} from '../../services/apiService';
import {Button, Form, Modal, Image, Accordion} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import './UserInfoAccordion.css';

function UserInfoAccordion(props) {
  const authContext = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(props.user.email);
  const [password, setPassword] = useState(props.user.password);
  const [name, setName] = useState(props.user.name);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin);
  const [isBlocked, setIsBlocked] = useState(props.user.isBlocked);

  const resetValues = () => {
    setEditing(false);
    setEmail();
    setPassword();
    setName();
    setIsAdmin();
    setIsBlocked();
  };

  const updateValues = async () => {
    const newUserData = props.user;
    newUserData.email = email;
    newUserData.name = name;
    newUserData.password = password;
    newUserData.isAdmin = isAdmin;
    newUserData.isBlocked = isBlocked;
    try {
      await updateUserById(newUserData);
      setEditing(false);
    } catch (error) {}
  };

  return (
    <Accordion.Item eventKey={props.user._id}>
      <Accordion.Header>{props.user.email} ({props.user._id})</Accordion.Header>
      <Accordion.Body>
        {editing ? (
          <div className="editing-buttons-container">
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                resetValues();
              }}
            >
              <Image className="control-button-image" src={close}></Image>
            </Button>
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                updateValues();
              }}
            >
              <Image className="control-button-image" src={check}></Image>
            </Button>
          </div>
        ) : (
          <div className="editing-buttons-container">
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                setEditing(true);
              }}
            >
              <Image className="control-button-image" src={edit}></Image>
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
          </Form.Group>
          <Form.Group className="mb-3" controlId="id">
            <Form.Label>Last Login</Form.Label>
            <Form.Control
              type="text"
              value={props.user.lastLogin}
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
          <Form.Group className="mb-3" controlId="[password]">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="text"
              placeholder="password"
              value={password}
              disabled={!editing}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Name">
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              disabled={!editing}
              onChange={(e) => setName(e.target.value)}
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
        </Form> : null}
      </Accordion.Body>
    </Accordion.Item>


  );
}
export default UserInfoAccordion;
