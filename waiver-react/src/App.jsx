import { useState, useEffect } from "react";
import data from "../template_config.json";

import Form from "./pages/Form";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ViewForm from "./pages/ViewForm";

import { createContext } from "react";

// Create the context
export const MyContext = createContext();

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [sign, setSign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({});
  const [companyLogo, setCompanyLogo] = useState();
  const [questions, setQuestions] = useState(null);
  const [extraFields, setExtraFields] = useState();
  const [disabled, setDisabled] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search);
  const centerParams = queryParameters.get("center");
  const [displayForm, setDisplayForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState();

  return (
    <MyContext.Provider
      value={{
        templateId,
        setTemplateId,
        loading,
        setLoading,
        companyName,
        setCompanyName,
        displayForm,
        setDisplayForm,
        disabled,
        setDisabled,
        extraFields,
        setExtraFields,
        sign,
        setSign,
        participants,
        setParticipants,
        formData,
        setFormData,
        companyLogo,
        setCompanyLogo,
        questions,
        setQuestions,
      }}
    >
      <Router>
        {/* nav here */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/search" element={<Search />} />
          <Route path="/view-form" element={<ViewForm />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </MyContext.Provider>
  );
}

export default App;
