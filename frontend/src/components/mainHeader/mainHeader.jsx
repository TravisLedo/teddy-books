import {Link} from 'react-router-dom';
import {Button, Dropdown, Image} from 'react-bootstrap';
import {React, useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../contexts/Contexts';
import {getLocalUser} from '../../services/localStorageService';
import {LoginModalType} from '../../Enums/LoginModalType';
import user from '../../assets/images/user.png';

import './mainHeader.css';
import {ProfileIcon} from '../../Enums/ProfileIcon';

export default function MainHeader() {
  const authContext = useContext(AuthContext);

  const trimUsername =()=>{
    const username = authContext.user.name;

    if (username.length > 20) {
      return authContext.user.name.substring(0, 17) + '...';
    } else {
      return authContext.user.name;
    }
  };

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
                <Image
                  className="like-button"
                  rounded
                  src={ProfileIcon[authContext.user.settings.icon].image}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className='username'>{trimUsername()} </div>
                <hr></hr>
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
