import {React, useState, useContext, useEffect} from 'react';
import {addNewUser, getUserByEmail, requestEmailResetCode} from '../../services/apiService';
import {Button, Form, Modal} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './LoginModal.css';
import {validateEmail, validatePasswordFormat, validateUsername} from '../../services/FormValidationService';

function LoginModal(props) {
  const authContext = useContext(AuthContext);
  const [registering, setRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const resetForms = async () => {
    setRegistering(false);
    setEmail('');
    setPassword('');
    setName('');
    setPasswordConfirm('');
    setVerificationCode('');
    setIsResettingPassword(false);
  };

  const login = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };
      const successLogin = await authContext.login(user);
      if (successLogin) {
        authContext.handleLoginModalClose();
      } else {
        authContext.handleErrorModalShow(['Login Failed']);
      }
    } catch (error) {
      authContext.handleErrorModalShow(['Server Error']);
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
      authContext.handleErrorModalShow(['Server Error']);
    }
  };

  const validateRegisterFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    let passwordErrorsList = [];
    usernameErrorsList = await validateUsername(name, true);
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

  const sendForgetPasswordRequest = async () => {
    await requestEmailResetCode(email);
    // Need to validate email exists first, disable editing of email once they send code. Add a timer to try again, same time as token expire.
    // send them an email with a x digit code, they have to use that code to put with the new password.
  };

  const validateEmailForCode = async () => {
    let emailErrorsList = [];
    emailErrorsList = await validateEmail(email, false);
    if (emailErrorsList.length>0) {
      authContext.handleErrorModalShow(emailErrorsList);
    } else {
      const user = await getUserByEmail(email);
      if (user) {
        sendForgetPasswordRequest();
      } else {
        emailErrorsList.push('Email is not registered.');
        authContext.handleErrorModalShow(emailErrorsList);
      }
    }
  };


  return (
    <Modal
      tabIndex="0"
      autoFocus={false}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!registering && !isResettingPassword) {
            validateLoginFields();
          } else if (registering && !isResettingPassword) {
            validateRegisterFields();
          } else if (isResettingPassword) {
            // validate reset fields;
          }
        }
      }}
      show={props.showLoginModal}
      onHide={() => {
        authContext.handleLoginModalClose();
      }}
      onShow={() => {
        resetForms();
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {!registering && !props.allowRegistering && !isResettingPassword? (
          <Modal.Title>Session Expired</Modal.Title>
        ) : !registering && props.allowRegistering && !isResettingPassword? (
          <Modal.Title>Login</Modal.Title>
        ) : !registering && isResettingPassword ? (
          <Modal.Title>Password Reset</Modal.Title>
        ) : <Modal.Title>Create New Account</Modal.Title>
        }
      </Modal.Header>

      <Modal.Body>
        {registering && props.allowRegistering ? (
        <Form className="form-container">
          <Form.Group className="mb-3" controlId='email'>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='username'>
            <Form.Control
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='password'>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='passwordConfirm'>
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
                setRegistering(false);
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
        ) : isResettingPassword ? (
          <Form className="form-container">
            <Form.Group className="mb-3" controlId='email'>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={true}
              />
              <Button
                className="standard-button btn-custom"
                onClick={() => {
                  validateEmailForCode();
                }}
              >
                Send Code
              </Button>
            </Form.Group>
            <Form.Group className="mb-3" controlId='code'>
              <Form.Control
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId='password'>
              <Form.Control
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId='passwordConfirm'>
              <Form.Control
                type="password"
                placeholder="Confirm New Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <div className="button-container">
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  setRegistering(false);
                  setIsResettingPassword(false);
                }}
              >
                Back
              </Button>
              <Button
                className="standard-button btn-custom"
                onClick={() => {
                }}
              >
                Reset Password
              </Button>
            </div>
          </Form>

) : (<div>
  <Form className="form-container">
    <Form.Group className="mb-3" controlId='email'>
      <Form.Control
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus={true}
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId='password'>
      <Form.Control
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className="link-text-button"
        variant="outline-secondary"
        onClick={() => {
          setIsResettingPassword(true);
          setRegistering(false);
        }}
      >
                  Forgot Password
      </Button>
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
              <div className="button-container mt-2">
                <Button
                  className="link-text-button"
                  variant="outline-secondary"
                  onClick={() => {
                    setRegistering(true);
                  }}
                >
                  New Account
                </Button>
              </div>
            ) : null}
  </Form>
</div>
        )}
      </Modal.Body>

    </Modal>
  );
}
export default LoginModal;
