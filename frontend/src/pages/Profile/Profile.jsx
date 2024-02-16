import {React, useContext} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate, Navigate} from 'react-router-dom';
import './Profile.css';
import {AuthContext} from '../../contexts/Contexts';
import {useEffect} from 'react';

function Profile(props) {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log(authContext.isLoggedIn);
  }, [authContext.isLoggedIn]);
  return (
    <div className="page-container">
      {authContext.isLoggedIn ? <div> <Button
        className=""
        variant="outline-secondary"
        onClick={() => {
          authContext.logout();
        }}
      >
          Logout
      </Button></div> : <Navigate to='/' replace={true}></Navigate>}

    </div>
  );
}
export default Profile;
