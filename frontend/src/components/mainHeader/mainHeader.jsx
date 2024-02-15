import Nav from 'react-bootstrap/Nav';
import {Button, Dropdown} from 'react-bootstrap';
import {React, useContext} from 'react';
import {AuthContext} from '../../contexts/Contexts';
import {getLocalUser, getUserObjectFromJwt} from '../../services/localStorageService';

export default function MainHeader(props) {
  const authContext = useContext(AuthContext);

  return (
    <div
      style={{
        display: 'flex',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        zIndex: 99,
        height: '8vh',
        width: '100%',
        backgroundColor: '#FFF',
        borderColor: 'black',
        borderStyle: 'solid',
        border: 0,
        borderBottomWidth: 1,
        boxShadow: '1px 5px 5px  rgb(0 0 0 / 50%)',
      }}
    >

      <Nav.Link
        href="/"
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          maxWidth: '60%',
          height: '100%',
          objectFit: 'contain',
        }}
      >
        <img
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          src={require('../../assets/images/logo.png')}
          alt="logo"
        />
      </Nav.Link>
      <div style={{position: 'absolute', right: 20, display: 'flex'}}>
        {authContext.isLoggedIn? <div>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {getUserObjectFromJwt(getLocalUser()).user.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/profile">Settings</Dropdown.Item>
              { authContext.isLoggedIn && getUserObjectFromJwt(getLocalUser()).user.isAdmin ? <Dropdown.Item href="/admin">Admin</Dropdown.Item> : null}
              <Dropdown.Item onClick={authContext.logout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> :
        <Nav.Link href="/login" >
          <Button variant='outline-secondary'>Login</Button>
        </Nav.Link>}

      </div>


    </div>
  );
}
