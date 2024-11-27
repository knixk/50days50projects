import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { nanoid } from "nanoid";
import "./App.css";
import data from "../template_config.json";

function App() {
  const [sign, setSign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantData, setParticipantData] = useState({});

  const questions = data.questions || [];
  const companyLogo = data.company_logo;

  // Handle dynamic input changes
  const handleInputChange = (name, value) => {
    setParticipantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddParticipant = () => {
    setParticipants((prev) => [...prev, { ...participantData, id: nanoid() }]);
    setParticipantData({});

    console.log(participantData, "pd");
    console.log(participants, "p");
  };

  const handleDeleteParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCanvas = () => sign && sign.clear();

  const handleSubmit = (e) => {
    e.preventDefault();
    const signatureImg = sign?.getTrimmedCanvas().toDataURL("image/png");
    console.log({ participants, signatureImg });
  };

  return (
    <div className="app__container">
      <nav className="nav">
        <img className="company__logo" src={companyLogo} alt="Logo" />
        <p className="waiver__logo">WaiverForm</p>
      </nav>

      <form onSubmit={handleSubmit} className="form__wrapper">
        {/* Render questions dynamically */}
        {questions.map((q) => (
          <DynamicField
            key={nanoid()}
            question={q}
            value={participantData[q.label] || ""}
            onChange={(value) => handleInputChange(q.label, value)}
          />
        ))}

        {/* Participant Manager */}
        <div className="participants__wrapper">
          <div className="participant__info">
            {Object.keys(participantData).map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={`Enter ${field}`}
                value={participantData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            ))}
            <button
              type="button"
              className="add__participant btn"
              onClick={handleAddParticipant}
            >
              Add Participant
            </button>
          </div>

          <div className="participants__container">
            {participants.map((p) => (
              <div key={p.id} className="participant">
                <ul>
                  {Object.entries(p).map(([key, value]) =>
                    key !== "id" ? (
                      <li key={key}>{`${key}: ${value}`}</li>
                    ) : null
                  )}
                </ul>
                <button
                  type="button"
                  onClick={() => handleDeleteParticipant(p.id)}
                  className="btn delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="signature__container">
          <SignatureCanvas
            ref={(data) => setSign(data)}
            penColor="black"
            canvasProps={{ width: 350, height: 300, className: "sigCanvas" }}
          />
          <button
            type="button"
            className="btn clear"
            onClick={handleClearCanvas}
          >
            Clear
          </button>
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

function DynamicField({ question, value, onChange }) {
  const { label, input_type, required, values } = question;

  if (input_type === "dropdown") {
    return (
      <div>
        <label>{label}</label>
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {values.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (input_type === "textarea") {
    return (
      <div>
        <label>{label}</label>
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (input_type === "file") {
    return (
      <div>
        <label>{label}</label>
        <input
          type="file"
          required={required}
          onChange={(e) => onChange(e.target.files[0])}
        />
      </div>
    );
  }

  // Default to text input
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default App;
