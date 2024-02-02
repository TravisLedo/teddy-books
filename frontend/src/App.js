import "./App.css";
import Books from "./pages/Books";
import Read from "./pages/Read";
import Error from "./pages/Error";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <div
        className="App"
      >
        <Routes>
          <Route exact path="/" element={<Books />}></Route>
          <Route exact path="/read/:bookId" element={<Read />}></Route>
          <Route exact path="/*" element={<Error />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
