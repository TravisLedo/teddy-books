import React from "react";
import { useState, useEffect, useWindowSize, useRef } from "react";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { Row, Col, ProgressBar, Button } from "react-bootstrap";

import "./Read.css";
import {
  getBookById,
  generateImageLink,
  getAudioForPage,
  removeTempAudioFromServer,
} from "../services/apiService";
import Spinner from "react-bootstrap/Spinner";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Read(props) {
  const audioPlayerRef = useRef();
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [bookImageSources, setBookImageSources] = useState([]);

  const [currentCarouselPage, setCurrentCarouselPage] = useState(0);
  const [audioSource, setAudioSource] = useState();
  const [started, setStarted] = useState(false);

  const handlePageChanged = async (page) => {
    setAudioSource(null);
    //todo: make this take in 2 pages and on the backend, merge the texts. to output an audio file.
    let leftPage = 0;
    let rightPage = 0;
    //skipping pages because they come in pairs
    if (page === 0) {
      leftPage = 1;
      rightPage = 2;
    } else {
      leftPage = page * 2 + 1;
      rightPage = leftPage + 1;
    }

    try {
      const audio = await getAudioForPage(book, leftPage, rightPage);
      setAudioSource(process.env.REACT_APP_URL + "/" + audio.data);
    } catch (error) {
      console.log(error);
    }

    //console.log(audioSource);
    setCurrentCarouselPage(page);
  };

  const generateImageSources = () => {
    let images = [];
    let pairedImages = [];
    for (let index = 1; index <= book.pages; index++) {
      images.push(generateImageLink(book, index));
    }

    for (let index = 0; index < images.length; index = index + 2) {
      pairedImages.push({
        leftImage: images[index],
        rightImage: images[index + 1],
        loaded: false,
      });
    }

    setBookImageSources(pairedImages);
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
    <div
      key={book._id + index}
      style={{
        width: "100%",
        height: "70vh",
        margin: "auto",
      }}
    >
      {props.windowSize.width > props.windowSize.height ? (
        <div
          style={{
            height: "100%",
            margin: "auto",
            padding: 10
          }}
        >
          <Row
            style={{
              height: "100%",
              margin: "auto",
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: "1px 5px 5px rgb(0 0 0 / 50%)",
                height: "100%",
                display: "flex",
                backgroundColor: "white",
              }}
            >
              <Image
                rounded
                src={bookImageSources[index].leftImage}
                style={{
                  maxWidth: "99%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                  margin: "auto",
                  maxHeight: "99%",
                }}
              />
            </Col>
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: "1px 5px 5px rgb(0 0 0 / 50%)",
                height: "100%",
                backgroundColor: "white",
                display: "flex",
              }}
            >
              <Image
                rounded
                src={bookImageSources[index].rightImage}
                style={{
                  maxWidth: "99%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                  margin: "auto",
                  maxHeight: "99%",
                }}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "70vh",
            margin: "auto",
            padding: 10
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "50%",
              margin: "auto",
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: "1px 5px 5px rgb(0 0 0 / 50%)",
                height: "100%",
                display: "flex",
                backgroundColor: "white",
              }}
            >
              <Image
                rounded
                src={bookImageSources[index].leftImage}
                style={{
                  maxWidth: "99%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                  margin: "auto",
                  maxHeight: "99%",
                }}
              />
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              height: "50%",
              margin: "auto",
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: "1px 5px 5px rgb(0 0 0 / 50%)",
                height: "100%",
                backgroundColor: "white",
                display: "flex",
              }}
            >
              <Image
                rounded
                src={bookImageSources[index].rightImage}
                style={{
                  maxWidth: "99%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                  margin: "auto",
                  maxHeight: "99%",
                }}
              />
            </Col>
          </Row>
        </div>
      )}
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
      generateImageSources();
      handlePageChanged(currentCarouselPage);
    }
  }, [book]);

  return (
    <div className="page">
      {!started ? (
        <div
          className="overlay-screen"
          onClick={() => {
            book && bookImageSources.length > 0
              ? setStarted(true)
              : console.log("Book still loading.");
          }}
        >
          {book && bookImageSources.length > 0 ? (
            <div>Start Reading!</div>
          ) : (
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
          )}
        </div>
      ) : (
        <audio
          autoPlay
          src={audioSource}
          onPlay={(e) =>
            removeTempAudioFromServer(
              audioSource.replace(process.env.REACT_APP_URL + "/", "")
            )
          }
          ref={audioPlayerRef}
        />
      )}

      {book && bookImageSources.length > 0 ? (
        <div className="justify-content-center align-items-center">
          <div
            style={{
              width: "100vw",
              height: "80vh",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "10px",
            }}
          >
            <div className="">
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  verticalAlign: "middle",
                  objectFit: "contain",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    margin: "auto",
                    cursor: "grab",
                  }}
                >
                  <Carousel
                    showThumbs={false}
                    showArrows={false}
                    showStatus={false}
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
          <div style={{ width: "50%", margin: "auto" }}>
            <ProgressBar
              now={(currentCarouselPage / setBookImageSources.length) * 10}
              visuallyHidden
            />
            <Button variant="outline-primary">Primary</Button>
            <Button variant="outline-primary">Primary</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Read;
