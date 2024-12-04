import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

const logo = "https://dypdvfcjkqkg2.cloudfront.net/large/5862799-1989.jpg";
// import logo from "../assets/unicef.png";

function Home() {
  const [layer, setLayer] = useState(1);

  const handleNext = () => {
    if (layer < 3) {
      setLayer(layer + 1);
    }
  };

  return (
    <Box
      className="homepage"
      sx={{
        width: "100vw",
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#1e88e5",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
        transition: "background-color 0.5s ease",
      }}
    >
      {/* First Screen */}
      <Box
        sx={{
          opacity: layer === 1 ? 1 : 0, // Fade in for the first screen
          transition: "opacity 0.5s ease",
          position: "absolute",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <img
          src={logo}
          style={{ width: 200, borderRadius: 5, marginBottom: 10 }}
          alt="logo"
        />

        {layer === 1 && (
          <Box>
            {/* <Typography variant="h4">company name</Typography> */}

            <Typography variant="h4">Company name</Typography>

            <Typography color={"gainsboro"} sx={{ mt: 2 }}>
              Don't let queues eat up your time, use online forms instead!
            </Typography>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 4 }}>
              Get Started
            </Button>
          </Box>
        )}
      </Box>

      {/* Second Screen */}
      <Box
        sx={{
          opacity: layer === 2 ? 1 : 0, // Fade in for the second screen
          transition: "opacity 0.5s ease",
          position: "absolute",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {layer === 2 && (
          <Box>
            <Typography variant="h4">Ready to Fill the Form?</Typography>
            <Button variant="contained" color="primary" href="/" sx={{ mt: 4 }}>
              Go back
            </Button>
            <Button
              variant="contained"
              color="primary"
              href="/form?center=1"
              sx={{ mt: 4, ml: 4 }}
            >
              Fill the Form
            </Button>
            
          </Box>
        )}
      </Box>

      {/* Third Screen (Form) */}
      <Box
        sx={{
          opacity: layer === 3 ? 1 : 0, // Fade in when the user is ready for the form
          transition: "opacity 0.5s ease",
          position: "absolute",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {layer === 3 && (
          <Box>
            <Typography variant="h4">Form Loading...</Typography>
            {/* Your form component will go here */}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Home;
