import {React, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import './AlertModal.css';

function AlertModal(props) {
  return (
    <div tabIndex="0"
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key === 'Enter' || e.key === 'Escape' ) {
          props.handleAlertModalClose();
        }
      }}
    >
      <Modal
        show={props.showAlertModal}
        onHide={()=>props.handleAlertModalClose()}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop='static'
      >
        <Modal.Header closeButton autoFocus={true}>
          <Modal.Title >{props.alertType}</Modal.Title>
        </Modal.Header>
        <Modal.Body
        >
          {props.alertMessages.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <div className='buttons-container'>
            <Button className='btn-custom' onClick={()=>props.handleAlertModalClose()}>
          Dismiss
            </Button>
            {props.confirmCallback ? <Button className='btn-custom' onClick={()=>props.confirmCallback()}>
          Confirm
            </Button> : null}
          </div>

        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AlertModal;
