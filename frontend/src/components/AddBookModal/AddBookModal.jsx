import {React, useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BookBody from '../../components/BookBody/BookBody';
import './AddBookModal.css';

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
      show={props.showAddBookModal}
      onHide={()=>props.setShowAddBookModal(false)}
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
      <Modal.Footer><div className='buttons-container'>  <Button className="standard-button"
        variant="outline-secondary" onClick={()=>props.setShowAddBookModal(false)}>
          Close
      </Button>
      <Button className="standard-button btn-custom"
        onClick={()=>handleSave()}>
          Add
      </Button></div>

      </Modal.Footer>
    </Modal>
  );
}

export default AddBookModal;
