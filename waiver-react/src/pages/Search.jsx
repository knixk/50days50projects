import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";


function Search() {
  const [input, setInput] = useState("");
  const [params, setParams] = useState("search");
  const [data, setData] = useState([]);
  const [jwt, setJwt] = useState("");

  const getSubmissions = async (data) => {
    const submissions = `http://localhost:5050/submissions${params}`;
    // console.log(jwt);
    try {
      const response = await axios.get(submissions, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error("You're not authorized.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const data = { mobile_number: input };
    const res = await getSubmissions(data);

    if (!res) {
      console.error("Error fetching data");
      return;
    }

    if (res.data.length === 0) {
      toast("No data found.");
    }

    setData(res.data);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);

    const params = new URLSearchParams({ mobile_number: value });
    setParams(`?${params.toString()}`);
  };

  const handleDownload = (data) => {
    // console.log("clciked");

    const text = `
  Name: ${data.name}
  Mobile Number: ${data.mobile_number}
  Email: ${data.email}
  Submission ID: ${data.id}
  Template ID: ${data.template_id}
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.name}_details.txt`;
    link.click();
  };

  useEffect(() => {}, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Toaster />
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TextField
              label="JWT Token"
              variant="outlined"
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              fullWidth
            />
            <TextField
              fullWidth
              value={input}
              onChange={handleChange}
              label="Enter Mobile Number"
              variant="outlined"
              required
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={(e) => handleSubmit(e)}
            >
              Search
            </Button>
          </Box>
        </form>

        <Box mt={4}>
          {data && data.length > 0 ? (
            <Grid container spacing={3}>
              {data.map((i) => (
                <Grid item xs={12} key={i.id}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6">Name: {i.name}</Typography>
                    <Typography>Mobile Number: {i.mobile_number}</Typography>
                    <Typography>Email: {i.email}</Typography>
                    <Typography>Submission ID: {i.id}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleDownload(i)}
                    >
                      Download
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No data to display.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Search;
