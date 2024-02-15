import './App.css';
import Books from './pages/Books';
import Read from './pages/Read/Read';
import Error from './pages/Error';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainHeader from './components/mainHeader/mainHeader';
import {React, useEffect, useState} from 'react';
import Admin from './pages/Admin/Admin';
import {AuthContext} from './contexts/Contexts';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import {getLocalUser, getUserObjectFromJwt} from './services/localStorageService';
import Profile from './pages/Profile/Profile';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  const [currentWindowSize, setCurrentWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setCurrentWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    const localJwtToken = getLocalUser();
    if (localJwtToken) {
      // Need to hit a validation endpoint to see if token nbot expired
      // If it is, use refresh token to get a new one
      // if refresh token is expired, clear local storage jwt token and force user to login again
      login(localJwtToken);
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  if (!isLoading) {
    return (
      <AuthContext.Provider value={{isLoggedIn, login, logout}}>
        <div className="App" >
          <BrowserRouter>
            <MainHeader></MainHeader>
            <Routes>
              <Route
                exact
                path="/"
                element={<Books currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/read/:bookId"
                element={<Read currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/admin"
                element={<Admin currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/login"
                element={<Login currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/register"
                element={<Register currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/profile"
                element={<Profile currentWindowSize={currentWindowSize} />}
              ></Route>
              <Route
                exact
                path="/*"
                element={<Error currentWindowSize={currentWindowSize} />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
