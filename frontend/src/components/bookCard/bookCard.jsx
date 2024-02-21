import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {React} from 'react';
import {Link} from 'react-router-dom';
import {generateImageLink} from '../../services/apiService';
import './bookCard.css';

function BookCard(props) {
  return (
    <Col className="d-flex justify-content-center px-0">
      <Link to={`read/${props.book._id}`} style={{maxWidth: '100%'}}>
        <Card
          className="justify-content-center card-clickable"
          style={{
            margin: 0,
            margin: 'auto',
            width: '500px',
            height: '500px',
            maxWidth: '90%',
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
      </Link>
    </Col>
  );
}

export default BookCard;
