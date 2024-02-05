import {React, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {Button, Image, Card} from 'react-bootstrap';
import {generateImageLink, updateBookById} from '../../services/apiService';
import BookBody from '../BookBody/BookBody';

function BookAccordion(props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.book.title);
  const [author, setAuthor] = useState(props.book.author);
  const [pages, setPages] = useState(props.book.pages);
  const [text, setText] = useState(props.book.text);

  const resetValues = () => {
    setEditing(false);
    setTitle(props.book.title);
    setAuthor(props.book.author);
    setPages(props.book.pages);
    setText(props.book.text);
  };

  const updateValues = () => {
    setEditing(false);
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

    updateBookById(newBookData);
  };

  return (
    <Accordion.Item eventKey={props.book._id} on>
      <Accordion.Header>{props.book.title}</Accordion.Header>
      <Accordion.Body>
        <Card
          className="justify-content-center card-clickable"
          style={{
            margin: 'auto',
            width: '200px',
            height: '200px',
            maxWidth: '95%',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 1,
            boxShadow: '1px 5px 5px rgb(0 0 0 / 50%)',
          }}
        >
          <Image
            rounded
            src={generateImageLink(props.book, 1)}
            style={{
              maxWidth: '99%',
              maxHeight: '99%',
              objectFit: 'contain',
              margin: 'auto',
            }}
          />
          <div className="corner-label">
            <b className="corner-label-text">{' ' + props.book.title + ' '}</b>
          </div>
        </Card>
        {editing ? (
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                resetValues();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                updateValues();
              }}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              setEditing(true);
            }}
          >
            Edit
          </Button>
        )}

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