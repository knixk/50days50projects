import React from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextareaAutosize,
} from "@mui/material";

const logo = "https://dypdvfcjkqkg2.cloudfront.net/large/5862799-1989.jpg";
import formIcon from "../assets/contact-form.png";

import { useContext } from "react";
import { MyContext } from "../App";

function Navbar() {
  const myState = useContext(MyContext);
  const { handleDownload } = myState;
  // console.log(myState);

  return (
    <nav className="nav">
      {/* <img className="company__logo" src={logo} alt="" /> */}

      <div className="waiver__logo">
        <img className="form__icon" src={formIcon} alt="form-icon" />
        <p>Waiver form</p>
      </div>

      <div className="btns__container">
        <Button
          variant="contained"
          type="submit"
          id="download__btn"
          onClick={handleDownload}
        >
          Back
        </Button>

        <Button
          variant="contained"
          type="submit"
          fullWidth
          id="download__btn"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
