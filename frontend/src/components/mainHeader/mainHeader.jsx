import {Link} from 'react-router-dom';
import {Button, Dropdown} from 'react-bootstrap';
import {React, useContext} from 'react';
import {AuthContext} from '../../contexts/Contexts';
import {getLocalUser} from '../../services/localStorageService';

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

      <Link
        to={'/'}
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
      </Link>
      <div style={{position: 'absolute', right: 20, display: 'flex'}}>
        {authContext.user && getLocalUser() ? <div>

          <Dropdown className='standard-button'>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {authContext.user.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={'/profile'}>Profile</Dropdown.Item>
              { authContext.user.isAdmin ? <Dropdown.Item as={Link} to={'/admin'}>Admin</Dropdown.Item> : null}
              <Dropdown.Item onClick={authContext.logout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> :
          <Button className='standard-button' variant='outline-secondary' onClick={()=>authContext.handleLoginModalShow(true)}>Login</Button>
        }
      </div>
    </div>
  );
}
