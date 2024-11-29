import { useState, useEffect } from "react";
import data from "../template_config.json";

import Form from "./pages/Form";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* nav here */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
