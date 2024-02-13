import {React, useState, useContext} from 'react';
import {addNewUser, loginUser} from '../../services/apiService';
import {Button, Form} from 'react-bootstrap';
import {Navigate, useNavigate} from 'react-router-dom';
import './Register.css';
import {AuthContext} from '../../contexts/Contexts';
import {getUserObjectFromJwt} from '../../services/localStorageService';

function Register(props) {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const register = async ()=>{
    // todo: add validation checks
    const userData = {
      email: email,
      name: name,
      password: password,
    };
    const response = await addNewUser(userData);
    if (response) {
      authContext.login(response);
    }
  };

  return (
    <div className="page-container">
      { !authContext.isLoggedIn ? <Form className="form-container">
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
            register();
          }}
        >
            Register
        </Button>
      </Form>: <Navigate to='/'></Navigate>
      }

    </div>
  );
}
export default Register;
