import {React, useState} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './ErrorModal.css';

function ErrorModal(props) {
  return (
    <Modal
      show={props.showErrorModal}
      onHide={()=>props.handleErrorModalClose()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.errorMessages.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <div className='buttons-container'>
          <Button className='btn-custom' onClick={()=>props.handleErrorModalClose()}>
          Okay
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
