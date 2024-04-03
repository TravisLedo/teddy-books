import {React} from 'react';
import {Button, Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './DeleteModal.css';
import {DeleteType} from '../../Enums/DeleteType';

function DeleteModal(props) {
  return (
    <Modal
      show={props.showDeleteModal}
      onHide={()=>props.setShowDeleteModal(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        {props.type === DeleteType.USER_ADMIN ? <Modal.Title>Delete User</Modal.Title> : props.type === DeleteType.USER ? <Modal.Title>Delete Account</Modal.Title> :<Modal.Title>Delete Book</Modal.Title>}
      </Modal.Header>
      {props.type === DeleteType.USER_ADMIN ? <Modal.Body>
      Are you sure you want to delete the user {props.name}?
      </Modal.Body> : props.type === DeleteType.USER? <Modal.Body>
      Are you sure you want to permanently delete your account {props.name}?
        {props.type === DeleteType.USER ?
        <div className='password-content' >
          <div>Password</div>
          <Form.Control type="password" value={props.deletePassword} onChange={(e) => props.setDeletePassword(e.target.value)} autoFocus={true}/>
        </div> : null}
      </Modal.Body> : <Modal.Body>
      Are you sure you want to delete the book {props.name}?
      </Modal.Body>}

      <Modal.Footer>
        <div className='buttons-container'>
          <Button className="standard-button"
            variant="outline-secondary" onClick={()=>props.setShowDeleteModal(false)}>
          No
          </Button>
          <Button className='btn-custom' onClick={()=>props.deleteItem()}>
          Yes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
