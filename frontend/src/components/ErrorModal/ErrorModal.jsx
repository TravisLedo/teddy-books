import {React, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './ErrorModal.css';

function ErrorModal(props) {
  return (
    <div tabIndex="0"
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key === 'Enter' || e.key === 'Escape' ) {
          props.handleErrorModalClose();
        }
      }}
    >
      <Modal
        show={props.showErrorModal}
        onHide={()=>props.handleErrorModalClose()}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton autoFocus={true}>
          <Modal.Title >Error</Modal.Title>
        </Modal.Header>
        <Modal.Body
        >
          {props.errorMessages.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <div className='buttons-container'>
            <Button className='btn-custom' onClick={()=>props.handleErrorModalClose()}>
          Dismiss
            </Button>
          </div>

        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ErrorModal;
