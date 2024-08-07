import {React, useState, useContext, useEffect} from 'react';
import {addNewUser, getUserByEmail, requestEmailResetCode, updateUser, resetPassword} from '../../services/apiService';
import {Button, Form, Modal} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './LoginModal.css';
import {validateEmail, validatePasswordFormat, validateUsername} from '../../services/FormValidationService';
import {AlertType} from '../../Enums/AlertType';
import {LoginModalType} from '../../Enums/LoginModalType';
import {useNavigate} from 'react-router-dom';
import {
  decodeJwtToken,
} from '../../services/localStorageService';

function LoginModal(props) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const resetForms = async () => {
    setEmail('');
    setPassword('');
    setName('');
    setPasswordConfirm('');
  };

  const login = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };
      await authContext.login(user);
      cancelModal();
    } catch (error) {
      if (!error.response) {
        authContext.handleAlertModalShow(AlertType.ERROR, ['Server Error']);
      } else if (error.response.status === 401 ) {
        authContext.handleAlertModalShow(AlertType.ERROR, ['Invalid Credentials.']);
      } else {
        authContext.handleAlertModalShow(AlertType.ERROR, ['Server Error']);
      }
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
      authContext.handleAlertModalShow(AlertType.ERROR, ['Server Error']);
    }
  };

  const validateRegisterFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    let passwordErrorsList = [];
    usernameErrorsList = await validateUsername(name);
    emailErrorsList = await validateEmail(email, true);
    passwordErrorsList = await validatePasswordFormat(password);

    if (props.registering && password !== passwordConfirm) {
      passwordErrorsList.push('Passwords must match.');
    }

    const errorsList = emailErrorsList.concat(usernameErrorsList).concat(passwordErrorsList);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
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
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      login();
    }
  };


  const validateEmailForResetLink = async () => {
    let emailErrorsList = [];
    emailErrorsList = await validateEmail(email, false);
    if (emailErrorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, emailErrorsList);
    } else {
      sendForgetPasswordRequest();
    }
  };

  const sendForgetPasswordRequest = async () => {
    try {
      const data = {email: email, siteBaseUrl: process.env.REACT_APP_FRONTEND_URL};
      await requestEmailResetCode(data);
      cancelModal();
      authContext.handleAlertModalShow(AlertType.SUCCESS, ['A reset password link has been sent to ' + email + ' if the account exists.']);
    } catch (error) {
    }
  };

  const validateResetPasswordFields= async () => {
    let emailErrorsList = [];
    let passwordErrorsList = [];
    emailErrorsList = await validateEmail(email, false);
    passwordErrorsList = await validatePasswordFormat(password);

    if (props.loginModalType === LoginModalType.RESET_PASSWORD && password !== passwordConfirm) {
      passwordErrorsList.push('Passwords must match.');
    }

    const errorsList = emailErrorsList.concat(passwordErrorsList);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      updateUserPassword();
    }
  };


  const updateUserPassword = async () => {
    try {
      const data = {token: props.resetPasswordToken, email: email, newPassword: password};
      const response = await resetPassword(data);
      if (response.status === 200) {
        authContext.handleLoginModalClose();
        authContext.handleAlertModalShow(AlertType.SUCCESS, ['Password reset successful. Please log in.']);
      } else if (response.status === 204) {
        authContext.handleAlertModalShow(AlertType.ERROR, ['Password reset request expired or does not exist. Try requesting a new link.']);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelModal= async () => {
    if (props.loginModalType === LoginModalType.RESET_PASSWORD) {
      navigate('/');
    }
    authContext.handleLoginModalClose();
  };

  useEffect(() => {
    if (props.loginModalType === LoginModalType.RESET_PASSWORD) {
      setEmail(decodeJwtToken(props.resetPasswordToken).email);
    }
  }, [props.loginModalType, props.resetPasswordToken]);


  return (
    <Modal
      backdrop='static'
      tabIndex="0"
      autoFocus={false}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (props.loginModalType === LoginModalType.LOGIN || props.loginModalType === LoginModalType.EXPIRED) {
            validateLoginFields();
          } else if (props.loginModalType === LoginModalType.REGISTER) {
            validateRegisterFields();
          } else if (props.loginModalType === LoginModalType.FORGOT_PASSWORD) {
            validateResetPasswordFields();
          }
        }
      }}
      show={props.showLoginModal}
      onHide={() => {
        cancelModal();
      }}
      onShow={() => {
        resetForms();
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.loginModalType}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {props.loginModalType === LoginModalType.LOGIN || props.loginModalType === LoginModalType.EXPIRED? (
          <div>
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
                {props.loginModalType !== LoginModalType.EXPIRED ? <Button
                  className="link-text-button"
                  variant="outline-secondary"
                  onClick={() => {
                    authContext.setLoginModalType(LoginModalType.FORGOT_PASSWORD);
                  }}
                >
                  Forgot Password
                </Button> : null}

              </Form.Group>
              <div className="button-container">
                <Button
                  className="standard-button"
                  variant="outline-secondary"
                  onClick={() => {
                    cancelModal();
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

              {props.loginModalType === LoginModalType.LOGIN ? <div className="button-container mt-2">
                <Button
                  className="link-text-button"
                  variant="outline-secondary"
                  onClick={() => {
                    authContext.setLoginModalType(LoginModalType.REGISTER);
                  }}
                >
                  New Account
                </Button>
              </div> :null}

            </Form>
          </div>


        ) : props.loginModalType === LoginModalType.FORGOT_PASSWORD ? (
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
                  validateEmailForResetLink();
                }}
              >
                Send Link
              </Button>
            </Form.Group>
            <div className="button-container">
              <Button
                className="standard-button"
                variant="outline-secondary"
                onClick={() => {
                  authContext.setLoginModalType(LoginModalType.LOGIN);
                }}
              >
                Back
              </Button>
            </div>
          </Form>

) : props.loginModalType === LoginModalType.REGISTER ? (

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
          authContext.setLoginModalType(LoginModalType.LOGIN);
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
        ) : <Form className="form-container">
          <Form.Group className="mb-3" controlId='email'>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='password'>
            <Form.Control
              type="password"
              placeholder="New Password"
              value={password}
              autoFocus={true}
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
                cancelModal();
              }}
            >
            Cancel
            </Button>
            <Button
              className="standard-button btn-custom"
              onClick={() => {
                validateResetPasswordFields();
              }}
            >
            Reset Password
            </Button>
          </div>
        </Form>}
      </Modal.Body>

    </Modal>
  );
}
export default LoginModal;
