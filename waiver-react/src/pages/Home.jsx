import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

function Home() {
  const [layer, setLayer] = useState(1);

  const handleNext = () => setLayer(layer + 1);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: layer === 1 ? "#1e88e5" : layer === 2 ? "#43a047" : "#fff",
        color: layer === 3 ? "#000" : "#fff",
        transition: "background-color 1s ease, transform 0.8s ease",
        transform: layer === 1 ? "scale(1)" : layer === 2 ? "rotateY(90deg)" : "rotateY(0)",
        perspective: "1000px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          transform: layer === 1 ? "rotateY(0)" : layer === 2 ? "rotateY(-90deg)" : "rotateY(0)",
          transition: "transform 1s ease",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {layer === 1 && (
          <Box>
            <Typography variant="h3">Welcome to WaiverForm</Typography>
            <Typography sx={{ mt: 2 }}>Seamless & Secure Digital Forms</Typography>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 4 }}>
              Get Started
            </Button>
          </Box>
        )}
        {layer === 2 && (
          <Box>
            <Typography variant="h4">Why Choose Us?</Typography>
            <Typography sx={{ mt: 2 }}>
              - Easy Management <br />
              - Digital Workflow <br />
              - Secure Solutions
            </Typography>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 4 }}>
              Proceed
            </Button>
          </Box>
        )}
        {layer === 3 && (
          <Box>
            <Typography variant="h4">Ready to Begin?</Typography>
            <Button
              variant="contained"
              color="primary"
              href="/form?center=12"
              sx={{ mt: 4 }}
            >
              Fill the Form
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Home;
