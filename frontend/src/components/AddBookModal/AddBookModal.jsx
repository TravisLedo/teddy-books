import {React, useState} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BookBody from '../../components/BookBody/BookBody';

function AddBookModal(props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState(2);
  const [text, setText] = useState('');

  const handleSave = () => {
    const newBookData = {
      title: title,
      author: author,
      pages: pages,
      text: text,
    };
    props.addBook(newBookData);
  };

  return (
    <Modal
      show={props.showAddModal}
      onHide={props.handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BookBody
          editing={true}
          title={title}
          pages={pages}
          author={author}
          text={text}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setPages={setPages}
          setText={setText}
        ></BookBody>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddBookModal;
