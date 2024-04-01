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
  generateImageLink,
  getAudioForPage,
  removeTempAudioFromServer,
} from '../../services/apiService';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Read.css';

function Read(props) {
  const authContext = useContext(AuthContext);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const audioPlayerRef = useRef();
  const carouselRef = useRef();
  const {bookId} = useParams();
  const [book, setBook] = useState();
  const [bookImageSources, setBookImageSources] = useState([]);
  const [currentCarouselPage, setCurrentCarouselPage] = useState(0);
  const [audioSource, setAudioSource] = useState();
  const [started, setStarted] = useState(false);

  const [voiceSelection, setVoiceSelection] = useState();
  const [voiceSelectionAllowed, setVoiceSelectionAllowed] = useState(false);
  const [autoNextPage, setAutoNextPage] = useState();
  const [audioEnabled, setAudioEnabled] = useState();

  const delayVoiceTime = 1000;
  const [timerDone, setTimerDone] = useState(false);

  const handlePageChanged = async (page) => {
    audioPlayerRef.current.pause();
    setTimerDone(false);
    setAudioSource(null);
    setCurrentCarouselPage(page);
  };

  const handleAutoNextPage = () => {
    if (autoNextPage) {
      next(currentCarouselPage + 1);
    }
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
      });
    }
    setBookImageSources(pairedImages);
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
    if (currentCarouselPage < book.pages / 2 - 1) {
      setCurrentCarouselPage(currentCarouselPage + 1);
    }
  };

  const handleAutoNextPageToggle = async () => {
    authContext.updateAutoNextPage(autoNextPage);

    if (autoNextPage) {
      setAutoNextPage(false);
    } else {
      setAutoNextPage(true);
    }
    if (audioPlayerRef.current.ended) {
      next();
    }
  };

  const handleAudioEnabledToggle = ()=>{
    authContext.updateAudioEnabled(audioEnabled);

    if (audioEnabled) {
      audioPlayerRef.current.pause();
      setAudioEnabled(false);
    } else {
      audioPlayerRef.current.play();
      setAudioEnabled(true);
    }
  };


  const handleVoiceSelectionChange = (voice) => {
    authContext.updateVoiceSelection(voice);
    setVoiceSelection(voice);
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

  useEffect(() => {
    setTimeout(function() {
      if (!timerDone) {
        setTimerDone(true);
      }
    }, delayVoiceTime);
  }, [timerDone]);

  useEffect(() => {
    if (
      timerDone &&
      started &&
      audioEnabled &&
      !audioPlayerRef.current.isPlaying
    ) {
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
          if (audio.data === 'empty.mp3') {
            setAudioSource(emptyAudio);
          } else {
            setAudioSource(process.env.REACT_APP_BACKEND_URL + '/' + audio.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleAudio();
    }
  }, [audioEnabled, timerDone, started]);

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

  const generatePages = bookImageSources.map((book, index) => (
    <PagePairs
      key={book._id + props.index}
      book={book}
      index={index}
      bookImageSources={bookImageSources}
      currentWindowSize={props.currentWindowSize}
      currentCarouselPage={currentCarouselPage}
      next={next}
      back={back}
    ></PagePairs>
  ));

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
      {!started ? (
        <OverlayScreen
          setStarted={setStarted}
          status={
            bookImageSources.length > 0 ?
              OverlayStatus.READY_CLICK :
              OverlayStatus.LOADING
          }
        ></OverlayScreen>
      ) : null}

      {book && bookImageSources.length > 0 ? (
        <div className="justify-content-center align-items-center pages-container">
          <Row>
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
              {generatePages}
            </Carousel>
          </Row>

          <Row className="progress-bar-container">
            <ProgressBar
              height={props.currentWindowSize.height * 0.02}
              bgColor="#7237C5"
              customLabel=" "
              completed={
                ((currentCarouselPage + 1) / bookImageSources.length) * 100
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
            ></ReadControlArea>
          </Row>
        </div>
      ) : null}
    </div>
  );
}

export default Read;
