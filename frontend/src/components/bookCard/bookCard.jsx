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
import backupPdf from '../../assets/images/blank.pdf';
import {LoginModalType} from '../../Enums/LoginModalType';

function BookCard(props) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [book, setBook] = useState(props.book);
  const [pdfError, setPdfError] = useState(false);
  const [userLiked, setUserLiked] = useState();

  const handleLike = async ()=>{
    if (authContext.user) {
      try {
        const newBookData = book;
        if (book.likes.includes(authContext.user._id)) {
          newBookData.likes = newBookData.likes.filter((id) => id === authContext.user.id);
        } else {
          newBookData.likes.push(authContext.user._id);
        }
        const response = await authContext.updateBookDbData(newBookData);
        if (response.likes) {
          setBook(response);
        }
      } catch (error) {
        setBook(props.book);
      }
    }
  };

  useEffect(() => {
    if (authContext.user && book.likes.includes(authContext.user._id)) {
      setUserLiked(true);
    } else {
      setUserLiked(false);
    }
  }, [book, authContext.user]);

  return (
    <Col className="d-flex justify-content-center px-0">
      <div
        onClick={()=>{
          navigate(`read/${book._id}`);
        }}
        className="card-clickable"
      >
        <div className= 'card-image'>
          {pdfError ? <Document file={backupPdf} loading=''>
            <Page
              loading=''
              pageNumber={1} renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={()=>props.imageLoaded()}
            />
          </Document> :
          <Document file={generatePDFLink(book.folder)} loading='' onLoadError={()=>setPdfError(true)}>
            <Page
              loading=''
              pageNumber={1} renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={()=>props.imageLoaded()}
            />
          </Document>}
        </div>


        <div className="corner-stats-container">
          <OverlayTrigger
            overlay={(e) => (
              <Tooltip {...e}>
                {authContext.user && book.likes.includes(authContext.user._id)? (
              <div>Unlike</div>
            ) : authContext.user && !book.likes.includes(authContext.user._id)? (
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
              {userLiked ? <Image
                className="like-button"
                rounded
                src={heart2}
              /> : <Image
                className="like-button"
                rounded
                src={heart1}
              />}
            </div>
          </OverlayTrigger>
          <b>{book.likes.length}</b>
        </div>
        <div className="corner-label">
          <b className="corner-label-text">
            {' ' + book.title + ' '}
          </b>
        </div>
      </div>
    </Col>
  );
}

export default BookCard;
