import { useState } from "react";
import "./App.css";
import data from "../template_config.json";
import unicef from "./assets/unicef.png";
import SignatureCanvas from "react-signature-canvas";

const dummyParticipants = [
  {
    name: "kanishk",
    age: 23,
  },
  {
    name: "Raj",
    age: 21,
  },
  {
    name: "Tushar",
    age: 22,
  },
];

function App() {
  const questions = data.questions;
  const companyLogo = data.company_logo;
  // console.log(questions);

  const [form, setForm] = useState();
  const [sign, setSign] = useState();
  const [participants, setParticipants] = useState(dummyParticipants);

  // console.log(participants);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form was submitted");
  };

  const handleAddParticipant = () => {
    console.log("add");

    const oldData = participants;

    const newData = {
      name: "someone",
      age: 23,
    };

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
            // console.log(required);
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
              <input type="text" placeholder="Participant name" />
              <input type="text" placeholder="Participant Age" />
              <button
                className="add__participant btn"
                onClick={handleAddParticipant}
              >
                + Add participant
              </button>
            </div>
            <div className="participants__container">
              {participants &&
                participants.map((participant) => {
                  return <div className="participant">{participant.name} {participant.age} <button className="btn delete">Delete</button> </div>;
                })}
            </div>
          </div>

          <div className="signature__container">
            <SignatureCanvas
              ref={(data) => setSign(data)}
              penColor="black"
              canvasProps={{ width: 350, height: 300, className: "sigCanvas" }}
            />

            <button className="btn clear" onClick={handleClearCanvas}>
              Clear
            </button>
          </div>
        </div>

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
