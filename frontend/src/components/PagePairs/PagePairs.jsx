import Image from 'react-bootstrap/Image';
import {Row, Col} from 'react-bootstrap';
import React from 'react';

import './PagePairs.css';
import PageNavigateButtons from '../PageNavigateButtons/PageNavigateButtons';
export default function PagePairs(props) {
  return (
    <div
      style={{
        width: '100%',
        height: '70vh',
        margin: 'auto',
      }}
    >
      <PageNavigateButtons next={props.next} back={props.back} bookImageSources={props.bookImageSources} currentCarouselPage={props.currentCarouselPage}></PageNavigateButtons>
      {props.currentWindowSize.width > props.currentWindowSize.height ? (
        <div
          style={{
            height: '100%',
            margin: 'auto',
            padding: 10,
          }}
        >
          <Row
            style={{
              height: '100%',
              margin: 'auto',
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: '1px 5px 5px rgb(0 0 0 / 50%)',
                height: '100%',
                display: 'flex',
                backgroundColor: 'white',
              }}
            >
              <Image
                rounded
                src={props.bookImageSources[props.index].leftImage}
                alt=""
                style={{
                  maxWidth: '99%',
                  verticalAlign: 'middle',
                  objectFit: 'contain',
                  margin: 'auto',
                  maxHeight: '99%',
                }}
              />
            </Col>
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: '1px 5px 5px rgb(0 0 0 / 50%)',
                height: '100%',
                backgroundColor: 'white',
                display: 'flex',
              }}
            >
              <Image
                rounded
                src={props.bookImageSources[props.index].rightImage}
                alt=""
                style={{
                  maxWidth: '99%',
                  verticalAlign: 'middle',
                  objectFit: 'contain',
                  margin: 'auto',
                  maxHeight: '99%',
                }}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '70vh',
            margin: 'auto',
            padding: 10,
          }}
        >
          <Row
            style={{
              width: '100%',
              height: '50%',
              margin: 'auto',
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: '1px 5px 5px rgb(0 0 0 / 50%)',
                height: '100%',
                display: 'flex',
                backgroundColor: 'white',
              }}
            >
              <Image
                rounded
                src={props.bookImageSources[props.index].leftImage}
                alt=""
                style={{
                  maxWidth: '99%',
                  verticalAlign: 'middle',
                  objectFit: 'contain',
                  margin: 'auto',
                  maxHeight: '99%',
                }}
              />
            </Col>
          </Row>
          <Row
            style={{
              width: '100%',
              height: '50%',
              margin: 'auto',
            }}
          >
            <Col
              style={{
                margin: 0,
                padding: 0,
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 5,
                boxShadow: '1px 5px 5px rgb(0 0 0 / 50%)',
                height: '100%',
                backgroundColor: 'white',
                display: 'flex',
              }}
            >
              <Image
                rounded
                src={props.bookImageSources[props.index].rightImage}
                alt=""
                style={{
                  maxWidth: '99%',
                  verticalAlign: 'middle',
                  objectFit: 'contain',
                  margin: 'auto',
                  maxHeight: '99%',
                }}
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
