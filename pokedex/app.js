const menuBtn = document.querySelector(".menu");

const sidebar = document.querySelector(".sidebar");

const pokeContainer = document.querySelector(".poke-container");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hide");
  if (menuBtn.textContent == "O") {
    menuBtn.textContent = "X";
    pokeContainer.classList.add("opacity");
  } else {
    menuBtn.textContent = "O";
    pokeContainer.classList.remove("opacity");
  }
});

pokeContainer.addEventListener("click", () => {
  // sidebar.classList.contains('hide') && sidebar.classList.remove("hide")
  //   console.log("clicked");
});

