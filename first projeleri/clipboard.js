// defining our canvas
let canvas = document.querySelector("#hello-world-canvas");
let ctx = canvas.getContext("2d");

// blue rectangle
ctx.fillStyle = "skyblue";
ctx.fillRect(20, 20, 30, 30);

// yellow rectangle
ctx.fillStyle = "yellow";
ctx.fillRect(50, 20, 40, 50);

/* 
if u read the documentation, ull see that first one is x axis,
second is y axis,

and the latter are the length and breadth

≈
*/

window.onload = function () {
    
}
=======



/* */

/*
we an onload function so that we know our window has been succesfully painted onto the browser, then we perform the actions we intend to.
*/


window.onload = function () {
  // defining our canvas
  let canvas = document.querySelector("#hello-world-canvas"); // our canvas
  let ctx = canvas.getContext("2d"); // our context ig, 

    ctx.beginPath(); // start something
    ctx.strokeStyle = 'darkred' // color of stroke
    ctx.lineWidth = 5; // width
    ctx.moveTo(70, 70); // start point
    ctx.lineTo(200, 70); // end point
    ctx.stroke(); // the actual draw fn

};




