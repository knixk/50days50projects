import React from "react";


const logo = 'https://dypdvfcjkqkg2.cloudfront.net/large/5862799-1989.jpg'

function Navbar() {
  return (
    <nav className="nav">
      <img className="company__logo" src={logo} alt="" />
      <p className="waiver__logo">WaiverForm</p>
    </nav>
  );
}

export default Navbar;
