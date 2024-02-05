import {React} from 'react';
import Form from 'react-bootstrap/Form';

function BookBody(props) {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Control
            type="text"
            placeholder="Title"
            value={props.title}
            disabled={!props.editing}
            onChange={(e) => props.setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="author">
          <Form.Control
            type="text"
            placeholder="Author"
            value={props.author}
            disabled={!props.editing}
            onChange={(e) => props.setAuthor(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="number">
          <Form.Control
            type="number"
            placeholder="Number of pages in book..."
            value={props.pages}
            disabled={!props.editing}
            onChange={(e) => props.setPages(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="text">
          <Form.Control
            as="textarea"
            placeholder="Book text content..."
            rows={5}
            disabled={!props.editing}
            value={props.text} // inject state correspond to input and so on
            onChange={(e) => props.setText(e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default BookBody;
