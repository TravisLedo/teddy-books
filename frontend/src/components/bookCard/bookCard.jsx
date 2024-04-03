import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {React, useState} from 'react';
import {Link} from 'react-router-dom';
import {generateImageLink} from '../../services/apiService';
import './bookCard.css';
import blank from '../../assets/images/blank.png';
import book from '../../assets/images/eye.png';
import heart1 from '../../assets/images/heart1.png';
import heart2 from '../../assets/images/heart2.png';

function BookCard(props) {
  const [image, setImage] = useState(generateImageLink(props.book, 1));

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
            src={image}
            style={{
              maxWidth: '99%',
              maxHeight: '90%',
              objectFit: 'contain',
              margin: 'auto',
            }}
            onError={(e) => {
              e.onError = null;
              setImage(blank);
            }}
          />

          <div className="bottom-content">
            <div className="corner-stats-container">
              <div>
                <div className="corner-stats" onClick={(e)=>{
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('test');
                }}>
                  <Image
                    className="corner-stats-image"
                    rounded
                    src={heart1}
                  />
                  <b>{props.book.likes.length}</b></div>
              </div>
            </div>
            <div className="corner-label">
              <b className="corner-label-text">
                {' ' + props.book.title + ' '}
              </b>
            </div>
          </div>
        </Card>
      </Link>
    </Col>
  );
}

export default BookCard;
