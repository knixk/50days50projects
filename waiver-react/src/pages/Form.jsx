import React, { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import template_config from "../../template_config.json";

import { useContext } from "react";
import { MyContext } from "../App";

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
  const myState = useContext(MyContext);
  const {
    loading,
    setLoading,
    companyName,
    setCompanyName,
    displayForm,
    setDisplayForm,
    disabled,
    setDisabled,
    extraFields,
    setExtraFields,
    questions,
    setQuestions,
    templateId,
    setTemplateId,
    sign,
    setSign,
    participants,
    setParticipants,
    formData,
    setFormData,
    companyLogo,
    setCompanyLogo,
  } = myState;

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const centerParams = queryParameters.get("center");

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
    setParticipants((prev) => [
      ...prev,
      {
        id: nanoid(),
      },
    ]);
  };

  const updateParticipant = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const deleteParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadImageToBackend = async (imgData) => {
    return;
    const response = await axios.post("http://localhost:5050/upload-image", {
      imgData,
    });
    return response.data.link; // Backend returns the Google Drive link
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast("Submitting form, please wait...");
    setDisabled(true);

    const formElement = document.querySelector("body");
    const canvas = await html2canvas(formElement, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      scale: 1,
      logging: true,
      ignoreElements: (element) => element.tagName === "SCRIPT",
    });

    // Get the dimensions of the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const pdf = new jsPDF({
      unit: "px", // Use pixels as the unit
      format: [canvasWidth, canvasHeight], // Set PDF page size to canvas dimensions
    });

    pdf.addImage(canvas, "PNG", 0, 0, canvasWidth, canvasHeight); // Adding the canvas to the PDF
    const pdfBlob = pdf.output("blob");

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1]; // Extract Base64 string
      const payload = { imgData: `data:application/pdf;base64,${base64Data}` };

      try {
        // const response = await axios.post(
        //   "http://localhost:5050/upload-image",
        //   payload
        // );
        // const driveLink = response.data.link || ""; // Get the Google Drive link
        const submissionPayload = {
          ...formData,
          participants,
          template_id: templateId,
          // imgLink: driveLink,
          signature_data: sign?.getTrimmedCanvas().toDataURL("image/png"),
        };

        await axios.post(
          "http://localhost:5050/submissions",
          submissionPayload
        );
        toast.success("Form submitted successfully!");
        setTimeout(() => navigate("/"), 5000);
      } catch (error) {
        toast.error("Submission failed!");
        console.error(error);
      }
    };
    reader.readAsDataURL(pdfBlob);
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
        setTemplateId(ans);
      } catch (error) {
        console.error(error);
        toast("No form found...");
        setTimeout(() => navigate("/"), 5000);
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
        const myData = JSON.parse(response.data.data[0].template_config);

        if (myData) {
          setQuestions(myData.questions);
          setCompanyLogo(myData.company_logo);
          setExtraFields(myData.extra_participants_form_fields);
          setDisplayForm(true);
          setCompanyName(myData.company_name);

          // use local template
          // setQuestions(template_config.template_config.questions);
          // setCompanyLogo(template_config.template_config.company_logo);
          // setExtraFields(
          //   template_config.template_config.extra_participants_form_fields
          // );
          // setDisplayForm(true);
          // setCompanyName(template_config.template_config.company_name);

          setLoading(false);
        }
      } catch (error) {
        toast("template doesn't exist");
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const asyncFnStitch = async () => {
      const data =
        centerParams && (await getTemplateIdFromCenterID(centerParams));
      data && (await fetchTemplate(data));
    };

    asyncFnStitch();
  }, []);

  return (
    <div className="form__container__main">
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <Toaster />
        {displayForm ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              color="black"
              marginTop={2}
              letterSpacing={1.5}
            >
              {(formData && companyName) || "Company name"}
            </Typography>
            {formData && (
              <img className="form__logo" src={companyLogo} alt="" />
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                required
                onChange={(e) =>
                  handleInputChange("fixed__name", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                required
                type="email"
                onChange={(e) =>
                  handleInputChange("fixed__email", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Mobile Number"
                margin="normal"
                required
                type="tel"
                onChange={(e) =>
                  handleInputChange("fixed__number", e.target.value)
                }
              />
              {questions &&
                questions.map((question) => (
                  <Box key={question.question_id} sx={{ mt: 2 }}>
                    {question.input_type === "label" && question.label && (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: question.fontSize || "1rem", // Default size if not provided
                            color: question.color || "black", // Default color if not provided
                            fontWeight: question.bold ? "bold" : "normal", // Bold if specified
                            ...question.customStyles, // Any additional custom styles
                          }}
                        >
                          {question.label}
                        </Typography>
                      </FormControl>
                    )}

                    {question.image && (
                      <img className="question__image" src={question.image} />
                    )}

                    {question.input_type === "text" && question.label && (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography>{question.label}</Typography>
                        <TextField
                          type="text"
                          variant="outlined"
                          fullWidth
                          value={formData[question.question_id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              question.question_id,
                              e.target.value
                            )
                          }
                          placeholder={
                            question.input_placeholder || "Enter your response"
                          }
                          sx={{ mt: 2, ...question.customInputStyles }}
                        />
                      </FormControl>
                    )}

                    {question.input_type === "dropdown" && (
                      <FormControl fullWidth margin="normal">
                        <Typography>{question.label}</Typography>

                        <Select
                          value={formData[question.question_id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              question.question_id,
                              e.target.value
                            )
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
                        <Typography>{question.label}</Typography>

                        <RadioGroup
                          onChange={(e) =>
                            handleRadioChange(
                              question.question_id,
                              e.target.value
                            )
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

                    {question.input_type === "textarea" && question.label && (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: question.fontSize || "1rem",
                            color: question.color || "black",
                            fontWeight: question.bold ? "bold" : "normal",
                            ...question.customStyles,
                          }}
                        >
                          {question.label}
                        </Typography>
                        <TextField
                          multiline
                          rows={question.rows || 4}
                          variant="outlined"
                          fullWidth
                          value={formData[question.question_id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              question.question_id,
                              e.target.value
                            )
                          }
                          placeholder={
                            question.placeholder || "Enter your response"
                          }
                          sx={{ mt: 2, ...question.customTextAreaStyles }}
                        />
                      </FormControl>
                    )}

                    {/* For Date */}
                    {question.input_type === "date" && question.label && (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: question.fontSize || "1rem",
                            color: question.color || "black",
                            fontWeight: question.bold ? "bold" : "normal",
                            ...question.customStyles,
                          }}
                        >
                          {question.label}
                        </Typography>
                        <TextField
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={formData[question.question_id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              question.question_id,
                              e.target.value
                            )
                          }
                          sx={{
                            mt: 2,
                            ...question.customDateStyles,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
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
                    {extraFields.map((field, fieldIndex) => (
                      <Grid item xs={5} key={fieldIndex}>
                        <TextField
                          fullWidth
                          label={field.label}
                          type={field.type}
                          value={participant[field.label] || ""}
                          onChange={(e) =>
                            updateParticipant(
                              index,
                              field.label,
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                    ))}
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() => deleteParticipant(participant.id)}
                      >
                        <img style={{ width: 30 }} src={deleteIcon} />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
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
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "sigCanvas",
                  }}
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
        ) : (
          <></>
        )}
      </Box>
      {loading && (
        <div className="loader__container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Form;
