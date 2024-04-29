// Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Tender Management System</h1>
      {/* <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/about" style={styles.navLink}>
              About
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/contractor-profile" style={styles.navLink}>
              Contractor Section
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/tender-list" style={styles.navLink}>
              Government Section
            </Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "lightgray", // Updated background color
    color: "#fff", // Text color
    padding: "20px 0", // Increased padding for better spacing
    textAlign: "center",
  },
  title: {
    fontSize: "45px", // Increased font size for the title
    marginBottom: "10px",
    fontFamily: "Georgia",
    color: "black", // Added margin for spacing
  },
  navList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex", // Use flexbox for alignment
    justifyContent: "center", // Center the list items
  },
  navItem: {
    margin: "0 15px", // Increased margin for spacing
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px", // Added padding for better clickable area
    borderRadius: "5px", // Rounded corners for links
    transition: "background-color 0.3s ease", // Smooth transition for hover effect
  },
  navLinkHover: {
    backgroundColor: "#0056b3", // Hover background color
  },
};

export default Header;
