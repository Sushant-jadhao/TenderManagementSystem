import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import ContractorProfile from "./Pages/ContractorProfile";
import TenderList from "./Pages/TenderList";
import Header from "./components/Common/Header";
import Navbar from "./components/Navbar/Navbar"; // Import Navbar component
import "./App.css"; // Import external CSS file for additional styling

const App = () => {
  return (
    <Router>
      <div style={styles.container}>
        {" "}
        {/* Apply styles to the container */}
        <Header />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contractor-profile" element={<ContractorProfile />} />
          <Route path="/tender-list" element={<TenderList />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    backgroundColor: "#f0f0f0", // Add background color to the container
    // padding: "20px", // Add padding to the container
  },
};

export default App;
