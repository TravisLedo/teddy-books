import {React, useState, useEffect, useContext, useRef} from 'react';
import {
  addNewBook,
  getRecentUsers,
  getAllBooks,
  getNewestUsers,
  getUsersByEmailSubstring,
  getUsersByNameSubstring,
  getUserById,
  addNewUser,
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
import UserInfoAccordion from '../../components/UserInfoAccordion/UsertInfoAccordion';
import {isInputBlank, validateEmail, validatePasswordFormat, validateUsername} from '../../services/FormValidationService';

function Admin(props) {
  const authContext = useContext(AuthContext);
  const [booksData, setBooksData] = useState([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [newestUsers, setNewestUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // for registering
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [currentSideTab, setCurrentSideTab] = useState('New');

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
    setEmail('');
    setPassword('');
    setName('');
    setPasswordConfirm('');
    setBooksData([]);
    setNewestUsers([]);
    setRecentUsers([]);
    setSearchedUsers([]);
    searchUsers();
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
    if (!isInputBlank(searchInput)) {
      try {
        const usersById = await getUserById(searchInput);
        const userByEmail = await getUsersByEmailSubstring(searchInput);
        const usersByName = await getUsersByNameSubstring(searchInput);

        const results = usersByName.concat(userByEmail).concat(usersById).filter((obj, index) => {
          return index === usersByName.concat(userByEmail).concat(usersById).findIndex((o) => obj._id === o._id);
        });

        const removedEmpty = results.filter((value) => Object.keys(value).length !== 0);
        setSearchedUsers(removedEmpty);
      } catch (error) {
      }
    }
  };

  const validateRegisterFields = async () => {
    let usernameErrorsList = [];
    let emailErrorsList = [];
    let passwordErrorsList = [];
    usernameErrorsList = await validateUsername(name, true);
    emailErrorsList = await validateEmail(email, true);
    passwordErrorsList = await validatePasswordFormat(password);

    if (password !== passwordConfirm) {
      passwordErrorsList.push('Passwords must match.');
    }

    const errorsList = emailErrorsList.concat(usernameErrorsList).concat(passwordErrorsList);
    if (errorsList.length>0) {
      authContext.handleErrorModalShow(errorsList);
    } else {
      register();
    }
  };

  const register = async () => {
    const userData = {
      email: email,
      name: name,
      password: password,
    };
    try {
      const response = await addNewUser(userData);
      if (response) {
        refreshData();
      }
    } catch (error) {
      console.log('Error creating new user: ', error);
    }
  };

  const handleSideTabChange = (e) => {
    setCurrentSideTab(e.target.innerText);
  };


  const usersTabBar=()=>{
    return <Nav variant="pills" className="flex-column">
      <Nav.Item>
        <Nav.Link eventKey="new" onClick={(e)=>{
          handleSideTabChange(e);
        }} >New</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="recent" onClick={(e)=>{
          handleSideTabChange(e);
        }}>Recent</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="search" onClick={(e)=>{
          handleSideTabChange(e);
        }}>Search</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="register" onClick={(e)=>{
          handleSideTabChange(e);
        }}>Register</Nav.Link>
      </Nav.Item>
    </Nav>;
  };

  const usersTabContent =()=>{
    return <Tab.Content onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentSideTab === 'Search') {
          searchUsers();
        } else if (currentSideTab === 'Register') {
          validateRegisterFields();
        }
      }
    }}>
      {currentSideTab === 'New' ?
      <Tab.Pane eventKey="new"> <div className="user-list">
        <h3>New Users</h3>
        {newestUsers.map((user) => (
          <Accordion defaultActiveKey="0" key={user._id}>
            <UserInfoAccordion user={user} refreshData={refreshData}></UserInfoAccordion>
          </Accordion>
        ))}
      </div></Tab.Pane> :
      null}
      {currentSideTab === 'Recent' ?

      <Tab.Pane eventKey="recent">  <div className="user-list">
        <h3>Recent Active Users</h3>
        {recentUsers.map((user) => (
          <Accordion defaultActiveKey="0" key={user._id}>
            <UserInfoAccordion user={user} refreshData={refreshData}></UserInfoAccordion>
          </Accordion>
        ))}
      </div></Tab.Pane> : null}

      {currentSideTab === 'Search' ?
      <Tab.Pane eventKey="search" >
        <h3>Find User</h3>

        <Form className="form-container mb-0 pb-0">
          <Form.Group controlId='search'>
            <Form.Control
              type="text"
              placeholder="Find user by email, name, id..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus={true}
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
          </Button>
        </div>
        {searchedUsers.map((user) => (
          <Accordion defaultActiveKey="0" key={user._id}>
            <UserInfoAccordion user={user} refreshData={refreshData}></UserInfoAccordion>
          </Accordion>
        ))}
      </Tab.Pane> :
  null}
      {currentSideTab === 'Register' ?
      <Tab.Pane eventKey="register"
      >
        <h3>Register</h3>
        <Form className="form-container"
        >
          <Form.Group className="mb-3" controlId='email'
          >
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='password'>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='passwordConfirm'>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId='username'>
            <Form.Control
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <div className="button-container">
            <Button
              className="standard-button btn-custom"
              onClick={() => {
                validateRegisterFields();
              }}
            >
                Register
            </Button>
          </div>
        </Form>

      </Tab.Pane> : null}
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
        <Tab eventKey="users" title="Users"

        >
          <div
            className="tab-container"
          >
            <Tab.Container defaultActiveKey="new" >
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
