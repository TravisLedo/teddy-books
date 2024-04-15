import {React, useState, useEffect, useContext} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BookBody from '../../components/BookBody/BookBody';
import './AddBookModal.css';
import {validateBookAuthor, validateBookText, validateBookTitle, validatePagesNumber} from '../../services/FormValidationService';
import {AuthContext} from '../../contexts/Contexts';
import {AlertType} from '../../Enums/AlertType';

function AddBookModal(props) {
  const authContext = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const resetForms = async () => {
    setTitle('');
    setAuthor('');
    setText('');
  };

  const handleSave = async () => {
    const newBookData = {
      title: title,
      author: author,
      text: text,
    };
    const addedBook = await props.addBook(newBookData);
    if (addedBook) {
      resetForms();
    }
  };

  const validateFields = async () => {
    let titleErrorsList = [];
    let authorErrorsList = [];
    let textErrorList = [];

    titleErrorsList = await validateBookTitle(title);
    authorErrorsList = await validateBookAuthor(author);
    textErrorList = await validateBookText(text);

    const errorsList = titleErrorsList.concat(authorErrorsList).concat(textErrorList);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      handleSave();
    }
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
          author={author}
          text={text}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setText={setText}
          adding={true}
        ></BookBody>
      </Modal.Body>
      <Modal.Footer><div className='buttons-container'>  <Button className="standard-button"
        variant="outline-secondary" onClick={()=>props.setShowAddBookModal(false)}>
          Close
      </Button>
      <Button className="standard-button btn-custom"
        onClick={()=>validateFields()}>
          Add
      </Button></div>

      </Modal.Footer>
    </Modal>
  );
}

export default AddBookModal;
