import { useState } from "react";
import "./App.css";
import data from "../template_config.json";
import unicef from "./assets/unicef.png";

function App() {
  const questions = data.questions;
  console.log(questions);

  const [form, setForm] = useState();

  return (
    <div className="app__container">
      <nav className="nav">WaiverForm</nav>

      <main className="form__wrapper">
        <div className="form__container">
          {questions.map((question, idx) => {
            const required = question.required ? true : false;
            console.log(required);
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
        </div>

        <button className="submit btn">Submit</button>
      </main>

      <footer className="footer"></footer>
    </div>
  );
}

export default App;
