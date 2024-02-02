import background from "../assets/images/blue.png";
import React, { useState, useEffect } from "react";
import BookCard from "../components/bookCard";
import Row from "react-bootstrap/Row";
import MainHeader from "../components/mainHeader/mainHeader";
import { getAllBooks } from "../services/apiService";

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
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100%",
        backgroundAttachment: "fixed",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <MainHeader></MainHeader>
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
    </div>
  );
}

export default Books;
