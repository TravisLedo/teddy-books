import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {React, useContext, useState, useEffect} from 'react';
import {generatePDFLink, updateBook} from '../../services/apiService';
import './bookCard.css';
import heart1 from '../../assets/images/heart1.png';
import heart2 from '../../assets/images/heart2.png';
import {AuthContext} from '../../contexts/Contexts';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {Document, Page} from 'react-pdf';

function BookCard(props) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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
      <div
        onClick={()=>{
          navigate(`read/${props.book._id}`);
        }}
        className="card-clickable"
      >
        <div className= 'card-image'>
          <Document file={generatePDFLink(props.book)} loading=''>
            <Page
              loading=''
              pageNumber={1} renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>


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
    </Col>
  );
}

export default BookCard;
