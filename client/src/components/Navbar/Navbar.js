// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navbarList}>
        <li style={styles.navbarItem}>
          <Link to="/" style={styles.navbarLink}>
            Home
          </Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/about" style={styles.navbarLink}>
            About
          </Link>
        </li>

        <li style={styles.navbarItem}>
          <Link to="/contractor-profile" style={styles.navbarLink}>
            Contractor Profile
          </Link>
        </li>
        <li style={styles.navbarItem}>
          <Link to="/tender-list" style={styles.navbarLink}>
            Organization Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#7CB9E8", // Green color
    padding: "10px 20px",
  },
  navbarList: {
    listStyleType: "none",
    margin: 5,
    padding: 5,
    display: "flex",
    // justifyContent: "center",
  },
  navbarItem: {
    marginRight: "20px",
  },
  navbarLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "30px",
  },
};

export default Navbar;
