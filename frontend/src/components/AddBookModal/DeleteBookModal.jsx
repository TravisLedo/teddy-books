import {React, useState} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

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
        <Button variant="secondary" onClick={()=>props.setShowDeleteBookModal(false)}>
          No
        </Button>
        <Button variant="primary" onClick={()=>props.deleteBook()}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBookModal;
