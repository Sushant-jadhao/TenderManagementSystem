// Home.js
import React from "react";
import image from "../images/img.jpg";

const Home = () => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 60px)",
    backgroundColor: "#343a40",
    color: "white",
    padding: "0 20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const imageContainerStyle = {
    flex: "0 0 50%",
    paddingRight: "20px",
  };

  const imageStyle = {
    width: "400px",
    height: "400px",
    maxWidth: "100%",
    display: "block",
    borderRadius: "50%",
    margin: "0 auto",
  };

  const textStyle = {
    flex: "0 0 50%",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    marginTop: "20px",
    fontFamily: "Georgia, serif",
  };

  const paragraphStyle = {
    fontSize: "1.5rem",
    lineHeight: "1.5",
    marginBottom: "1.5rem",
  };

  return (
    <div style={containerStyle}>
      <div style={imageContainerStyle}>
        <img src={image} alt="Tender Management System" style={imageStyle} />
      </div>
      <div style={textStyle}>
        <h2 style={headingStyle}>Welcome to Tender Management System</h2>
        <p style={paragraphStyle}>
          Manage your tenders efficiently with our decentralized application.
          Submit, review, and track tenders securely on the blockchain.
        </p>
        <p style={paragraphStyle}>
          Our platform ensures transparency, immutability, and trust in the
          tender management process, revolutionizing the way organizations
          handle procurement. Experience the future of procurement with us.
        </p>
        <div id="featuresSection">
          {/* <h3 style={{ marginBottom: "1rem" }}>Features</h3> */}
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {/* <li>
              Immutable Records: Tender actions are permanently recorded,
              promoting transparency.
            </li>
            <li>
              Automated Compliance: Smart contracts enforce tender rules
              automatically, reducing errors.
            </li>
            <li>
              Decentralized Decisions: Tender decisions are made by a network,
              ensuring fairness.
            </li>
            {/* Add more features as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
