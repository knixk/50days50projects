import { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const dummyParticipants = [
  {
    name: "kanishk",
    age: 23,
    id: "213123123",
  },
  {
    name: "rajeev",
    age: 40,
    id: "213124123123",
  },
  {
    name: "tanmay",
    age: 22,
    id: "2123123123",
  },
];

const postSubmission = async (data) => {
  const submissions = "http://localhost:5050/submissions";

  try {
    const response = await axios.post(submissions, data);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

function Form() {
  const [sign, setSign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({});
  const [templateId, setTemplateId] = useState(null);
  const [tempData, setTempData] = useState();
  const [questions, setQuestions] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [extraFields, setExtraFields] = useState();
  const [center, setCenter] = useState(false);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

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
    setParticipants((prev) => [...prev, { id: nanoid(), name: "", age: "" }]);
  };

  const updateParticipant = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const deleteParticipant = (id) => {
    // const updatedParticipants = [...participants];
    // updatedParticipants[index][field] = value;
    // setParticipants(updatedParticipants);
    const old = participants;
    const newData = old.filter((p) => id != p.id);
    console.log(newData);
    setParticipants(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sign) {
      console.log("no sign");
    }

    const signatureImg = sign.getTrimmedCanvas().toDataURL("image/png");
    const payload = {
      ...formData,
      participants,
      signature: signatureImg,
    };

    if (templateId) {
      const submission = {
        template_id: templateId,
        submission_data: payload,
        // name: "kanishk",
        // email: "shrivastavakanishk3@gmail.com",
        // mobile_number: 9820042672,
      };

      console.log(submission);

      postSubmission(submission);
      setDisabled(true);
      toast("Your form was submitted! redirecting to home..");
      const seconds = 5;

      setTimeout(() => {
        navigate("/");
      }, seconds * 1000);
    }
  };

  useEffect(() => {
    const fetchTemplate = async (id) => {
      const templates = "http://localhost:5050/post-center";

      const options = {
        id: id,
      };

      try {
        const response = await axios.post(templates, options);
        console.log(response.data);
        const myData = JSON.parse(response.data.data[0].template_config);
        const temp_id = response.data.data[0].id;

        if (myData) {
          setTempData(myData);
          setQuestions(myData.questions);
          setCompanyLogo(myData.company_logo);
          setExtraFields(myData.extra_participants_form_fields);
          setTemplateId(temp_id);
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
    fetchTemplate(centerParams);
  }, []);

  return (
    <div className="app__container">
      <Toaster />
      {tempData ? (
        <div>
          <form className="form__wrapper">
            <div className="form__container">
              <div className="question__container">
                <div className="question">Enter your name</div>
                <input
                  onChange={(e) =>
                    handleInputChange("fixed__name", e.target.value)
                  }
                  name="fixed__name"
                  type="text"
                  placeholder="Name.."
                  required
                />
              </div>

              <div className="question__container">
                <div className="question">Enter your email</div>
                <input
                  onChange={(e) =>
                    handleInputChange("fixed__email", e.target.value)
                  }
                  name="fixed__email"
                  type="text"
                  placeholder="Email.."
                  required
                />
              </div>

              <div className="question__container">
                <div className="question">Enter your mobile number</div>
                <input
                  onChange={(e) =>
                    handleInputChange("fixed__number", e.target.value)
                  }
                  name="fixed__number"
                  type="text"
                  placeholder="Mobile number.."
                  required
                />
              </div>

              {questions &&
                questions.map((question) => (
                  <div
                    key={question.question_id}
                    className="question__container"
                  >
                    <div className="question">{question.label}</div>

                    {question.image && (
                      <img className="question__image" src={question.image} />
                    )}

                    {question.input_type === "text" && (
                      <input
                        type="text"
                        className="text__input"
                        id={question.question_id}
                        placeholder={question.input_placeholder || ""}
                        required={question.required}
                        onChange={(e) =>
                          handleInputChange(
                            question.question_id,
                            e.target.value
                          )
                        }
                      />
                    )}
                    {question.input_type === "dropdown" && (
                      <select
                        id={question.question_id}
                        required={question.required}
                        onChange={(e) =>
                          handleInputChange(
                            question.question_id,
                            e.target.value
                          )
                        }
                      >
                        {question.values.map((option) => (
                          <option
                            className="dropdown__option"
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {question.input_type === "file" && (
                      <>
                        <label
                          htmlFor={question.question_id}
                          className="custom-file-upload"
                        >
                          Upload a file
                        </label>
                        <input
                          type="file"
                          className="file"
                          id={question.question_id}
                          required={question.required}
                          onChange={(e) =>
                            handleInputChange(
                              question.question_id,
                              e.target.files[0]
                            )
                          }
                        />
                      </>
                    )}
                    {question.input_type === "textarea" && (
                      <textarea
                        id={question.question_id}
                        placeholder="Your text here..."
                        required={question.required}
                        onChange={(e) =>
                          handleInputChange(
                            question.question_id,
                            e.target.value
                          )
                        }
                      />
                    )}

                    {question.input_type === "radio" &&
                      question.values.map((option) => (
                        <div
                          key={option}
                          className="label__container radio__container"
                        >
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name={question.question_id}
                              value={option}
                              checked={
                                formData[question.question_id] === option
                              }
                              onChange={(e) =>
                                handleRadioChange(
                                  question.question_id,
                                  e.target.value
                                )
                              }
                            />
                            {option}
                          </label>
                        </div>
                      ))}
                  </div>
                  // here =======>
                ))}

              <form className="participants__container">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="participant">
                    <input
                      required
                      type="text"
                      placeholder="Name"
                      value={participant.name}
                      className="participant__input"
                      onChange={(e) =>
                        updateParticipant(index, "name", e.target.value)
                      }
                    />
                    <input
                      required
                      type="number"
                      className="participant__input"
                      placeholder="Age"
                      value={participant.age}
                      onChange={(e) =>
                        updateParticipant(index, "age", e.target.value)
                      }
                    />
                    <button
                      onClick={() => deleteParticipant(participant.id)}
                      className="btn"
                    >
                      delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addParticipant}
                  className="add__participant btn"
                >
                  Add Participant
                </button>
              </form>

              <div className="signature__container">
                <small>Sign here..</small>
                <SignatureCanvas
                  ref={(data) => setSign(data)}
                  penColor="black"
                  canvasProps={{
                    width: 350,
                    height: 300,
                    className: "sigCanvas",
                  }}
                />
                <button
                  type="button"
                  className="btn clear"
                  onClick={() => sign && sign.clear()}
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              className="submit btn"
              disabled={disabled}
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Form;
