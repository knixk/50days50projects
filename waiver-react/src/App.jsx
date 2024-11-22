import { useState } from "react";
import "./App.css";
import data from "../template_config.json";

function App() {
  const questions = data.questions;
  console.log(questions);

  return (
    <div className="app__container">
      <nav className="nav">WaiverForm</nav>

      <main className="form__wrapper">
        <div className="form__container">
          {questions.map((question, idx) => {
            return (
              <div key={idx + new Date()} className="question__container">
                <div className="question">{question.label}</div>

                <select name="cars" id="cars">
                  {question.values.map((elem, idx) => (
                    <option key={idx + elem} value={elem}>
                      {elem}
                    </option>
                  ))}
                </select>
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
