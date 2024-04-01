import {React, useState, useEffect, useContext} from 'react';
import BookCard from '../../components/bookCard/bookCard';
import Row from 'react-bootstrap/Row';
import {checkPasswordResetTokenLink, getAllBooks} from '../../services/apiService';
import OverlayScreen from '../../components/OverlayScreen/OverlayScreen';
import {OverlayStatus} from '../../Enums/OverlayStatus';
import {useParams} from 'react-router-dom';
import './Books.css';
import {AuthContext} from '../../contexts/Contexts';
import {LoginModalType} from '../../Enums/LoginModalType';
import {useNavigate} from 'react-router-dom';
import {AlertType} from '../../Enums/AlertType';

function Books() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [booksData, setBooksData] = useState([]);
  const {resetToken} = useParams();

  async function fetchData() {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const handlePasswordResetDirectLink= async ()=>{
      if (resetToken) { // user landed on this page from an password reset link
        try {
          const linkValid = await checkPasswordResetTokenLink(resetToken);
          if (linkValid) {
            authContext.logout();
            authContext.handleLoginModalShow(LoginModalType.RESET_PASSWORD, false);
            authContext.setResetPasswordToken(resetToken);
          }
        } catch (error) {
          authContext.handleAlertModalShow(AlertType.ERROR, ['Your password reset link is expired or does not exist.']);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };
    fetchData();
    handlePasswordResetDirectLink();
  }, []);

  return (
    <div className="books-content">
      {booksData.length > 0 ? (
        <Row className="g-5 align-self-center pt-3 pb-3 content-row">
          {booksData.map((book) => (
            <BookCard book={book} key={book._id}></BookCard>
          ))}
        </Row>
      ) : (
        <OverlayScreen status={OverlayStatus.LOADING}></OverlayScreen>
      )}
    </div>
  );
}

export default Books;
