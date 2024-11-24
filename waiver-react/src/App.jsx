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

  // console.log(extraFields);
  // console.log(questions);

  const [form, setForm] = useState();
  const [sign, setSign] = useState();
  const [participants, setParticipants] = useState(dummyParticipants);
  const [signImg, setSignImg] = useState();

  const [participantName, setParticipantName] = useState();
  const [participantAge, setParticipantAge] = useState();

  // console.log(participants);

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

    const newData = {
      name: participantName,
      age: participantAge,
      id: nanoid(),
    };

    const finalData = [...oldData, newData];

    setParticipants(finalData);
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
              <div key={idx + new Date()} className="question__container">
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
                      <option key={idx + new Date()} value={elem}>
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
              {data.extra_participants_form_fields.map((field_name) => {
                console.log("run");
                return <input />;
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
                participants.map((participant) => {
                  return (
                    <div className="participant">
                      <p className="participant__list">
                        Name: {participant.name}, Age: {participant.age}
                      </p>{" "}
                      <button
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="btn delete"
                      >
                        Delete
                      </button>{" "}
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
