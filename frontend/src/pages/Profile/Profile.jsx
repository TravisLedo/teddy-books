import {React, useContext} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate, Navigate} from 'react-router-dom';
import './Profile.css';
import {AuthContext} from '../../contexts/Contexts';
import {useEffect} from 'react';

function Profile(props) {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandler = () => {
    authContext.logout();
  };

  console.log(authContext.isLoggedIn);

  useEffect(() => {
    console.log(authContext.isLoggedIn);
  }, [authContext.isLoggedIn]);
  // <Navigate to={{pathname: '/login'}} />
  return (
    <div className="page-container">
      {authContext.isLoggedIn ? <div> <Button
        className=""
        variant="outline-secondary"
        onClick={() => {
          logoutHandler();
        }}
      >
          Logout
      </Button></div> : <Navigate to='/login' replace={true}></Navigate>}

    </div>
  );
}
export default Profile;
