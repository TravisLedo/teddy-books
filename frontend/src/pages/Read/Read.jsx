import {React, useState, useEffect, useRef, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {Row} from 'react-bootstrap';
import ProgressBar from '@ramonak/react-progress-bar';
import {Carousel} from 'react-responsive-carousel';
import PagePairs from '../../components/PagePairs/PagePairs';
import OverlayScreen from '../../components/OverlayScreen/OverlayScreen';
import {OverlayStatus} from '../../Enums/OverlayStatus';
import emptyAudio from '../../assets/audio/empty.mp3';
import ReadControlArea from '../../components/ReadControlArea/ReadControlArea';
import {AuthContext} from '../../contexts/Contexts';

import {
  getLocalUser,
  getOfflineSettings,
} from '../../services/localStorageService';
import {
  getBookById,
  getAudioForPage,
  removeTempAudioFromServer,
  generatePDFLink,
} from '../../services/apiService';
import {Document} from 'react-pdf';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Read.css';

function Read(props) {
  const authContext = useContext(AuthContext);
  const audioPlayerRef = useRef();
  const carouselRef = useRef();
  const {bookId} = useParams();
  const [book, setBook] = useState();
  const [pdf, setPdf] = useState();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [dummyArray, setDummyArray] = useState([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentCarouselPage, setCurrentCarouselPage] = useState(0);
  const [audioSource, setAudioSource] = useState();
  const [started, setStarted] = useState(false);

  const [voiceSelection, setVoiceSelection] = useState();
  const [voiceSelectionAllowed, setVoiceSelectionAllowed] = useState(false);
  const [autoNextPage, setAutoNextPage] = useState();
  const [audioEnabled, setAudioEnabled] = useState();
  const [showAudioLoading, setShowAudioLoading] = useState(false);

  const delayTime = 1000;

  const [delay, setDelay] = useState(delayTime);

  let pagesLoaded = 0;

  const pageLoaded = () => {
    pagesLoaded ++;
    if (pagesLoaded === numberOfPages) {
      setAllImagesLoaded(true);
    }
  };

  const handlePageChanged = async (page) => {
    audioPlayerRef.current.pause();
    setAudioSource(null);
    setCurrentCarouselPage(page);
  };

  const handleAutoNextPage = () => {
    if (autoNextPage) {
      next(currentCarouselPage + 1);
    }
  };

  async function fetchData() {
    try {
      const result = await getBookById(bookId);
      setBook(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const back = () => {
    if (currentCarouselPage > 0) {
      setCurrentCarouselPage(currentCarouselPage - 1);
    }
  };

  const next = () => {
    if (currentCarouselPage < numberOfPages / 2 - 1) {
      setCurrentCarouselPage(currentCarouselPage + 1);
    }
  };

  const handleAutoNextPageToggle = async () => {
    await authContext.updateAutoNextPage(autoNextPage);

    if (autoNextPage) {
      setAutoNextPage(false);
    } else {
      setAutoNextPage(true);
    }
    if (audioPlayerRef.current.ended) {
      next();
    }
  };

  const handleAudioEnabledToggle = async ()=>{
    await authContext.updateAudioEnabled(audioEnabled);

    if (audioEnabled) {
      audioPlayerRef.current.pause();
      setAudioEnabled(false);
    } else {
      audioPlayerRef.current.play();
      setAudioEnabled(true);
    }
  };

  const handleVoiceSelectionChange = async (voice) => {
    try {
      await authContext.updateVoiceSelection(voice, true);
      setVoiceSelection(voice);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  useEffect(() => {
    if (book && book.folder) {
      setPdf(generatePDFLink(book.folder));
      handlePageChanged(currentCarouselPage);
    }
  }, [book]);

  useEffect(() => {
    setDelay(delayTime);
  }, [currentCarouselPage]);

  useEffect(() => {
    setDummyArray(dummyArray);
  }, [numberOfPages]);


  useEffect(() => {
    if (
      started &&
      audioEnabled &&
      !audioPlayerRef.current.isPlaying
    ) {
      setShowAudioLoading(true);
      const handleAudio = async () => {
        let leftPage = 0;
        let rightPage = 0;
        // skipping pages because they come in pairs
        if (currentCarouselPage === 0) {
          leftPage = 1;
          rightPage = 2;
        } else {
          leftPage = currentCarouselPage * 2 + 1;
          rightPage = leftPage + 1;
        }
        try {
          const audio = await getAudioForPage(
              book,
              leftPage,
              rightPage,
              voiceSelection,
          );
          setShowAudioLoading(false);
          if (audio.data === 'empty.mp3') {
            setAudioSource(emptyAudio);
          } else {
            setAudioSource(process.env.REACT_APP_BACKEND_URL + '/' + audio.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const timer = setTimeout(() => {
        handleAudio();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [audioEnabled, started, currentCarouselPage]);

  useEffect(() => {
    handlePageChanged(currentCarouselPage);
  }, [voiceSelection]);

  useEffect(() => {
    if (authContext.user && getLocalUser()) {
      setAudioEnabled(authContext.user.settings.audioEnabled);
      setAutoNextPage(authContext.user.settings.autoNextPage);
      setVoiceSelection(authContext.user.settings.voiceSelection);
      setVoiceSelectionAllowed(true);
    } else {
      const offlineSettings = getOfflineSettings();
      setAudioEnabled(offlineSettings.audioEnabled);
      setAutoNextPage(offlineSettings.autoNextPage);
      setVoiceSelection(offlineSettings.voiceSelection);
      setVoiceSelectionAllowed(false);
    }
  }, [authContext.user]);

  return (
    <div className="read-container">
      <audio
        autoPlay={true}
        onEnded={() => {
          handleAutoNextPage();
        }}
        src={audioSource}
        onPlay={(e) => {
          try {
            if (audioSource !== emptyAudio) {
              removeTempAudioFromServer(
                  audioSource.replace(process.env.REACT_APP_BACKEND_URL + '/', ''),
              );
            }
          } catch (error) {}
        }}
        ref={audioPlayerRef}
      />
      {!started? (
        <OverlayScreen
          setStarted={setStarted}
          status={
            allImagesLoaded ?
              OverlayStatus.READY_CLICK :
              OverlayStatus.LOADING
          }
        ></OverlayScreen>
      ) : null}

      {book ? (
        <div className="justify-content-center align-items-center pages-container" style={{display: allImagesLoaded ? 'flex': 'none'}}>
          <Row >
            <Document file={pdf} loading='' error='' onLoadSuccess={(pdf)=>{
              setNumberOfPages(pdf.numPages);
              setPdfLoaded(true);
            }}>
              <Carousel
                selectedItem={currentCarouselPage}
                useRef={carouselRef}
                showThumbs={false}
                showArrows={false}
                showStatus={false}
                emulateTouch={false /* behaves strangely*/}
                showIndicators={false}
                autoPlay={false}
                onChange={(e) => handlePageChanged(e)}
              >
                { pdfLoaded && numberOfPages> 0? Array.from({length: numberOfPages}, (_, i) =>
                  <PagePairs
                    key={i}
                    currentWindowSize={props.currentWindowSize}
                    next={next}
                    back={back}
                    numberOfPages={numberOfPages}
                    index={i}
                    currentCarouselPage={currentCarouselPage}
                    pageLoaded={pageLoaded}
                  ></PagePairs>): null}
              </Carousel>
            </Document>

          </Row>

          <Row className="progress-bar-container">
            <ProgressBar
              height={props.currentWindowSize.height * 0.02}
              bgColor="#7237C5"
              customLabel=" "
              completed={
                ((currentCarouselPage + 1) / numberOfPages * 2) * 100
              }
              visuallyHidden
            />
          </Row>
          <Row className="control-area-container">
            <ReadControlArea
              currentWindowSize={props.currentWindowSize}
              voiceSelection={voiceSelection}
              voiceSelectionAllowed={voiceSelectionAllowed}
              audioEnabled={audioEnabled}
              autoNextPage={autoNextPage}
              handleVoiceSelectionChange={handleVoiceSelectionChange}
              handleAudioEnabledToggle={handleAudioEnabledToggle}
              handleAutoNextPageToggle={handleAutoNextPageToggle}
              book={book}
              showAudioLoading={showAudioLoading}
            ></ReadControlArea>
          </Row>

        </div>
      ) : null}
    </div>
  );
}

export default Read;
