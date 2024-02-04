import { React, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Row, Col, ProgressBar, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { updateBookById } from "../../services/apiService";
import BookBody from "../BookBody/BookBody";

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
