import {React, useState, useContext} from 'react';
import {addNewUser} from '../../services/apiService';
import {Button, Form, Modal} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './LoginModal.css';
import {validateEmail, validatePasswordFormat, validateUsername} from '../../services/FormValidationService';

function LoginModal(props) {
  const authContext = useContext(AuthContext);
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const resetForms = async () => {
    setRegistering(false);
    setEmail('');
    setPassword('');
    setName('');
    setPasswordConfirm('');
  };

  const switchForm = async (registering) => {
    setRegistering(registering);
  };


  const login = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };
      authContext.login(user);
      authContext.handleLoginModalClose();
    } catch (error) {
      console.log('Error Logging in: ', error);
    }
  };

  const register = async () => {
    const userData = {
      email: email,
      name: name,
      password: password,
    };
    try {
      const response = await addNewUser(userData);
      if (response) {
        login();
      }
    } catch (error) {
      console.log('Error creating new user: ', error);
    }
  };

  const validateRegisterFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    let passwordErrorsList = [];
    usernameErrorsList = await validateUsername(name);
    emailErrorsList = await validateEmail(email, true);
    passwordErrorsList = await validatePasswordFormat(password);

    if (registering && password !== passwordConfirm) {
      passwordErrorsList.push('Passwords must match.');
    }

    const errorsList = emailErrorsList.concat(usernameErrorsList).concat(passwordErrorsList);
    if (errorsList.length>0) {
      authContext.handleErrorModalShow(errorsList);
    } else {
      register();
    }
  };

  const validateLoginFields = async () => {
    let emailErrorsList = [];
    let passwordErrorsList = [];

    emailErrorsList = await validateEmail(email, false);
    passwordErrorsList = await validatePasswordFormat(password);
    const errorsList = emailErrorsList.concat(passwordErrorsList);

    if (errorsList.length>0) {
      authContext.handleErrorModalShow(errorsList);
    } else {
      login();
    }
  };

  return (
    <Modal
      show={props.showLoginModal}
      onHide={() => {
        authContext.handleLoginModalClose();
      }}
      onShow={() => {
        resetForms();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {!registering && !props.allowRegistering ? (
          <Modal.Title>Session has ended, please log back in.</Modal.Title>
        ) : !registering && props.allowRegistering ? (
          <Modal.Title>Login</Modal.Title>
        ) : (
          <Modal.Title>Create New Account</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        {registering && props.allowRegistering ? (
          <Form className="form-container">
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Control
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordConfirm">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <div className="button-container">
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  switchForm(false);
                }}
              >
                Back
              </Button>
              <Button
                className="standard-button btn-custom"
                onClick={() => {
                  validateRegisterFields();
                }}
              >
                Register
              </Button>
            </div>
          </Form>
        ) : (
          <Form className="form-container">
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="button-container">
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  authContext.handleLoginModalClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className="standard-button btn-custom"
                onClick={() => {
                  validateLoginFields();
                }}
              >
                Login
              </Button>
            </div>

            {props.allowRegistering ? (
              <div className="button-container">
                <Button
                  className="link-text-button"
                  variant="outline-secondary"
                  onClick={() => {
                    switchForm(true);
                  }}
                >
                  Register
                </Button>
              </div>
            ) : null}
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default LoginModal;
