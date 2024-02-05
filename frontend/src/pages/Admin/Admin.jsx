import {React, useState, useEffect} from 'react';
import {addNewBook, getAllBooks} from '../../services/apiService';
import Accordion from 'react-bootstrap/Accordion';
import BookAccordion from '../../components/BookAccordion/BookAccordion';
import {Button} from 'react-bootstrap';
import AddBookModal from '../../components/AddBookModal/AddBookModal';

function Admin(props) {
  const [booksData, setBooksData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleClose = () => setShowAddModal(false);
  const handleShow = () => setShowAddModal(true);

  const fetchData = async () => {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addBook = async (newBookData) => {
    try {
      await addNewBook(newBookData);
      handleClose();
      // todo: show toast to say success and refresh
    } catch (error) {
      console.error('Error saving new book.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{width: '80%', margin: 'auto'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'end',
            padding: '10px',
          }}
        >
          <Button
            variant="info"
            onClick={() => {
              setBooksData([]);
              fetchData();
            }}
          >
            Refresh
          </Button>
          <Button variant="success" onClick={handleShow}>
            Add
          </Button>
        </div>
        {booksData.map((book) => (
          <Accordion defaultActiveKey="0" key={book._id}>
            <BookAccordion book={book}></BookAccordion>
          </Accordion>
        ))}
      </div>

      <AddBookModal
        showAddModal={showAddModal}
        handleClose={handleClose}
        handleShow={handleShow}
        addBook={addBook}
      ></AddBookModal>
    </div>
  );
}

export default Admin;
