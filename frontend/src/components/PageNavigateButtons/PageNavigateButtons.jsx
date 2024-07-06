import Image from 'react-bootstrap/Image';
import {React, useState} from 'react';
import leftArrow from '../../assets/images/page-turn-left.png';
import rightArrow from '../../assets/images/page-turn-right.png';
import './PageNavigateButtons.css';

export default function PageNavigateButtons(props) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  return (
    <div className="navigation-buttons" style={props.currentWindowSize.width > props.currentWindowSize.height ? {width:'100vw'} : {width:'100vw'}}>
      <div
        className="navigation-button"
        style={props.currentCarouselPage > 0 ? {cursor: 'pointer'} : null}
        onClick={() => props.back()}
        onMouseOver={() => setShowLeftArrow(true)}
        onMouseLeave={() => setShowLeftArrow(false)}
      >
        <div className="arrow-container-left" style={ props.currentWindowSize.width > props.currentWindowSize.height ? {left: '6%', top: '2.5%'} : {left: '0%', top: '2.5%'}}>
          <Image
            hidden={!showLeftArrow || props.currentCarouselPage < 1}
            className="arrow-image"
            rounded
            src={leftArrow}
            alt=""
          />
        </div>
      </div>
      <div
        className="navigation-button"
        style={
          props.currentCarouselPage*2+1 < props.numberOfPages - 1 ?
            {cursor: 'pointer'} :
            null
        }
        onClick={() => props.next()}
        onMouseOver={() => setShowRightArrow(true)}
        onMouseLeave={() => setShowRightArrow(false)}
      >
        <div className="arrow-container-right" style={ props.currentWindowSize.width > props.currentWindowSize.height ? {right: '6%', top: '2.5%'} : {right: '10%', top: '2.5%'}}>
          <Image
            hidden={
              !showRightArrow ||
              props.currentCarouselPage*2+1 >= props.numberOfPages - 1
            }
            className="arrow-image"
            rounded
            src={rightArrow}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
