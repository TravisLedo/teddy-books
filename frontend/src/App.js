import "./App.css";
import Books from "./pages/Books";
import Read from "./pages/Read";
import Error from "./pages/Error";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHeader from "./components/mainHeader/mainHeader";
import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="App" windowSize={windowSize}>
      <BrowserRouter>
        <MainHeader></MainHeader>

        <Routes>
          <Route
            exact
            path="/"
            element={<Books windowSize={windowSize} />}
          ></Route>
          <Route
            exact
            path="/read/:bookId"
            element={<Read windowSize={windowSize} />}
          ></Route>
          <Route
            exact
            path="/*"
            element={<Error windowSize={windowSize} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
