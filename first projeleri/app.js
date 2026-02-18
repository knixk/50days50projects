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


*/