/* */

/*
we an onload function so that we know our window has been succesfully painted onto the browser, then we perform the actions we intend to.
*/

window.onload = function () {
  // defining our canvas
  let canvas = document.querySelector("#hello-world-canvas"); // our canvas
  let ctx = canvas.getContext("2d"); // our context ig,

  ctx.beginPath(); // start something
  ctx.strokeStyle = "darkred"; // color of stroke
  ctx.moveTo(30, 30); // start point
  ctx.lineTo(80, 80); // end point
  ctx.stroke(); // the actual draw fn

  ctx.beginPath(); // start something
  ctx.strokeStyle = "darkorange"; // color of stroke
  ctx.moveTo(80, 80); // start point
  ctx.lineTo(150, 80); // end point
  ctx.stroke(); // the actual draw fn

  ctx.beginPath(); // start something
  ctx.strokeStyle = "blue"; // color of stroke
  ctx.moveTo(150, 80); // start point
  ctx.lineTo(170, 90); // end point
  ctx.stroke(); // the actual draw fn

  //   and so on
};
