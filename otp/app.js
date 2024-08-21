const codes = document.querySelectorAll(".code");

codes[0].focus();

codes.forEach((code, idx) => {
  code.addEventListener("keydown", (e) => {
    if (idx >= 0 && idx <= 5) {
      setTimeout(() => {
        if (e.key >= 0 && e.key <= 9) {
          if (idx == 5) {
            const val = codes[idx].value;
            return;
          }
          codes[++idx].focus();
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          if (idx == 0) {
            return;
          }
          codes[idx].value = "";
          codes[--idx].focus();
        }
        console.log(idx);
      }, 10);
    }
  });
});
