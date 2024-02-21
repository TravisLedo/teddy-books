import {React, useState, useContext} from 'react';
import {addNewUser} from '../../services/apiService';
import {Button, Form, Modal} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './LoginModal.css';

function LoginModal(props) {
  const authContext = useContext(AuthContext);
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

  const resetForms = async () => {
    setRegistering(false);
    setEmail(null);
    setPassword(null);
    setName(null);
    setPasswordConfirm(null);
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
    // todo: add validation checks
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Control
                type="text"
                placeholder="Display Name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordConfirm">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <div className="button-container">
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  setRegistering(false);
                }}
              >
                Back
              </Button>
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  register();
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
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
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  login();
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
                    setRegistering(true);
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
