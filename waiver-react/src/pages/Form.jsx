import React, { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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

import deleteIcon from "../assets/delete.png";

const Form = () => {
  const [sign, setSign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({});
  const [templateId, setTemplateId] = useState(null);
  const [tempData, setTempData] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [questions, setQuestions] = useState(null);
  const [extraFields, setExtraFields] = useState();
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const centerParams = queryParameters.get("center");
  const [center, setCenter] = useState(false);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, { id: nanoid(), name: "", age: "" }]);
  };

  const updateParticipant = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const deleteParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signatureImg = sign?.getTrimmedCanvas().toDataURL("image/png");
    const payload = { ...formData, participants, signature: signatureImg };

    // console.log(payload);

    try {
      await axios.post("http://localhost:5050/submissions", payload);
      toast.success("Form submitted successfully!");
      setDisabled(true);
      setTimeout(() => navigate("/"), 5000);
    } catch (error) {
      toast.error("Submission failed!");
      console.error(error);
    }
  };

  useEffect(() => {
    const getTemplateIdFromCenterID = async (id) => {
      let ans = null;
      const templates = "http://localhost:5050/template-id-from-center";

      const options = {
        center_id: id,
      };

      try {
        const response = await axios.post(templates, options);
        ans = response.data.template_id;
      } catch (error) {
        console.error(error);
      }

      return ans;
    };

    const fetchTemplate = async (t_id) => {
      const templates = "http://localhost:5050/post-center";

      const options = {
        id: t_id,
      };

      try {
        const response = await axios.post(templates, options);
        console.log(response);
        const myData = JSON.parse(response.data.data[0].template_config);
        // const temp_id = response.data.data[0].id;

        if (myData) {
          setTempData(myData);
          setQuestions(myData.questions);
          setCompanyLogo(myData.company_logo);
          setExtraFields(myData.extra_participants_form_fields);
        }
      } catch (error) {
        toast("template doesn't exist");
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };
    setCenter(centerParams);

    const asyncFnStitch = async () => {
      const data =
        centerParams && (await getTemplateIdFromCenterID(centerParams));
      console.log("templateId: ", data);
      data && (await fetchTemplate(data));
    };

    asyncFnStitch();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Toaster />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Waiver form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
            onChange={(e) => handleInputChange("fixed__name", e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            required
            type="email"
            onChange={(e) => handleInputChange("fixed__email", e.target.value)}
          />
          <TextField
            fullWidth
            label="Mobile Number"
            margin="normal"
            required
            type="tel"
            onChange={(e) => handleInputChange("fixed__number", e.target.value)}
          />
          {questions &&
            questions.map((question) => (
              <Box key={question.question_id} sx={{ mt: 2 }}>
                <Typography>{question.label}</Typography>
                {question.input_type === "text" && (
                  <TextField
                    fullWidth
                    margin="normal"
                    required={question.required}
                    placeholder={question.input_placeholder || ""}
                    onChange={(e) =>
                      handleInputChange(question.question_id, e.target.value)
                    }
                  />
                )}
                {question.input_type === "dropdown" && (
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={formData[question.question_id] || ""}
                      onChange={(e) =>
                        handleInputChange(question.question_id, e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Choose
                      </MenuItem>
                      {question.values.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {question.input_type === "radio" && (
                  <FormControl component="fieldset">
                    <RadioGroup
                      onChange={(e) =>
                        handleRadioChange(question.question_id, e.target.value)
                      }
                    >
                      {question.values.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}

                {question.input_type === "file" && (
                  <FormControl fullWidth margin="normal">
                    <Button
                      variant="contained"
                      component="label"
                      color="primary"
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleInputChange(
                            question.question_id,
                            e.target.files[0]
                          )
                        }
                      />
                    </Button>
                    {formData[question.question_id] && (
                      <Typography variant="body2" marginTop={1}>
                        Selected: {formData[question.question_id].name}
                      </Typography>
                    )}
                  </FormControl>
                )}

                {/* {question.input_type === "radio" && (
                  <FormControl component="fieldset">
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload files
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                        multiple
                      />
                    </Button>
                  </FormControl>
                )} */}
              </Box>
            ))}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Participants</Typography>
            {participants.map((participant, index) => (
              <Grid
                container
                spacing={2}
                style={{ marginTop: 10 }}
                alignItems="center"
                key={participant.id}
              >
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={participant.name}
                    onChange={(e) =>
                      updateParticipant(index, "name", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={participant.age}
                    onChange={(e) =>
                      updateParticipant(index, "age", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => deleteParticipant(participant.id)}>
                    {/* <HighlightOffIcon /> */}
                    {/* <deleteIcon> */}
                    <img style={{ width: 30 }} src={deleteIcon} />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              // startIcon={<AddIcon />}
              onClick={addParticipant}
              sx={{ mt: 2 }}
            >
              Add Participant
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Signature</Typography>
            <SignatureCanvas
              ref={(ref) => setSign(ref)}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => sign?.clear()}
              sx={{ mt: 1 }}
            >
              Clear
            </Button>
          </Box>

          <Button
            variant="contained"
            type="submit"
            disabled={disabled}
            sx={{ mt: 3 }}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Form;
