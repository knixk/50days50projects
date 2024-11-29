import React from "react";

// const logo = 'https://dypdvfcjkqkg2.cloudfront.net/large/5862799-1989.jpg'
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home__container">
      <main className="main__container">
        <p className="heading">WaiverForm</p>
        <p className="sub__heading">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore{" "}
        </p>

        <div className="btn__container">
          <Link to={'/form?center=12'} className="btn fill-btn">Fill the form</Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
