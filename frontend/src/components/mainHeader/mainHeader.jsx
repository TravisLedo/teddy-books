import {Link} from 'react-router-dom';
import {Button, Dropdown} from 'react-bootstrap';
import {React, useContext} from 'react';
import {AuthContext} from '../../contexts/Contexts';
import {getLocalUser} from '../../services/localStorageService';
import {LoginModalType} from '../../Enums/LoginModalType';

import './mainHeader.css';

export default function MainHeader() {
  const authContext = useContext(AuthContext);

  return (
    <div className="main-navbar">
      <Link className="logo-link" to={'/'}>
        <img
          className="logo-image"
          src={require('../../assets/images/logo.png')}
          alt="logo"
        />
      </Link>
      <div className="menu-button-container">
        {authContext.user && getLocalUser() ? (
          <div>
            <Dropdown className="standard-button">
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                {authContext.user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={'/profile'}>
                  Profile
                </Dropdown.Item>
                {authContext.user.isAdmin ? (
                  <Dropdown.Item as={Link} to={'/admin'}>
                    Admin
                  </Dropdown.Item>
                ) : null}
                <Dropdown.Item onClick={authContext.logout}>
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <Button
            className="standard-button"
            variant="outline-secondary"
            onClick={() => authContext.handleLoginModalShow(LoginModalType.LOGIN, true)}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
