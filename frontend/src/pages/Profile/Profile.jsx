import {React, useContext} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate, Navigate} from 'react-router-dom';
import './Profile.css';
import {AuthContext} from '../../contexts/Contexts';
import {useEffect} from 'react';

function Profile(props) {
  const authContext = useContext(AuthContext);

  return (
    <div className="page-container">
      <div> <Button
        className=""
        variant="outline-secondary"
        onClick={() => {
          authContext.logout();
        }}
      >
          Logout
      </Button></div>

    </div>
  );
}
export default Profile;
