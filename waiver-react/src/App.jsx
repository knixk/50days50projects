import { useState } from "react";
import data from "../template_config.json";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";

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

function App() {
  const questions = data.questions;
  const companyLogo = data.company_logo;
  const extraFields = data.extra_participants_form_fields;

  const [sign, setSign] = useState();
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({});

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, { id: nanoid(), name: "", age: "" }]);
  };

  const updateParticipant = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const signatureImg = sign.getTrimmedCanvas().toDataURL("image/png");
    const payload = {
      ...formData,
      participants,
      signature: signatureImg,
    };
    console.log("Payload:", payload);
  };

  return (
    <div className="app__container">
      <nav className="nav">
        <img className="company__logo" src={companyLogo} alt="" />
        <p className="waiver__logo">WaiverForm</p>
      </nav>

      <form onSubmit={handleSubmit} className="form__wrapper">
        <div className="form__container">
          {questions.map((question) => (
            <div key={question.question_id} className="question__container">
              <div className="question">{question.label}</div>
              {question.input_type === "text" && (
                <input
                  type="text"
                  id={question.question_id}
                  placeholder={question.input_placeholder || ""}
                  required={question.required}
                  onChange={(e) =>
                    handleInputChange(question.question_id, e.target.value)
                  }
                />
              )}
              {question.input_type === "dropdown" && (
                <select
                  id={question.question_id}
                  required={question.required}
                  onChange={(e) =>
                    handleInputChange(question.question_id, e.target.value)
                  }
                >
                  {question.values.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {question.input_type === "file" && (
                <input
                  type="file"
                  id={question.question_id}
                  required={question.required}
                  onChange={(e) =>
                    handleInputChange(question.question_id, e.target.files[0])
                  }
                />
              )}
              {question.input_type === "textarea" && (
                <textarea
                  id={question.question_id}
                  placeholder="Your text here..."
                  required={question.required}
                  onChange={(e) =>
                    handleInputChange(question.question_id, e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <div className="participants__container">
            {participants.map((participant, index) => (
              <div key={participant.id} className="participant">
                <input
                  type="text"
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) =>
                    updateParticipant(index, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={participant.age}
                  onChange={(e) =>
                    updateParticipant(index, "age", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addParticipant}
              className="add__participant btn"
            >
              Add Participant
            </button>
          </div>

          <div className="signature__container">
            <SignatureCanvas
              ref={(data) => setSign(data)}
              penColor="black"
              canvasProps={{ width: 350, height: 300, className: "sigCanvas" }}
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

        <button type="submit" className="submit btn">
          Submit
        </button>
      </form>

      <footer className="footer">
        <img className="company__logo" src={companyLogo} alt="" />
        <p className="waiver__logo">CompanyName &copy;</p>
      </footer>
    </div>
  );
}

export default App;
