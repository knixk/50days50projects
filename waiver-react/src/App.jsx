import { useState } from "react";
import "./App.css";

function App() {

  return (
    <div className="app__container">
      <nav class="nav">WaiverForm</nav>

      <main class="form__wrapper">
        <div class="form__container">
          <div class="question__container">
            <div class="question">I am not subject to any illness.</div>
            <input type="text" class="answer" />
          </div>

          <div class="question__container">
            <div class="question">I am not subject to any illness.</div>
            <input type="text" class="answer" />
          </div>

          <div class="question__container">
            <div class="question">I am not subject to any illness.</div>
            <input type="text" class="answer" />
          </div>
        </div>
      </main>

      <footer class="footer"></footer>
    </div>
  );
}

export default App;
