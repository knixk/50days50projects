// use_strict;

/* */
/* Q. why aren't we using the Onload function? */

window.addEventListener("load", function () {
  // targeting our canvas
  const canvas = document.getElementById("canvas1");
  // console.log(canvas)
  const SIZE = 500;
  const PLAYER_WIDTH = 120;
  const PLAYER_HEIGHT = 190;

  canvas.width = SIZE;
  canvas.height = SIZE;

  //   defining the classes we're going to use extensively and makes our lives easier

  class InputHandler {}

  class Projectile {}

  class Particle {}

  class Player {

    constructor(game) {
      this.game = game;
      this.height = PLAYER_HEIGHT;
      this.width = PLAYER_WIDTH;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      

    }
  }

  class Enemy {}

  class Layer {}

  class Background {}

  class UI {}

  class Game {}
});
