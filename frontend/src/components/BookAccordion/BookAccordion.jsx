import {React, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {Button, Image, Card} from 'react-bootstrap';
import {
  deleteBookById,
  generateImageLink,
  updateBookById,
} from '../../services/apiService';
import BookBody from '../BookBody/BookBody';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import trash from '../../assets/images/trash.png';
import './BookAccordion.css';
import DeleteBookModal from '../AddBookModal/DeleteBookModal';

function BookAccordion(props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.book.title);
  const [author, setAuthor] = useState(props.book.author);
  const [pages, setPages] = useState(props.book.pages);
  const [text, setText] = useState(props.book.text);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);

  const resetValues = () => {
    setEditing(false);
    setTitle(props.book.title);
    setAuthor(props.book.author);
    setPages(props.book.pages);
    setText(props.book.text);
  };

  const updateValues = async () => {
    setTitle(title);
    setAuthor(author);
    setPages(pages);
    setText(text);

    const newBookData = {
      _id: props.book._id,
      title: title,
      author: author,
      pages: pages,
      text: text,
    };

    try {
      await updateBookById(newBookData);
      setEditing(false);
    } catch (error) {}
  };

  const deleteBook = async () => {
    try {
      await deleteBookById(props.book._id);
      props.refreshData();
    } catch (error) {}
  };

  return (
    <Accordion.Item eventKey={props.book._id}>
      <DeleteBookModal
        book={props.book}
        deleteBook={deleteBook}
        showDeleteBookModal={showDeleteBookModal}
        setShowDeleteBookModal={setShowDeleteBookModal}
      ></DeleteBookModal>
      <Accordion.Header>{props.book.title}</Accordion.Header>
      <Accordion.Body>
        {editing ? (
          <div className="editing-buttons-container">
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                setShowDeleteBookModal(true);
              }}
            >
              <Image className="control-button-image" src={trash}></Image>
            </Button>
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                resetValues();
              }}
            >
              <Image className="control-button-image" src={close}></Image>
            </Button>
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                updateValues();
              }}
            >
              <Image className="control-button-image" src={check}></Image>
            </Button>
          </div>
        ) : (
          <div className="editing-buttons-container">
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                setEditing(true);
              }}
            >
              <Image className="control-button-image" src={edit}></Image>
            </Button>
          </div>
        )}
        <Card className="book-card">
          <Image
            className="book-image"
            rounded
            src={generateImageLink(props.book, 1)}
          />
        </Card>
        <BookBody
          title={title}
          pages={pages}
          author={author}
          text={text}
          editing={editing}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setPages={setPages}
          setText={setText}
          setEditing={setEditing}
        ></BookBody>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default BookAccordion;
