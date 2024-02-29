import {React, useContext} from 'react';
import {Button, Form} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './Profile.css';

function Profile(props) {
  const authContext = useContext(AuthContext);

  return (
    <div className='menu-card' style={{
      width:
          props.currentWindowSize.width > props.currentWindowSize.height ?
            '75vw' :
            '95vw',
    }}>
      <div className="title-label">
        <div className="title-label-text">Profile</div>
      </div>
      <div className='menu-container'>
        <Form>
          <Form.Check
            className='menu-item'
            type="switch"
            id="audio-switch"
            label="Voice Audio"
          />
          <Form.Check
            className='menu-item'
            type="switch"
            id="audio-switch"
            label="Auto Next"
          />
        </Form>
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
