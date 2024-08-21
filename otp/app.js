const codes = document.querySelectorAll(".code");

codes[0].focus();
let fidx = -1;

codes.forEach((code, idx) => {
  code.addEventListener("keydown", (e) => {
    setTimeout(() => {
      const key = codes[idx].value;
      if (e.key >= 0 && e.key <= 9) {
        if (idx == 5) {
          return;
        }
        codes[++idx].focus();
        fidx++;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        if (idx == 0) {
          return;
        }
        console.log("pressed");
        codes[idx].value = "";
        codes[--idx].focus();
      }
      console.log(idx);
      console.log(fidx);
    }, 10);
  });
});
