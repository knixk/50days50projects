import React from "react";

function Navbar() {
  return (
    <nav className="nav">
      <img className="company__logo" src={companyLogo} alt="" />
      <p className="waiver__logo">WaiverForm</p>
    </nav>
  );
}

export default Navbar;
