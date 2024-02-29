import {React, useState, useEffect, useContext} from 'react';
import {
  addNewBook,
  getRecentUsers,
  getAllBooks,
  getNewestUsers,
  getUserByEmail,
} from '../../services/apiService';
import Accordion from 'react-bootstrap/Accordion';
import BookAccordion from '../../components/BookAccordion/BookAccordion';
import AddBookModal from '../../components/AddBookModal/AddBookModal';
import refresh from '../../assets/images/refresh.png';
import add from '../../assets/images/add.png';
import search from '../../assets/images/search.png';
import {Button, Image, Tab, Tabs, Form, Row, Col} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './Admin.css';
import UserInfoModal from '../../components/UserInfoAccordion/UsertInfoAccordion';
import UserInfoAccordion from '../../components/UserInfoAccordion/UsertInfoAccordion';

function Admin(props) {
  const [booksData, setBooksData] = useState([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState();
  const [searchedUser, setSearchedUser] = useState();
  const [newestUsers, setNewestUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const authContext = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const bookResults = await getAllBooks();
      const newestUsers = await getNewestUsers();
      const recentUsers = await getRecentUsers();
      setBooksData(bookResults);
      setNewestUsers(newestUsers);
      setRecentUsers(recentUsers);
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };

  const refreshData = () => {
    setBooksData([]);
    setNewestUsers([]);
    setRecentUsers([]);
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

  const searchUserByEmail = async () => {
    try {
      const user = await getUserByEmail(searchEmail);
      setSearchedUser(user);
      console.log(user);
    } catch (error) {
      console.log('Error finding user by email: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="admin-card"
      style={{
        width:
          props.currentWindowSize.width > props.currentWindowSize.height ?
            '75vw' :
            '95vw',
      }}
    >
      <AddBookModal
        showAddBookModal={showAddBookModal}
        setShowAddBookModal={setShowAddBookModal}
        addBook={addBook}
      ></AddBookModal>

      <div className="title-label">
        <div className="title-label-text">Admin</div>
      </div>
      <div className="top-buttons-container">
        <Button
          className="control-button"
          variant="outline-secondary"
          onClick={() => refreshData()}
        >
          <Image className="control-button-image" src={refresh}></Image>
        </Button>
      </div>
      <Tabs
        defaultActiveKey="books"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="books" title="Books">
          <div
            className="tab-container"
            style={{
              width:
                props.currentWindowSize.width > props.currentWindowSize.height ?
                  '80%' :
                  '95%',
            }}
          >
            <div className="top-buttons-container">
              <Button
                className="control-button"
                variant="outline-secondary"
                onClick={() => setShowAddBookModal(true)}
              >
                <Image className="control-button-image" src={add}></Image>
              </Button>
            </div>
            {booksData.map((book) => (
              <Accordion defaultActiveKey="0" key={book._id}>
                <BookAccordion
                  book={book}
                  refreshBookData={refreshData}
                ></BookAccordion>
              </Accordion>
            ))}
          </div>{' '}
        </Tab>
        <Tab eventKey="users" title="Users">
          <div
            className="tab-container"
            style={{
              width:
                props.currentWindowSize.width > props.currentWindowSize.height ?
                  '80%' :
                  '95%',
            }}
          >
            {searchedUser ? (
              <Accordion defaultActiveKey="0" key={searchedUser._id}>
                <UserInfoAccordion user={searchedUser}></UserInfoAccordion>
              </Accordion>
            ) : null}
            <Form className="form-container mb-0 pb-0">
              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  placeholder="Find user by email."
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="top-buttons-container pt-0 mt-0">
              <Button
                className="control-button"
                variant="outline-secondary"
                onClick={() => searchUserByEmail()}
              >
                <Image className="control-button-image" src={search}></Image>
              </Button>{' '}
            </div>

            <div className="user-list">
              <h3>New Users</h3>
              {newestUsers.map((user) => (
                <Accordion defaultActiveKey="0" key={user._id}>
                  <UserInfoAccordion user={user}></UserInfoAccordion>
                </Accordion>
              ))}
            </div>

            <div className="user-list">
              <h3>Recent Active Users</h3>
              {recentUsers.map((user) => (
                <Accordion defaultActiveKey="0" key={user._id}>
                  <UserInfoAccordion user={user}></UserInfoAccordion>
                </Accordion>
              ))}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Admin;
