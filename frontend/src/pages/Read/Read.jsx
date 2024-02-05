import {React, useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Row, Col, ProgressBar, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import './Read.css';
import {
  getBookById,
  generateImageLink,
  getAudioForPage,
  removeTempAudioFromServer,
} from '../../services/apiService';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PagePairs from '../../components/PagePairs/PagePairs';
import OverlayScreen from '../../components/OverlayScreen/OverlayScreen';
import {OverlayStatus} from '../../Enums/OverlayStatus';

function Read(props) {
  const audioPlayerRef = useRef();
  const {bookId} = useParams();
  const [book, setBook] = useState();
  const [bookImageSources, setBookImageSources] = useState([]);

  const [currentCarouselPage, setCurrentCarouselPage] = useState(0);
  const [audioSource, setAudioSource] = useState();
  const [started, setStarted] = useState(false);

  const [voiceSelection, setVoiceSelection] = useState('Whimsical');

  const handlePageChanged = async (page) => {
    setAudioSource(null);
    let leftPage = 0;
    let rightPage = 0;
    // skipping pages because they come in pairs
    if (page === 0) {
      leftPage = 1;
      rightPage = 2;
    } else {
      leftPage = page * 2 + 1;
      rightPage = leftPage + 1;
    }

    try {
      const audio = await getAudioForPage(
          book,
          leftPage,
          rightPage,
          voiceSelection,
      );
      setAudioSource(process.env.REACT_APP_URL + '/' + audio.data);
    } catch (error) {
      console.log(error);
    }

    // console.log(audioSource);
    setCurrentCarouselPage(page);
  };

  const generateImageSources = () => {
    const images = [];
    const pairedImages = [];
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
      // console.log("test 1 " + JSON.stringify(result));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const generatePages = bookImageSources.map((book, index) => (
    <PagePairs
      key={book._id + props.index}
      book={book}
      index={index}
      bookImageSources={bookImageSources}
      currentWindowSize={props.currentWindowSize}
    ></PagePairs>
  ));

  /*
  const back = () => {
    // setSelected((selected) => Math.max(selected - 1, 0));
  };

  const next = () => {
    // setSelected((selected) => Math.min(selected + 1, 2));
  };
*/
  useEffect(() => {
    fetchData();

    // todo: use local storage to save user settings
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
        <OverlayScreen
          setStarted={setStarted}
          status={
            bookImageSources.length > 0 ?
              OverlayStatus.READY_CLICK :
              OverlayStatus.LOADING
          }
        ></OverlayScreen>
      ) : (
        <audio
          autoPlay
          src={audioSource}
          onPlay={(e) => {
            try {
              removeTempAudioFromServer(
                  audioSource.replace(process.env.REACT_APP_URL + '/', ''),
              );
            } catch (error) {}
          }}
          ref={audioPlayerRef}
        />
      )}

      {book && bookImageSources.length > 0 ? (
        <div className="justify-content-center align-items-center">
          <div
            style={{
              width: '100vw',
              height: '80vh',
              justifyContent: 'center',
              alignContent: 'center',
              marginTop: '10px',
            }}
          >
            <Row
              style={{
                width: '100%',
                padding: 0,
                margin: 'auto',
                marginTop: 10,
              }}
            >
              <Col>
                <div
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    verticalAlign: 'middle',
                    objectFit: 'contain',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      margin: 'auto',
                      cursor: 'grab',
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
              </Col>
            </Row>
            <Row
              style={{
                width: '100%',
                padding: 0,
                marginTop: 10,
              }}
            >
              <Col
                style={{
                  padding: 0,
                  margin: 'auto',
                }}
              >
                <div style={{width: 200, margin: 'auto'}}>
                  <ProgressBar
                    now={
                      ((currentCarouselPage + 1) / bookImageSources.length) *
                      100
                    }
                    visuallyHidden
                  />
                </div>
              </Col>
            </Row>
            <Row
              style={{
                width: props.currentWindowSize.width * 0.8,
                padding: 0,
                margin: 'auto',
                marginTop: 10,
              }}
            >
              <div>
                <Button variant="outline-primary">Primary</Button>
                <Button variant="outline-primary">Primary</Button>
                <Button variant="outline-primary">Primary</Button>
                <Button variant="outline-primary">Primary</Button>
                <Form.Select
                  aria-label="Default select example"
                  value={voiceSelection}
                  onChange={(event) => {
                    setVoiceSelection(event.target.value);
                  }}
                >
                  <option>Select Voice</option>
                  <option value="Whimsical">Whimsical</option>
                  <option value="Cartoon Baby">Cartoon Baby</option>
                  <option value="Cartoon Kid">Cartoon Kid</option>
                  <option value="Rubie">Rubie</option>
                  <option value="Connor">Connor</option>
                </Form.Select>
              </div>
            </Row>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Read;