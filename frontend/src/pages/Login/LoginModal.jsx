import {React, useState, useContext} from 'react';
import {loginUser} from '../../services/apiService';
import {Button, Form, Modal} from 'react-bootstrap';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './LoginModal.css';
import {AuthContext} from '../../contexts/Contexts';

function LoginModal(props) {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const tokenResponse = await loginUser({email: email, password: password});
      if (tokenResponse) {
        authContext.login(tokenResponse);
        authContext.handleLoginModalClose();
      }
    } catch (error) {
      console.log('Login Failed.', error);
    }
  };


  return (
    <Modal
      show={authContext.showLoginModal}
      onHide={authContext.handleLoginModalClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <div className='button-container'>
            <Button
              variant="outline-secondary"
              onClick={() => {
                authContext.handleLoginModalClose();
              }}
            >Cancel
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => {
                login();
              }}
            >Login
            </Button>
            <Link className='register-link' >Register</Link>
          </div>


        </Form>
      </Modal.Body>
    </Modal>


  );
}
export default LoginModal;
