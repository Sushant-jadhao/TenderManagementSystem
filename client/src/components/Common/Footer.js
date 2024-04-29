// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        &copy; Tender Management System developed by group 31
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#333", // Example background color
    padding: "0.2px",
    position: "fixed",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
  footerText: {
    color: "#fff", // Example text color
    textAlign: "right", // Align text to the right
    marginRight: "20px", // Add some right margin for better spacing
  },
};

export default Footer;
