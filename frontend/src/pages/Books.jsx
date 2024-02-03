import background from "../assets/images/blue.png";
import React, { useState, useEffect } from "react";
import BookCard from "../components/bookCard/bookCard";
import Row from "react-bootstrap/Row";
import { getAllBooks } from "../services/apiService";
import Spinner from "react-bootstrap/Spinner";

function Books() {
  const [booksData, setBooksData] = useState([]);

  async function fetchData() {
    try {
      const result = await getAllBooks();
      setBooksData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "90%",
        backgroundAttachment: "fixed",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {booksData.length < 1 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : (
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            // backgroundImage: `url(${background})`,
          }}
        >
          {booksData.length > 0 ? (
            <Row
              className="g-5 align-self-center pt-3 pb-3 w-100"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {booksData.map((book) => (
                <BookCard book={book} key={book._id}></BookCard>
              ))}
            </Row>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Books;
