import {React, useState, useEffect, useContext} from 'react';
import {addNewBook, getAllBooks} from '../../services/apiService';
import Accordion from 'react-bootstrap/Accordion';
import BookAccordion from '../../components/BookAccordion/BookAccordion';
import AddBookModal from '../../components/AddBookModal/AddBookModal';
import refresh from '../../assets/images/refresh.png';
import add from '../../assets/images/add.png';
import {Button, Image} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './Admin.css';
import DeleteBookModal from '../../components/AddBookModal/DeleteBookModal';

function Admin(props) {
  const [booksData, setBooksData] = useState([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const authContext = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };

  const refreshData = () => {
    setBooksData([]);
    fetchData();
  };

  const addBook = async (newBookData) => {
    try {
      await addNewBook(newBookData);
      setShowAddBookModal(false);
      refreshData();
    } catch (error) {
      console.log('Error saving new book: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-content">
      <AddBookModal
        showAddBookModal={showAddBookModal}
        setShowAddBookModal={setShowAddBookModal}
        addBook={addBook}
      ></AddBookModal>
      <div className="title-label">
        <div className="title-label-text">Admin</div>
      </div>
      {authContext.user.isAdmin ? (
          <div className="accordions-container">
            <div className="top-buttons-container">
              <Button
                className="control-button"
                variant="outline-secondary"
                onClick={() => refreshData()}
              >
                <Image className="control-button-image" src={refresh}></Image>
              </Button>
              <Button
                className="control-button"
                variant="outline-secondary"
                onClick={() =>
                  setShowAddBookModal(true)
                }
              >
                <Image className="control-button-image" src={add}></Image>
              </Button>
            </div>
            {booksData.map((book) => (
              <Accordion defaultActiveKey="0" key={book._id}>
                <BookAccordion
                  book={book}
                  refreshData={refreshData}
                ></BookAccordion>
              </Accordion>
            ))}
          </div>


      ) : null}
    </div>
  );
}

export default Admin;
