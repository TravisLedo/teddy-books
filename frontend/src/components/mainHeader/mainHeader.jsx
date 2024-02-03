import Nav from "react-bootstrap/Nav";

export default function MainHeader(props) {
  return (
    <div
      style={{
        display: "flex",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 99,
        height: "5vh",
        width: "100%",
        backgroundColor: "#FFF",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        boxShadow: "1px 5px 5px  rgb(0 0 0 / 50%)",
      }}
    >
      <Nav.Link
        href="/"
        style={{
          justifyContent: "center",
          alignSelf: "center",
          maxWidth: "90%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <img
          style={{
            justifyContent: "center",
            alignSelf: "center",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src={require("../../assets/images/logo.png")}
          alt="logo"
        />
      </Nav.Link>
    </div>
  );
}
