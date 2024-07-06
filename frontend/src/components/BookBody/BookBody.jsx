import {React, useContext, useState, useEffect} from 'react';
import {Form, Button, Image} from 'react-bootstrap';
import {generatePDFLink, getTextsForBook} from '../../services/apiService';
import {AuthContext} from '../../contexts/Contexts';
import {AlertType} from '../../Enums/AlertType';
import {Document, Page} from 'react-pdf';
import './BookBody.css';

function BookBody(props) {
  const authContext = useContext(AuthContext);
  const [pdfLink, setPdfLink] = useState(null);

  useEffect(() => {
    if (props.file) {
      setPdfLink(generatePDFLink(props.file));
    }
  }, [props.file]);

  const generateStarterTextFromPDF= async ()=>{
    try {
      const response = await getTextsForBook(props.title);
      props.setText(response.data);
    } catch (error) {
      authContext.handleAlertModalShow(AlertType.ERROR, ['Could not generate texts for this book title.']);
    }
  };

  return (
    <div className='book-body'>
      <div className= 'book-card' onClick={()=>{
        window.open(pdfLink, '_blank', 'noreferrer');
      }}>
        <Document file={pdfLink} loading='' error='' noData='' onError={()=>{
          setPdfLink(null);
        }}>
          <Page
            loading=''
            pageNumber={1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      <Form className="form-container book-body-form">
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
          <Form.Label>Text</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Book text content..."
            rows={20}
            disabled={!props.editing}
            value={props.text}
            onChange={(e) => props.setText(e.target.value)}
          />
          <Button
            className="mt-2"
            variant="outline-secondary"
            disabled={!props.editing}
            onClick={() => {
              generateStarterTextFromPDF();
            }}
          >
         Generate
          </Button>
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
      </Form></div>

  );
}

export default BookBody;
