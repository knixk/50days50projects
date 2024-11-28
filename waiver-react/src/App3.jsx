import { useState, useEffect } from "react";
import data from "../template_config.json";

import Form from "./pages/Form";
import Home from "./pages/Home";
import Search from "./pages/Search";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* nav here */}
      <Routes>
        <Route exact path="/" element={<Form />} />
        <Route path="/form" element={<Form />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
