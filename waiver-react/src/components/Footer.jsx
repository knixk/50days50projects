import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import formIcon from "../assets/contact-form.png";

import { useContext } from "react";
import { MyContext } from "../App";

function Navbar() {
  const myState = useContext(MyContext);
  const { handleDownload } = myState;
  const navigate = useNavigate();

  let location = useLocation();

  return (
    <>
      {location.pathname == "/search" ? (
        <></>
      ) : (
        <footer className="footer">
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
