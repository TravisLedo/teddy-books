import {React, useState, useContext} from 'react';
import {loginUser} from '../../services/apiService';
import {Button, Form} from 'react-bootstrap';
import {Navigate, useNavigate} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './Login.css';
import {AuthContext} from '../../contexts/Contexts';

function Login(props) {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const login = async () => {
    try {
      const tokenResponse = await loginUser({email: email, password: password});
      console.log(tokenResponse);
      if (tokenResponse) {
        // authContext.setJwtToken(tokenResponse);
        authContext.login(tokenResponse);
        // localStorage.setItem('jwtToken', tokenResponse);
        // convertToken(tokenResponse)
      }
    } catch (error) {
      console.log('Login Failed.', error);
    }
  };


  return (
    <div className="page-container">
      {authContext.isLoggedIn ? <Navigate to='/' replace={true}></Navigate> : <Form className="form-container">
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
        <Button
          className="control-button"
          variant="outline-secondary"
          onClick={() => {
            navigate('/');
          }}
        >
            Cancel
        </Button>
        <Button
          className="control-button"
          variant="outline-secondary"
          onClick={() => {
            login();
          }}
        >
            Login
        </Button>
        <Nav.Link className='register-link' href="/register">Register</Nav.Link>
      </Form>}

    </div>
  );
}
export default Login;
