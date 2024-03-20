import {React, useState, useEffect, useContext} from 'react';
import {
  addNewBook,
  getRecentUsers,
  getAllBooks,
  getNewestUsers,
  getUserByEmail,
  getUsersByName,
  getUserById,
} from '../../services/apiService';
import Accordion from 'react-bootstrap/Accordion';
import BookAccordion from '../../components/BookAccordion/BookAccordion';
import AddBookModal from '../../components/AddBookModal/AddBookModal';
import refresh from '../../assets/images/refresh.png';
import add from '../../assets/images/add.png';
import search from '../../assets/images/search.png';
import {Button, Image, Tab, Tabs, Form, Row, Col, Nav} from 'react-bootstrap';
import {AuthContext} from '../../contexts/Contexts';
import './Admin.css';
import UserInfoModal from '../../components/UserInfoAccordion/UsertInfoAccordion';
import UserInfoAccordion from '../../components/UserInfoAccordion/UsertInfoAccordion';

function Admin(props) {
  const [booksData, setBooksData] = useState([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [searchedUsers, setSearchedUsers] = useState([]);
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

  const searchUsers = async () => {
    setSearchedUsers([]);
    try {
      const usersById = await getUserById(searchInput);
      const userByEmail = await getUserByEmail(searchInput);
      const usersByName = await getUsersByName(searchInput);

      const results = usersByName.concat(userByEmail).concat(usersById).filter((obj, index) => {
        return index === usersByName.concat(userByEmail).concat(usersById).findIndex((o) => obj._id === o._id);
      });

      const removedEmpty = results.filter((value) => Object.keys(value).length !== 0);
      setSearchedUsers(removedEmpty);
    } catch (error) {
      console.log('Error finding user by email: ', error);
    }
  };


  const usersTabBar=()=>{
    return <Nav variant="pills" className="flex-column">
      <Nav.Item>
        <Nav.Link eventKey="newest">New</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="recent">Recent</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="search">Search</Nav.Link>
      </Nav.Item>
    </Nav>;
  };

  const usersTabContent =()=>{
    return <Tab.Content>
      <Tab.Pane eventKey="newest"> <div className="user-list">
        <h3>New Users</h3>
        {newestUsers.map((user) => (
          <Accordion defaultActiveKey="0" key={user._id}>
            <UserInfoAccordion user={user}></UserInfoAccordion>
          </Accordion>
        ))}
      </div></Tab.Pane>
      <Tab.Pane eventKey="recent">  <div className="user-list">
        <h3>Recent Active Users</h3>
        {recentUsers.map((user) => (
          <Accordion defaultActiveKey="0" key={user._id}>
            <UserInfoAccordion user={user}></UserInfoAccordion>
          </Accordion>
        ))}
      </div></Tab.Pane>
      <Tab.Pane eventKey="search">
        <div className="user-list">
          <h3>Find User</h3>

          <Form className="form-container mb-0 pb-0">
            <Form.Group controlId="searchInput">
              <Form.Control
                type="text"
                placeholder="Find user by email, name, id..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="top-buttons-container pt-0 mt-0">
            <Button
              className="edit-button"
              variant="outline-secondary"
              onClick={() => searchUsers()}
            >
              <Image className="edit-button-image" src={search}></Image>
            </Button>{' '}
          </div>
          {searchedUsers.map((user) => (
            <Accordion defaultActiveKey="0" key={user._id}>
              <UserInfoAccordion user={user}></UserInfoAccordion>
            </Accordion>
          ))}
        </div>
      </Tab.Pane>
    </Tab.Content>;
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
            '60%' :
            '95%',
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
          className="edit-button"
          variant="outline-secondary"
          onClick={() => refreshData()}
        >
          <Image className="edit-button-image" src={refresh}></Image>
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
          >
            <div className="top-buttons-container">
              <Button
                className="edit-button"
                variant="outline-secondary"
                onClick={() => setShowAddBookModal(true)}
              >
                <Image className="edit-button-image" src={add}></Image>
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
          </div>
        </Tab>
        <Tab eventKey="users" title="Users">
          <div
            className="tab-container"
          >
            <Tab.Container defaultActiveKey="newest">
              {props.currentWindowSize.width > props.currentWindowSize.height ? <Row>
                <Col sm={2}>{usersTabBar()}</Col> <Col sm={10}>{usersTabContent()}
                </Col> </Row>: <Row>{usersTabBar()}{usersTabContent()}</Row>}


            </Tab.Container>


          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Admin;
