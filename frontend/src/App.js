import Books from './pages/Books/Books';
import Read from './pages/Read/Read';
import Error from './pages/Error/Error';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, useNavigate, Navigate, useParams} from 'react-router-dom';
import MainHeader from './components/mainHeader/mainHeader';
import {React, useEffect, useState} from 'react';
import Admin from './pages/Admin/Admin';
import {AuthContext} from './contexts/Contexts';
import LoginModal from './components/LoginModal/LoginModal';
import Profile from './pages/Profile/Profile';
import {Voices} from './Enums/Voices';
import {AlertType} from './Enums/AlertType';
import {LoginModalType} from './Enums/LoginModalType';
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
  updatePassword,
  updateUser,
} from './services/apiService';
import './App.css';
import AlertModal from './components/AlertModal/AlertModal';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalType, setLoginModalType] = useState(LoginModalType.LOGIN);
  const [resetPasswordToken, setResetPasswordToken] = useState();
  const [allowRegistering, setAllowRegistering] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState(AlertType.SUCCESS);
  const [alertMessages, setAlertMessages] = useState([]);
  const [currentWindowSize, setCurrentWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginModalShow = (loginModalType, allowRegistering) => {
    setLoginModalType(loginModalType);
    setAllowRegistering(allowRegistering);
    setShowLoginModal(true);
  };
  const handleAlertModalClose = () => setShowAlertModal(false);
  const handleAlertModalShow = (alertType, messages) => {
    setAlertType(alertType);
    setAlertMessages(messages);
    setShowAlertModal(true);
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
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    removeLocalUser();
    setUser(null);
  };

  const updateAudioEnabled = async (audioEnabled, asLoggedInUser) => {
    if (asLoggedInUser) {
      const newUserData = user;
      if (audioEnabled) {
        newUserData.settings.audioEnabled = false;
      } else {
        newUserData.settings.audioEnabled = true;
      }
      await updateUserDbData(newUserData);
    } else {
      if (audioEnabled) {
        setOfflineSettings({...getOfflineSettings(), audioEnabled: false});
      } else {
        setOfflineSettings({...getOfflineSettings(), audioEnabled: true});
      }
    }
  };

  const updateAutoNextPage = async (autoNextPage, asLoggedInUser) => {
    if (asLoggedInUser) {
      const newUserData = user;
      if (autoNextPage) {
        newUserData.settings.autoNextPage = false;
      } else {
        newUserData.settings.autoNextPage = true;
      }
      await updateUserDbData(newUserData);
    } else {
      if (autoNextPage) {
        setOfflineSettings({...getOfflineSettings(), autoNextPage: false});
      } else {
        setOfflineSettings({...getOfflineSettings(), autoNextPage: true});
      }
    }
  };

  const updateVoiceSelection = async (voice, asLoggedInUser) => {
    if (asLoggedInUser) {
      const newUserData = user;
      newUserData.settings.voiceSelection = voice;
      await updateUserDbData(newUserData);
    } else {
      setOfflineSettings({...getOfflineSettings(), voiceSelection: voice});
    }
  };

  const updateUserDbData = async (userData) => {
    try {
      const updatedUser = await updateUser(userData);
      setUser(updatedUser);
      setOfflineSettings(updatedUser.settings);
    } catch (error) {
    }
  };

  const updateUserDbPassword = async (userData) => {
    try {
      const updatedUser = await updatePassword(userData);
      if (updatedUser) {
        setUser(updatedUser);
        setOfflineSettings(updatedUser.settings);
      }
      return updatedUser;
    } catch (error) {
    }
  };

  const handleResize = () => {
    setCurrentWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    const localJwtToken = getLocalUser();
    const attemptAutoLogin = async ()=>{
      await autoLogin(localJwtToken);
      setIsLoading(false);
    };
    activateApiServiceSecureInterceptors(handleLoginModalShow);
    window.addEventListener('resize', handleResize);
    if (localJwtToken) {
      attemptAutoLogin();
    } else {
      if (!getOfflineSettings()) {
        setOfflineSettings({
          voiceSelection: Voices.JOE.voice,
          autoNextPage: true,
          audioEnabled: true,
        });
      }
      setIsLoading(false);
    }
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
          updateAudioEnabled,
          updateVoiceSelection,
          updateAutoNextPage,
          handleAlertModalShow,
          setLoginModalType,
          setResetPasswordToken,
          updateUserDbPassword,
        }}
      >
        <div className="App">
          <AlertModal showAlertModal={showAlertModal} alertType={alertType} alertMessages={alertMessages} handleAlertModalClose={handleAlertModalClose}></AlertModal>
          <LoginModal
            loginModalType={loginModalType}
            allowRegistering={allowRegistering}
            showLoginModal={showLoginModal}
            resetPasswordToken={resetPasswordToken}
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

            <Route
              exact
              path="/profile"
              element={
                  user? (
                    <Profile currentWindowSize={currentWindowSize} setAlertMessages={setAlertMessages} setShowAlertModal={setShowAlertModal}/>
                  ) : (
                   <Navigate to="/"/>
                    )
              }
            ></Route>

            <Route
              exact
              path="/reset/:resetToken"
              element={
                <Books/>
                /*
                  isResettingPassword? (
                    <Books/>
                  ) : (
                   <Navigate to="/"/>
                    )
                    */
              }
            ></Route>

            <Route
              exact
              path="/*"
              element={<Error currentWindowSize={currentWindowSize} />}
            ></Route>
          </Routes>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
