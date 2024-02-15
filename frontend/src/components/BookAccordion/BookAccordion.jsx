import {React, useState, useContext} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {Button, Image, Card} from 'react-bootstrap';
import {generateImageLink, updateBookById} from '../../services/apiService';
import BookBody from '../BookBody/BookBody';
import edit from '../../assets/images/edit.png';
import check from '../../assets/images/check.png';
import close from '../../assets/images/close.png';
import {AuthContext} from '../../contexts/Contexts';

function BookAccordion(props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.book.title);
  const [author, setAuthor] = useState(props.book.author);
  const [pages, setPages] = useState(props.book.pages);
  const [text, setText] = useState(props.book.text);
  const authContext = useContext(AuthContext);

  const resetValues = () => {
    setEditing(false);
    setTitle(props.book.title);
    setAuthor(props.book.author);
    setPages(props.book.pages);
    setText(props.book.text);
  };

  const updateValues = async () => {
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

    try {
      const book = await updateBookById(newBookData);
      console.log('Book Updated: ' + book.title);
    } catch (error) {
    }
  };

  return (
    <Accordion.Item eventKey={props.book._id}>
      <Accordion.Header>{props.book.title}</Accordion.Header>
      <Accordion.Body>


        {editing ? (
          <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>

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
          <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>

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
        <Card
          className="justify-content-center"
          style={{
            margin: 'auto',
            width: '200px',
            height: '200px',
            maxWidth: '95%',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 1,
            marginBottom: '10px',
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
