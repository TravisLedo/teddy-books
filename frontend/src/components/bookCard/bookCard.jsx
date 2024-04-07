import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {React, useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {generateImageLink, updateBook} from '../../services/apiService';
import './bookCard.css';
import blank from '../../assets/images/blank.png';
import heart1 from '../../assets/images/heart1.png';
import heart2 from '../../assets/images/heart2.png';
import {AuthContext} from '../../contexts/Contexts';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

function BookCard(props) {
  const authContext = useContext(AuthContext);

  const [image, setImage] = useState(generateImageLink(props.book, 1));
  const [likes, setLikes] = useState(props.book.likes);
  const [likeImage, setLikeImage] = useState(heart1);

  const handleLike = async ()=>{
    if (authContext.user) {
      const newBookData = props.book;
      if (likes.includes(authContext.user._id)) {
        newBookData.likes = newBookData.likes.filter((id) => id === authContext.user.id);
      } else {
        newBookData.likes.push(authContext.user._id);
      }
      const response = await updateBook(newBookData);
      setLikes(response.likes);
    }
  };

  useEffect(() => {
    if (authContext.user && likes.includes(authContext.user._id)) {
      setLikeImage(heart2);
    } else {
      setLikeImage(heart1);
    }
  }, [likes]);


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
              <OverlayTrigger
                overlay={(e) => (
                  <Tooltip {...e}>
                    {authContext.user && props.book.likes.includes(authContext.user._id)? (
              <div>Unlike</div>
            ) : authContext.user && !props.book.likes.includes(authContext.user._id)? (
              <div>Like</div>
            ) : <div>Log in to like.</div>
                    }
                  </Tooltip>
                )}
                placement="top"
              >
                <div onClick={(e)=>{
                  e.preventDefault();
                  e.stopPropagation();
                  handleLike();
                }}
                >
                  <Image
                    className="like-button"
                    rounded
                    src={likeImage}
                  />
                </div>
              </OverlayTrigger>
              <b>{props.book.likes.length}</b>
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
