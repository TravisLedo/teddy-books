import './App.css';
import Books from './pages/Books';
import Read from './pages/Read/Read';
import Error from './pages/Error';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainHeader from './components/mainHeader/mainHeader';
import {React, useEffect, useState} from 'react';
import Admin from './pages/Admin/Admin';

function App() {
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
  }, []);

  return (
    <div className="App">
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
            path="/*"
            element={<Error currentWindowSize={currentWindowSize} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
