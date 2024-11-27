import { useState } from "react";
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

  const [sign, setSign] = useState();
  const [participants, setParticipants] = useState(dummyParticipants);
  const [signImg, setSignImg] = useState();
  const [participantData, setParticipantData] = useState([]);

  // main state
  const [mainState, setMainState] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const signatureImg = sign.getTrimmedCanvas().toDataURL("image/png");
    setSignImg(signatureImg);
    console.log(signatureImg);
    // console.log("form was submitted");
  };

  const handleClearCanvas = () => {
    sign && sign.clear();
  };

  const handleForm = (e) => {
    console.log(e.target.value);
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
                  <select name="cars" id="cars" required={required} onChange={handleForm}>
                    {question.values.map((elem, idx) => (
                      <option key={nanoid()} value={elem}>
                        {elem}
                      </option>
                    ))}
                  </select>
                )}

                {question.input_type == "file" && (
                  <input
                    onChange={handleForm}
                    className="file"
                    type="file"
                    required={required}
                  />
                )}

                {question.input_type == "text" && (
                  <input
                    onChange={handleForm}
                    placeholder={
                      question.input_placeholder && question.input_placeholder
                    }
                    required={required}
                    type="text"
                  />
                )}
                {question.input_type == "textarea" && (
                  <textarea
                    onChange={handleForm}
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

              <button className="add__participant btn">Add participant</button>
            </div>
            <div className="participants__container">
              {participants &&
                participants.map((participant, idx) => {
                  return (
                    <div className="participant" key={idx}>
                      <ul className="participant__list">{participant.name}</ul>
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
