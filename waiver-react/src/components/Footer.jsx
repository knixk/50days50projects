import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // console.log(myState);
  let location = useLocation();

  return (
    <>
      {location.pathname == "/search" ? (
        <></>
      ) : (
        <footer className="footer">
          {/* <img className="company__logo" src={logo} alt="" /> */}

          <div className="waiver__logo footer__logo">
            <img
              className="form__icon footer__icon"
              src={formIcon}
              alt="form-icon"
            />
            <p> Waiver form &copy; 2024</p>
          </div>

          <div className="btns__container">
            {location.pathname != "/" && (
              <Button
                variant="contained"
                type="submit"
                id="download__btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </Button>
            )}

            {location.pathname == "/view-form" && (
              <Button
                variant="contained"
                type="submit"
                fullWidth
                id="download__btn"
                onClick={handleDownload}
              >
                Download
              </Button>
            )}
          </div>
        </footer>
      )}
    </>
  );
}

export default Navbar;
