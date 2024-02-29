import {React, useState} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './DeleteBookModal.css';

function DeleteBookModal(props) {
  return (
    <Modal
      show={props.showDeleteBookModal}
      onHide={()=>props.setShowDeleteBookModal(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      Are you sure you want to delete the book {props.book.title}?
      </Modal.Body>
      <Modal.Footer>
        <div className='buttons-container'>
          <Button className="standard-button"
            variant="outline-secondary" onClick={()=>props.setShowDeleteBookModal(false)}>
          No
          </Button>
          <Button className='btn-custom' onClick={()=>props.deleteBook()}>
          Yes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBookModal;
