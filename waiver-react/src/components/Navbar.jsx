import React from "react";

const logo = "https://dypdvfcjkqkg2.cloudfront.net/large/5862799-1989.jpg";
import formIcon from "../assets/contact-form.png";

function Navbar() {
  return (
    <nav className="nav">
      {/* <img className="company__logo" src={logo} alt="" /> */}

      <div className="waiver__logo">
        <img className="form__icon" src={formIcon} alt="form-icon" />
        <p>Waiver form</p>
      </div>
    </nav>
  );
}

export default Navbar;
