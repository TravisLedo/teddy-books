import {React} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './DeleteModal.css';

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
        {props.type ==='user' ? <Modal.Title>Delete User</Modal.Title> : <Modal.Title>Delete Book</Modal.Title>}
      </Modal.Header>
      {props.type ==='user' ? <Modal.Body>
      Are you sure you want to delete the user {props.name}?
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
