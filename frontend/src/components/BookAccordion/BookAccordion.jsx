import {React, useContext, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {Button, Image} from 'react-bootstrap';
import {
  deleteBookById,
  generatePDFLink,
  updateBook,
} from '../../services/apiService';
import BookBody from '../BookBody/BookBody';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import trash from '../../assets/images/trash.png';
import './BookAccordion.css';
import DeleteModal from '../DeleteModal/DeleteModal';
import {validateBookAuthor, validateBookText, validateBookTitle} from '../../services/FormValidationService';
import {AuthContext} from '../../contexts/Contexts';
import {AlertType} from '../../Enums/AlertType';
import {DeleteType} from '../../Enums/DeleteType';
import {Document, Page} from 'react-pdf';

function BookAccordion(props) {
  const authContext = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.book.title);
  const [author, setAuthor] = useState(props.book.author);
  const [text, setText] = useState(props.book.text);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const resetValues = () => {
    setEditing(false);
    setTitle(props.book.title);
    setAuthor(props.book.author);
    setText(props.book.text);
  };

  const updateValues = async () => {
    const newBookData = {
      _id: props.book._id,
      title: title,
      author: author,
      text: text,
    };

    try {
      await authContext.updateBookDbData(newBookData);
      setEditing(false);
    } catch (error) {
      console.log('Error updating book: ', error);
    }
  };

  const validateFields = async () => {
    let titleErrorsList = [];
    let authorErrorsList = [];
    let textErrorList = [];

    if (title.trim().toLowerCase() !== props.book.title.trim().toLowerCase()) {
      titleErrorsList = await validateBookTitle(title);
    }
    authorErrorsList = await validateBookAuthor(author);
    textErrorList = await validateBookText(text);

    const errorsList = titleErrorsList.concat(authorErrorsList).concat(textErrorList);
    if (errorsList.length>0) {
      authContext.handleAlertModalShow(AlertType.ERROR, errorsList);
    } else {
      updateValues();
    }
  };

  const deleteItem = async () => {
    try {
      await deleteBookById(props.book._id);
      setShowDeleteModal(false);
      props.refreshData();
    } catch (error) {}
  };

  return (
    <Accordion.Item eventKey={props.book._id}>
      <DeleteModal
        type={DeleteType.BOOK_ADMIN}
        name={props.book.title}
        deleteItem={deleteItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      ></DeleteModal>
      <Accordion.Header>{props.book.title}</Accordion.Header>
      <Accordion.Body>
        {editing ? (
          <div className="editing-buttons-container">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                setShowDeleteModal(true);
              }}
            >
              <Image className="edit-button-image" src={trash}></Image>
            </Button>
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                resetValues();
              }}
            >
              <Image className="edit-button-image" src={close}></Image>
            </Button>
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                validateFields();
              }}
            >
              <Image className="edit-button-image" src={check}></Image>
            </Button>
          </div>
        ) : (
          <div className="editing-buttons-container">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => {
                setEditing(true);
              }}
            >
              <Image className="edit-button-image" src={edit}></Image>
            </Button>
          </div>
        )}
        <div className= 'book-card' onClick={()=>{
          window.open(generatePDFLink(props.book), '_blank', 'noreferrer');
        }}>
          <Document file={generatePDFLink(props.book)} loading=''>
            <Page
              loading=''
              pageNumber={1} renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        <BookBody
          title={title}
          author={author}
          text={text}
          editing={editing}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setText={setText}
          setEditing={setEditing}
          createdAt={props.book.createdAt}
          updatedAt={props.book.updatedAt}
          adding={false}
        ></BookBody>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default BookAccordion;
