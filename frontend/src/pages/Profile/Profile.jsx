import {React, useContext} from 'react';
import {Button} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './Profile.css';

function Profile() {
  const authContext = useContext(AuthContext);

  return (
    <div className="page-container">
      <div>
        {' '}
        <Button
          className=""
          variant="outline-secondary"
          onClick={() => {
            authContext.logout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
export default Profile;
