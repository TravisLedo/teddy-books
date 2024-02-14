import {React, useState, useEffect, useContext} from 'react';
import {addNewBook, getAllBooks} from '../../services/apiService';
import Accordion from 'react-bootstrap/Accordion';
import BookAccordion from '../../components/BookAccordion/BookAccordion';
import AddBookModal from '../../components/AddBookModal/AddBookModal';
import refresh from '../../assets/images/refresh.png';
import add from '../../assets/images/add.png';
import {Button, Image} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import {Navigate} from 'react-router-dom';
import {getUserObjectFromJwt} from '../../services/localStorageService';

function Admin(props) {
  const [booksData, setBooksData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const authContext = useContext(AuthContext);

  const handleClose = () => setShowAddModal(false);
  const handleShow = () => setShowAddModal(true);

  const fetchData = async () => {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const addBook = async (newBookData) => {
    try {
      await addNewBook(newBookData);
      handleClose();
      // todo: show toast to say success and refresh
    } catch (error) {
      console.log('Error saving new book.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {authContext.isLoggedIn && getUserObjectFromJwt(authContext.userToken).user.isAdmin ? <div style={{width: '80%', margin: 'auto'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'end',
            padding: '10px',
          }}
        >
          <div>
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => {
                setBooksData([]);
                fetchData();
              }}
            >
              <Image className="control-button-image" src={refresh}></Image>
            </Button>
            <Button
              className="control-button"
              variant="outline-secondary"
              onClick={() => handleShow()}
            >
              <Image className="control-button-image" src={add}></Image>
            </Button>
          </div>
        </div>
        <h1>Admin</h1>
        {booksData.map((book) => (
          <Accordion defaultActiveKey="0" key={book._id}>
            <BookAccordion book={book}></BookAccordion>
          </Accordion>
        ))}
        <AddBookModal
          showAddModal={showAddModal}
          handleClose={handleClose}
          handleShow={handleShow}
          addBook={addBook}
        ></AddBookModal>
      </div> : <Navigate to='/' replace={true}></Navigate>

      }


    </div>
  );
}

export default Admin;
