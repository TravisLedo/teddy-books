import {React, useState, useEffect, useContext} from 'react';
import BookCard from '../../components/bookCard/bookCard';
import Row from 'react-bootstrap/Row';
import {checkPasswordResetTokenLink, getAllBooks} from '../../services/apiService';
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
        navigate('/');
        try {
          const linkValidToken = await checkPasswordResetTokenLink(resetToken);
          if (linkValidToken.status === 200) {
            authContext.logout();
            authContext.setResetPasswordToken(linkValidToken.data.token);
            authContext.handleLoginModalShow(LoginModalType.RESET_PASSWORD, false);
          } else {
            authContext.handleAlertModalShow(AlertType.ERROR, ['Password reset request expired or does not exist. Try requesting a new link.']);
            navigate('/');
          }
        } catch (error) {
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
      <Row className="g-5 align-self-center pt-3 pb-3 content-row">
        {booksData.map((book) => (
          <BookCard book={book} key={book._id}></BookCard>
        ))}
      </Row>
    </div>
  );
}

export default Books;
