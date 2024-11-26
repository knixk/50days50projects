import { useState } from "react";
import "./App.css";
import data from "../template_config.json";
import unicef from "./assets/unicef.png";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";

const dummyParticipants = [
  {
    name: "kanishk",
    age: 23,
    id: nanoid(),
  },
  {
    name: "Raj",
    age: 21,
    id: nanoid(),
  },
  {
    name: "Tushar",
    age: 22,
    id: nanoid(),
  },
];

function App() {
  const questions = data.questions;
  const companyLogo = data.company_logo;
  const extraFields = data.extra_participants_form_fields;

  const data3 = extraFields.map((field) => {
    return {
      [field]: "",
    };
  });

  const [sign, setSign] = useState();
  const [participants, setParticipants] = useState(dummyParticipants);
  const [signImg, setSignImg] = useState();

  const [participantData, setParticipantData] = useState(data3);

  // Handler to update the state based on index
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    // Create a new copy of the state array
    const updatedData = [...participantData];

    // Update the correct object in the array
    updatedData[index] = { ...updatedData[index], [name]: value };

    // Set the new state
    setParticipantData(updatedData);
  };

  // console.log(initialParticipantData);

  const handleSubmit = (e) => {
    e.preventDefault();
    const signatureImg = sign.getTrimmedCanvas().toDataURL("image/png");
    setSignImg(signatureImg);
    console.log(signatureImg);
    // console.log("form was submitted");
  };

  const handleDeleteParticipant = (id) => {
    const oldData = participants;

    // return all the ones where the id is not eq to the currId
    const newData = oldData.filter((p) => {
      return p.id !== id;
    });
    setParticipants(newData);
  };

  const handleAddParticipant = () => {
    const oldData = participants;

    const newData = participantData.reduce(
      (acc, field) => ({ ...acc, ...field }),
      {}
    );

    const finalData = [...oldData, newData];

    setParticipants(finalData);
    console.log(finalData);
  };

  const handleClearCanvas = () => {
    sign && sign.clear();
  };

  return (
    <div className="app__container">
      <nav className="nav">
        <img className="company__logo" src={companyLogo} alt="" />
        <p className="waiver__logo">WaiverForm</p>
      </nav>

      <form onSubmit={handleSubmit} className="form__wrapper">
        <div className="form__container">
          {questions.map((question, idx) => {
            const required = question.required ? true : false;
            return (
              <div key={nanoid()} className="question__container">
                <div className="question">{question.label}</div>

                {question.image && (
                  <img
                    className="question__image"
                    src={unicef}
                    alt={question.label}
                  />
                )}

                {question.input_type == "dropdown" && (
                  <select name="cars" id="cars" required={required}>
                    {question.values.map((elem, idx) => (
                      <option key={nanoid()} value={elem}>
                        {elem}
                      </option>
                    ))}
                  </select>
                )}

                {question.input_type == "file" && (
                  <input className="file" type="file" required={required} />
                )}

                {question.input_type == "text" && (
                  <input
                    placeholder={
                      question.input_placeholder && question.input_placeholder
                    }
                    required={required}
                    type="text"
                  />
                )}
                {question.input_type == "textarea" && (
                  <textarea
                    placeholder="your text here.."
                    required={required}
                  ></textarea>
                )}
              </div>
            );
          })}

          <div className="participants__wrapper">
            <div className="participant__info">
              {participantData.map((item, index) => {
                // Get the key (like "name" or "age") from the object
                const fieldKey = Object.keys(item)[0];
                return (
                  <input
                    type="text"
                    name={fieldKey} // The name attribute will be "name" or "age"
                    placeholder={`Enter ${fieldKey}`}
                    value={item[fieldKey]} // Value from the state
                    onChange={(event) => handleInputChange(index, event)}
                  />
                );
              })}

              <button
                className="add__participant btn"
                onClick={handleAddParticipant}
              >
                Add participant
              </button>
            </div>
            <div className="participants__container">
              {participants &&
                participants.map((participant, idx) => {
                  const n = participant.length;
                  return (
                    <div className="participant" key={nanoid()}>
                      <p className="participant__list">
                        {/* Name: {participant.name}, Age: {participant.age} */}
                      </p>
                      <button
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="signature__container">
            <SignatureCanvas
              ref={(data) => {
                setSign(data);
              }}
              penColor="black"
              canvasProps={{ width: 350, height: 300, className: "sigCanvas" }}
            />

            <button className="btn clear" onClick={handleClearCanvas}>
              Clear
            </button>
          </div>
        </div>

        {/* {signImg && <img src={signImg} className="signature" />} */}

        <button className="submit btn">Submit</button>
      </form>

      <footer className="footer">
        <img className="company__logo" src={companyLogo} alt="" />
        <p className="waiver__logo">CompanyName &copy;</p>
      </footer>
    </div>
  );
}

export default App;
