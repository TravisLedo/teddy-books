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
        height: "10vh",
        width: "100%",
        backgroundColor: "#FFF",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        boxShadow: "1px 5px 5px  rgb(0 0 0 / 50%)",
      }}
    >
      <img
        style={{
          justifyContent: "center",
          alignSelf: "center",
          maxWidth: "75%",
          maxHeight: "100%",
          paddingBottom: "10px",
          paddingTop: "10px",
          objectFit: "contain",
        }}
        src={require("../../assets/images/logo.png")}
        alt="logo"
      />
    </div>
  );
}
