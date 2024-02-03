import "./App.css";
import Books from "./pages/Books";
import Read from "./pages/Read";
import Error from "./pages/Error";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHeader from "./components/mainHeader/mainHeader";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainHeader></MainHeader>

        <Routes>
          <Route exact path="/" element={<Books />}></Route>
          <Route exact path="/read/:bookId" element={<Read />}></Route>
          <Route exact path="/*" element={<Error />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
