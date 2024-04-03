import Image from 'react-bootstrap/Image';
import {Row, Col} from 'react-bootstrap';
import React, {useState} from 'react';
import blank from '../../assets/images/blank.png';
import PageNavigateButtons from '../PageNavigateButtons/PageNavigateButtons';
import './PagePairs.css';

export default function PagePairs(props) {
  const [leftImage, setLeftImage] = useState(
      props.bookImageSources[props.index].leftImage,
  );
  const [rightImage, setRightImage] = useState(
      props.bookImageSources[props.index].rightImage,
  );

  return (
    <div className="page-pairs-container">
      <PageNavigateButtons
        next={props.next}
        back={props.back}
        bookImageSources={props.bookImageSources}
        currentCarouselPage={props.currentCarouselPage}
      ></PageNavigateButtons>
      {props.currentWindowSize.width > props.currentWindowSize.height ? (
        <div className="landscape-container">
          <Row className="landscape-container-row">
            <Col className="landscape-container-page">
              <Image
                className="page-image"
                rounded
                onError={(e) => {
                  e.onError = null;
                  setLeftImage(blank);
                }} src={leftImage}
                alt=""
              />
            </Col>
            <Col className="landscape-container-page">
              <Image
                className="page-image"
                rounded
                onError={(e) => {
                  e.onError = null;
                  setRightImage(blank);
                }}
                src={rightImage}
                alt=""
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="portrait-container">
          <Row className="portrait-container-row-top">
            <Col className="portrait-container-col ">
              <Image
                className="page-image"
                rounded
                onError={() => setLeftImage(blank)}
                src={leftImage}
                alt=""
              />
            </Col>
          </Row>
          <Row className="portrait-container-row-bottom">
            <Col className="portrait-container-col ">
              <Image
                className="page-image"
                rounded
                onError={() => setRightImage(blank)}
                src={rightImage}
                alt=""
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
