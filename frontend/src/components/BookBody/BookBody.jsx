import {React} from 'react';
import Form from 'react-bootstrap/Form';

function BookBody(props) {
  return (
    <Form className="form-container">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Title"
          value={props.title}
          disabled={!props.editing}
          onChange={(e) => props.setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          placeholder="Author"
          value={props.author}
          disabled={!props.editing}
          onChange={(e) => props.setAuthor(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Pages</Form.Label>
        <Form.Control
          type="number"
          placeholder="Number of pages in book..."
          value={props.pages}
          disabled={!props.editing}
          onChange={(e) => props.setPages(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Text</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Book text content..."
          rows={5}
          disabled={!props.editing}
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
        />
      </Form.Group>

      {!props.adding ? <div>
        <Form.Group className="mb-3">
          <Form.Label>Created</Form.Label>
          <Form.Control
            type="text"
            value={props.createdAt}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Modified</Form.Label>
          <Form.Control
            type="text"
            value={props.updatedAt}
            disabled
          />
        </Form.Group>
      </div> : null}
    </Form>
  );
}

export default BookBody;
