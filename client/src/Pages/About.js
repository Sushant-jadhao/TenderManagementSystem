import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Added box shadow for depth
    minHeight: "70vh", // Increased minimum height
    gap: "40px", // Added gap between sections
  };

  const sectionStyle = {
    flex: "1",
    width: "300px", // Set a fixed width for each section
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    height: "500px",
  };

  const headingStyle = {
    color: "#343a40",
    fontSize: "2rem",
    marginBottom: "20px",
  };

  const paragraphStyle = {
    color: "black",
    fontSize: "20px",
    lineHeight: "1.6",
    marginBottom: "20px",
  };

  const listStyle = {
    listStyleType: "none",
    paddingLeft: "20px",
  };

  const listItemStyle = {
    color: "black",
    fontSize: "20px",
    lineHeight: "1.6",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle} className="about-container">
      <div style={sectionStyle} className="container">
        <h2 style={headingStyle} className="mt-5">
          Tender Management System
        </h2>
        <p style={paragraphStyle}>
          Welcome to the Tender Management System (TMS)! TMS is a comprehensive
          platform designed to streamline the tendering process for government
          agencies, contractors, and suppliers.
        </p>
      </div>
      <div style={sectionStyle} className="container">
        <h2 style={headingStyle}>Our Mission</h2>
        <p style={paragraphStyle}>
          Our mission is to revolutionize the way tenders are managed, making
          the process more transparent, efficient, and accessible to all
          stakeholders. By leveraging the latest technologies, such as
          blockchain and smart contracts, we aim to create a fair and
          competitive environment for bidding on government projects.
        </p>
      </div>
      <div style={sectionStyle} className="container features">
        <h2 style={headingStyle}>Key Features</h2>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Secure and transparent tendering process
          </li>
          <li style={listItemStyle}>
            Efficient management of tender documents and submissions
          </li>
          <li style={listItemStyle}>
            Real-time tracking of tender statuses and progress
          </li>
          <li style={listItemStyle}>Automated notifications and reminders</li>
          <li style={listItemStyle}>Comprehensive reporting and analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
