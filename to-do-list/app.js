const input = document.querySelector("input");
const form = document.querySelector("#form");
const ul = document.querySelector("ul");

const tds = JSON.parse(localStorage.getItem("tds"));
if (tds) {
  tds.forEach((td) => {
    console.log(td.value, td.done);
    addTodo(td);
  });
}

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

function addTodo(td) {
  const nli = document.createElement("li");
  nli.addEventListener("click", () => {
    nli.classList.toggle("done");
    updateLs();
  });
  
  nli.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    nli.remove();
    updateLs();
  });
  nli.textContent = td.value;
  if (td.done) {
    nli.classList.add("done");
  }
  ul.appendChild(nli);
  input.value = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const txt = document.querySelector("input").value;
  if (!txt) {
    return;
  }

  const td = {
    value: txt,
    done: false,
  };
  addTodo(td);
  updateLs();
});

function updateLs() {
  const lis = document.querySelectorAll("li");
  const tds = [];

  lis.forEach((li) => {
    const dt = {
      value: li.textContent,
      done: li.classList.contains("done"),
    };
    tds.push(dt);
  });

  localStorage.setItem("tds", JSON.stringify(tds));
}
