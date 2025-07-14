// Let's hit some JS code!!!

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// show input error message
function showError(input, message) {
  // we can targe the element above like this..
  const formControl = input.parentElement;
  // we added this classname manually here..
  formControl.className = "form-control error";

  // when the error class is added to small tag is visible
  //   Q. how it will know which small to target??
  /*
  
  since we are under the scope of this formControl,
  we do not need to specify which small tag it is..
  */

  //   console.log("im message", message);

  const small = formControl.querySelector("small");
  small.innerText = message;
}

// show input success message
function showSuccess(input) {
  const formControl = input.parentElement;
  // we added this classname manually here..
  //   this will turn it to green!!
  formControl.className = "form-control success";
}

function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    // console.log(input.value);
    if (input.value.trim() === "") {
      //   console.log(input.id);
      //   console.log("showing err");
      showError(input, `${input.id} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log("submit");
  //   console.log(e);
  //
  //   console.log(username.value);

  checkRequired([username, email, password, password2]);

  if (username.value === "") {
    showError(username, "Username is required");
  } else {
    showSuccess(username);
  }

  if (email.value === "") {
    showError(email, "Email is required");
  } else if (!isValidEmail(email.value)) {
    showError(email, "Email isn't valid");
  } else {
    showSuccess(email);
  }

  if (password.value === "") {
    showError(password, "Email is required");
  } else {
    showSuccess(password);
  }

  if (password2.value === "") {
    showError(password2, "Email is required");
  } else {
    showSuccess(password2);
  }
});
