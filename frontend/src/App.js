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
import LoginModal from './components/LoginModal/LoginModal';
import {getLocalUser, getOfflineSettings, getUserObjectFromJwt, removeLocalUser, setLocalUser, setOfflineSettings} from './services/localStorageService';
import Profile from './pages/Profile/Profile';
import {activateApiServiceSecureInterceptors, apiServiceSecure, apiServiceUnsecure} from './services/apiService';
import {Voices} from './Enums/Voices';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [allowRegistering, setAllowRegistering] = useState(false);

  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = (allowRegistering) => {
    setAllowRegistering(allowRegistering);
    setShowLoginModal(true);
  };

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
    activateApiServiceSecureInterceptors(handleLoginModalShow);
    window.addEventListener('resize', handleResize);
    const localJwtToken = getLocalUser();
    if (localJwtToken) {
      login(localJwtToken);
    } else {
      logout();
      if (!getOfflineSettings()) {
        setOfflineSettings(
            {
              voiceSelection: Voices.OLIVIA.voice,
              autoNextPage: true,
              audioEnabled: true,
            },
        );
      }
    }
    setIsLoading(false);
  }, []);


  if (!isLoading) {
    return (
      <AuthContext.Provider value={{user, isLoggedIn, login, logout, handleLoginModalShow, handleLoginModalClose}}>
        <div className="App" >
          <BrowserRouter>
            <MainHeader></MainHeader>
            <LoginModal allowRegistering={allowRegistering} showLoginModal={showLoginModal}
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
