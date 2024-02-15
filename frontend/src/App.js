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
import LoginModal from './pages/Login/LoginModal';
import Register from './pages/Register/Register';
import {getLocalUser, getUserObjectFromJwt, removeLocalUser, setLocalUser} from './services/localStorageService';
import Profile from './pages/Profile/Profile';
import {apiServiceSecure, apiServiceUnsecure} from './services/apiService';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = () => setShowLoginModal(true);

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setUser(getUserObjectFromJwt(jwtToken).user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeLocalUser();
    setUser(null);
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
    apiServiceSecure.interceptors.request.use(
        (config) => {
          const token = getLocalUser();
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          config.headers['Content-Type'] = 'application/json';
          return config;
        },
        (error) => {
          Promise.reject(error);
        },
    );

    apiServiceSecure.interceptors.response.use(
        function(response) {
          return response;
        },
        async function(error) {
          const originalRequest = error.config;
          if (
            error.response.status === 401 && originalRequest._retry
          ) {
            console.log('Access Token and Refresh Token both expired.');
            removeLocalUser();
            handleLoginModalShow();
          }


          if (error.response.status === 401 && !originalRequest._retry) {
            console.log('Access Token expired.');
            originalRequest._retry = true;
            try {
              const newAccessToken = await apiServiceUnsecure.post('/token/refresh', {token: getLocalUser()});
              setLocalUser(newAccessToken.data);
              console.log('Retrying with a new Access Token.');
            } catch (error) {
            }
            return apiServiceSecure(originalRequest);
          }
        },
    );
    window.addEventListener('resize', handleResize);
    const localJwtToken = getLocalUser();
    if (localJwtToken) {
      login(localJwtToken);
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  if (!isLoading) {
    return (
      <AuthContext.Provider value={{user, isLoggedIn, login, logout, handleLoginModalShow, handleLoginModalClose, showLoginModal}}>
        <div className="App" >
          <BrowserRouter>
            <MainHeader></MainHeader>
            <LoginModal
            ></LoginModal>
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
