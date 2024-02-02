import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";

import "./Read.css";
import {
  getBookById,
  generateImageLink,
  getAudioForPage,
} from "../services/apiService";
import Spinner from "react-bootstrap/Spinner";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Read() {
  const audioPlayerRef = useRef();
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [bookImageSources, setBookImageSources] = useState([]);

  const [selected, setSelected] = useState(0);
  const [audioSource, setAudioSource] = useState();

  const handlePageChanged = async (page) => {
    //todo: make this take in 2 pages and on the backend, merge the texts. to output an audio file.
    const audio = await getAudioForPage(book, page);
    setAudioSource(process.env.REACT_APP_URL + "/" + audio.data);
    //console.log(audioSource);
    //setSelected(page);
  };

  const generateImageSources = (numberOfPages) => {
    let images = [];
    for (let index = 0; index < numberOfPages; index++) {
      images.push(generateImageLink(book, index));
    }
    setBookImageSources(images);
  };

  async function fetchData() {
    try {
      const result = await getBookById(bookId);
      setBook(result);
      //console.log("test 1 " + JSON.stringify(result));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const generatePages = bookImageSources.map((book, index) => (
    <div key={book._id + index}>
      <Image
        rounded
        src={bookImageSources[index + 1]}
        style={{
          width: "50%",
          maxWidth: "50%",
          verticalAlign: "middle",
          objectFit: "contain",
        }}
      />
    </div>
  ));

  const back = () => {
    //setSelected((selected) => Math.max(selected - 1, 0));
  };

  const next = () => {
    //setSelected((selected) => Math.min(selected + 1, 2));
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  useEffect(() => {
    if (book && book.pages && book.folder) {
      generateImageSources(book.pages);
      handlePageChanged(0);
    }
  }, [book]);

  return (
    <div>
      {book && bookImageSources.length > 0 ? (
        <div className="justify-content-center align-items-center">
          <div
            style={{
              width: "100vw",
              height: "80vh",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <div className="page">
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                }}
              >
                <div style={{ width: "100vw" }}>
                  <Carousel
                    showThumbs={false}
                    showArrows={false}
                    emulateTouch={true}
                    showIndicators={false}
                    autoPlay={false}
                    onChange={(e) => handlePageChanged(e)}
                  >
                    {generatePages}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
          <button onClick={back}>Back</button>
          <button onClick={next}>Next</button>
          <audio
            preload="metadata"
            autoPlay
            src={audioSource}
            onPlay={(e) => console.log("onPlay")}
            ref={audioPlayerRef}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}

export default Read;
