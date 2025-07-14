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
 
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// show input success message
function showSuccess() {}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log("submit");
  //   console.log(e);
  //
  //   console.log(username.value);

  if (username.value === "") {
    showError(username, "Username is required");
  } else {
    showSuccess(username);
  }
});
