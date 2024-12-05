import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

// context api allows us to use state from one place in every component, which is very handy

function App() {
  const [sign, setSign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({});
  const [companyLogo, setCompanyLogo] = useState();
  const [questions, setQuestions] = useState(null);
  const [extraFields, setExtraFields] = useState();
  const [disabled, setDisabled] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState();
  const [submissionID, setSubmissionID] = useState();
  const [submissions, setSubmissions] = useState();
  const [viewParticipant, setViewParticipant] = useState();

  const handleDownload = async () => {
    const formElement = document.querySelector(".form__container__main");
    const canvas = await html2canvas(formElement, {
      useCORS: true,
      scale: 0.65,
    });

    // Get the dimensions of the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const pdf = new jsPDF({
      unit: "px", // Use pixels as the unit
      format: [canvasWidth, canvasHeight], // Set PDF page size to canvas dimensions
    });

    pdf.addImage(canvas, "PNG", 0, 0, canvasWidth, canvasHeight); // Adding the canvas to the PDF
    const pdfBlob = pdf.output("blob");

    // Create a downloadable link
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.pdf"; // File name for the download
    document.body.appendChild(a); // Append the link to the body
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up the link
    URL.revokeObjectURL(url); // Release the URL
  };

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
        handleDownload,
        submissionID,
        setSubmissionID,
        submissions,
        setSubmissions,
        viewParticipant,
        setViewParticipant,
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/search" element={<Search />} />
          <Route path="/view-form" element={<ViewForm />} />
        </Routes>
        <Footer />
      </Router>
    </MyContext.Provider>
  );
}

export default App;
