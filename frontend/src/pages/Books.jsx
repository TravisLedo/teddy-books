import {React, useState, useEffect} from 'react';
import BookCard from '../components/bookCard/bookCard';
import Row from 'react-bootstrap/Row';
import {getAllBooks} from '../services/apiService';
import OverlayScreen from '../components/OverlayScreen/OverlayScreen';
import {OverlayStatus} from '../Enums/OverlayStatus';

function Books() {
  const [booksData, setBooksData] = useState([]);

  async function fetchData() {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '90%',
        backgroundAttachment: 'fixed',
        width: '100%',
        justifyContent: 'center',
        margin: 'auto',
      }}
    >
      {booksData.length > 0 ? (
        <Row
          className="g-5 align-self-center pt-3 pb-3"
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
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
