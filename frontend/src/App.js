import Books from './pages/Books/Books';
import Read from './pages/Read/Read';
import Error from './pages/Error/Error';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import MainHeader from './components/mainHeader/mainHeader';
import {React, useEffect, useState} from 'react';
import Admin from './pages/Admin/Admin';
import {AuthContext} from './contexts/Contexts';
import LoginModal from './components/LoginModal/LoginModal';
import Profile from './pages/Profile/Profile';
import {Voices} from './Enums/Voices';
import {
  getLocalUser,
  getOfflineSettings,
  decodeJwtToken,
  removeLocalUser,
  setOfflineSettings,
} from './services/localStorageService';
import {
  activateApiServiceSecureInterceptors,
  autoLoginUser,
  getUserById,
  loginUser,
  updateUserById,
} from './services/apiService';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [allowRegistering, setAllowRegistering] = useState(false);
  const [currentWindowSize, setCurrentWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = (allowRegistering) => {
    setAllowRegistering(allowRegistering);
    setShowLoginModal(true);
  };

  const autoLogin = async (localJwtToken) => {
    try {
      const decodedJwtToken = decodeJwtToken(localJwtToken);
      const userResult = await autoLoginUser(decodedJwtToken);
      setUser(userResult);
      setOfflineSettings(userResult.settings);
    } catch (error) {}
  };

  const login = async (userData) => {
    try {
      const jwtToken = await loginUser(userData);
      const decodedJwtToken = decodeJwtToken(jwtToken);
      const user = await getUserById(decodedJwtToken._id);
      setUser(user);
      setOfflineSettings(user.settings);
      localStorage.setItem('jwtToken', jwtToken);
    } catch (error) {}
  };

  const logout = () => {
    removeLocalUser();
    setUser(null);
    //navigate('/');
  };

  const updateUserDbData = async (userData) => {
    try {
      const updatedUser = await updateUserById(userData);
      setUser(updatedUser);
      setOfflineSettings(updatedUser.settings);
    } catch (error) {}
  };

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
      autoLogin(localJwtToken);
    } else {
      if (!getOfflineSettings()) {
        setOfflineSettings({
          voiceSelection: Voices.JOE.voice,
          autoNextPage: true,
          audioEnabled: true,
        });
      }
    }
    setIsLoading(false);
  }, []);

  if (!isLoading) {
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          updateUserDbData,
          login,
          logout,
          handleLoginModalShow,
          handleLoginModalClose,
        }}
      >
        <div className="App">
          <LoginModal
            allowRegistering={allowRegistering}
            showLoginModal={showLoginModal}
          ></LoginModal>
          <MainHeader></MainHeader>
          <Routes>
            <Route
              exact
              path="/"
              element={<Books/>}
            ></Route>
            <Route
              exact
              path="/read/:bookId"
              element={<Read currentWindowSize={currentWindowSize} />}
            ></Route>

            {user && user.isAdmin ? (
              <Route
                exact
                path="/admin"
                element={<Admin currentWindowSize={currentWindowSize}/>}
              ></Route>
            ) : null}

            {user && user.isAdmin ? (
              <Route
                exact
                path="/profile"
                element={
                  user ? (
                    <Profile currentWindowSize={currentWindowSize}/>
                  ) : (
                    <Books></Books>
                  )
                }
              ></Route>
            ) : null}

            <Route
              exact
              path="/*"
              element={<Error/>}
            ></Route>
          </Routes>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
