import Image from "react-bootstrap/Image";
import { Row, Col } from "react-bootstrap";
import { React, useState } from "react";
import "./PageNavigateButtons.css";
import leftArrow from "../../assets/images/arrow-previous.png";
import rightArrow from "../../assets/images/arrow-next.png";

export default function PageNavigateButtons(props) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  return (
    <div className="navigation-buttons">
      <div
        className="navigation-button"
        style={props.currentCarouselPage > 0 ? {cursor: 'pointer'} : null}
        onClick={() => props.back()}
        onMouseOver={() => setShowLeftArrow(true)}
        onMouseLeave={() => setShowLeftArrow(false)}
      >
        <div className="arrow-container-left">
        <Image
            hidden={!showLeftArrow || props.currentCarouselPage <= 0}
            className="arrow-image"
              rounded
              src={leftArrow}
              alt=""
            />
        </div>
          
      </div>
      <div
        className="navigation-button"
        style={props.currentCarouselPage < props.bookImageSources.length-1 ? {cursor: 'pointer'} : null}
        onClick={() => props.next()}
        onMouseOver={() => setShowRightArrow(true)}
        onMouseLeave={() => setShowRightArrow(false)}
      >
        <div className="arrow-container-right"> <Image
            hidden={!showRightArrow || props.currentCarouselPage >= props.bookImageSources.length-1}
            className="arrow-image"
              rounded
              src={rightArrow}
              alt=""
            /></div>
           
      </div>
    </div>
  );
}
