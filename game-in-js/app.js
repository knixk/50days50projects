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
    update() {
      this.y += this.speedY;
    }
    draw(context) {
      // drawing our player
      context.fillReact(this.x, this.y, this.width, this.height);
    }
  }
  class Enemy {}
  class Layer {}
  class Background {}
  class UI {}
  class Game {
    constructor(height, width) {
      this.height = height;
      this.width = width;
      this.player = new Player(this);
      // q. what does this this keyword do?
      /*
      so basically, i believe, it will give the player the current instance of the object of game?
      */
    }

    update() {
      this.player.update(); // calling the player's update method
    }

    draw(context) {
      this.player.draw(context);
    }
  }
});
