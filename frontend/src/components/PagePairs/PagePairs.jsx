import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import { Row, Col, ProgressBar, Button } from "react-bootstrap";
export default function PagePairs(props) {
  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        margin: "auto",
      }}
    >
      {props.currentWindowSize.width > props.currentWindowSize.height ? (
        <div
          style={{
            height: "100%",
            margin: "auto",
            padding: 10,
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
                src={props.bookImageSources[props.index].leftImage}
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
                src={props.bookImageSources[props.index].rightImage}
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
            padding: 10,
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
                src={props.bookImageSources[props.index].leftImage}
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
                src={props.bookImageSources[props.index].rightImage}
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
  );
}
