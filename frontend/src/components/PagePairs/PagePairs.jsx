import Image from 'react-bootstrap/Image';
import {Row, Col} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import blank from '../../assets/images/blank.png';
import PageNavigateButtons from '../PageNavigateButtons/PageNavigateButtons';
import {Document, Page} from 'react-pdf';
import './PagePairs.css';

export default function PagePairs(props) {
  const [leftIndex, setLeftIndex] = useState();
  const [rightIndex, setRightIndex] = useState();

  useEffect(() => {
    setLeftIndex(props.index * 2 + 1);
    setRightIndex(props.index * 2 + 2);
  }, [props.index]);

  return (
    <div className="page-pairs-container">
      {props.currentWindowSize.width > props.currentWindowSize.height ? (
        <div className="landscape-container">
                <PageNavigateButtons
        next={props.next}
        back={props.back}
        numberOfPages={props.numberOfPages}
        currentCarouselPage={props.currentCarouselPage}
        currentWindowSize={props.currentWindowSize}
      ></PageNavigateButtons>
          <Row className="landscape-container-row">
            <Col className="landscape-container-page">
              <Page
                className="page-image"
                loading=''
                error=''
                pageNumber={leftIndex}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={()=>{
                  props.pageLoaded();
                }}
              />
            </Col>
            <Col className="landscape-container-page">
              <Page
                className="page-image"
                loading=''
                error=''
                pageNumber={rightIndex}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={()=>{
                  props.pageLoaded();
                }}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="portrait-container">
        <PageNavigateButtons
        next={props.next}
        back={props.back}
        numberOfPages={props.numberOfPages}
        currentCarouselPage={props.currentCarouselPage}
        currentWindowSize={props.currentWindowSize}
      ></PageNavigateButtons>
          <Row className="portrait-container-row-top">
            <Col className="portrait-container-col ">
              <Page
                className="page-image"
                loading=''
                pageNumber={leftIndex} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={()=>{
                  props.pageLoaded();
                }}
              />
            </Col>
          </Row>
          <Row className="portrait-container-row-bottom">
            <Col className="portrait-container-col ">
              <Page
                className="page-image"
                loading=''
                pageNumber={rightIndex} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={()=>{
                  props.pageLoaded();
                }}
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
