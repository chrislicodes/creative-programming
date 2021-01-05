"use strict";
//prettier-ignore
import { randomIntFromInterval, Vector2D, addVectors, drawGrid, drawMousePosition} from "../../utils.js";

// ------------------------------------------------------------
// ---- Canvas Setup
// ------------------------------------------------------------

//Selecting the canvas element
const canvas = document.querySelector("canvas");

//Setting the size of canvas
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//Adding context to add methods for drawing
const c = canvas.getContext("2d");

// ------------------------------------------------------------
// ---- Config
// ------------------------------------------------------------

//TODO Config (transfer to new module)
const isMobile =
  Math.min(window.screen.width, window.screen.height) < 768 ||
  navigator.userAgent.indexOf("Mobi") > -1;

//number of balls
let nBalls;
let growRate; //px;
let mouseEffectArea; //px
let maxRadius; //px
let minRadius; //px;
let dxFactor;
let dyFactor;
let nX;
let squareSize;

if (isMobile) {
  nBalls = 30;
  growRate = 3;
  mouseEffectArea = 40;
  maxRadius = 60;
  minRadius = 10;
  dxFactor = 2;
  dyFactor = 2;
  nX = 5;
  squareSize = 150;
} else {
  nBalls = 100;
  growRate = 5;
  mouseEffectArea = 100;
  maxRadius = 100;
  minRadius = 10;
  dxFactor = 3;
  dyFactor = 3;
  nX = 10; //grid - size
  squareSize = 200;
}

// ------------------------------------------------------------
// ---- Ball Class
// ------------------------------------------------------------

//tracking all active balls
const activeBalls = [];

class Ball {
  type = "ball";

  //prettier-ignore
  constructor(x = canvas.width / 2, y = canvas.height / 2, dx = 1, dy = 1, radius = 50, color = "#303841") {
    //x and change in x
    this.loc = new Vector2D(x, y);
    this.veloc = new Vector2D(dx, dy);   
    this.accel = new Vector2D(0, 0);

    //ball properties
    this.radius = radius;
    this.minRadius = this.radius / 2;
    this.color = color;

    //add the reference value to the active objects
    activeBalls.push(this);
}

  draw() {
    //setting the color
    c.strokeStyle = "black";
    c.lineWidth = 6;
    c.fillStyle = this.color;

    //draw the ball
    c.beginPath(); //beginning a new path
    c.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2, false); //creating the outline
    c.stroke();
    c.fill();
  }

  drawDirection() {
    const from = this.loc;
    const dist = new Vector2D(this.veloc.x, this.veloc.y)
      .normalize()
      .scaleMult(this.radius * 1.5);

    const to = addVectors(from, dist);

    c.lineWidth = 3;

    c.beginPath(); //beginning a new path
    c.moveTo(from.x, from.y);
    c.lineTo(to.x, to.y);
    c.stroke();
  }

  update() {
    //check for x bounce
    if (this.loc.x + this.radius >= canvas.width) {
      this.veloc.x = this.veloc.x = -Math.abs(this.veloc.x);

      //meh, not DRY
      this.color = `${getComputedStyle(
        document.documentElement
      ).getPropertyValue("--color-primary-light")}`;
    } else if (this.loc.x - this.radius <= 0) {
      this.veloc.x = Math.abs(this.veloc.x);

      //meh, not DRY
      this.color = `${getComputedStyle(
        document.documentElement
      ).getPropertyValue("--color-primary-light")}`;
    }

    //check for y bounce
    if (this.loc.y + this.radius >= canvas.height) {
      this.veloc.y = -Math.abs(this.veloc.y);
      //meh, not DRY
      this.color = "#EEEEEE";
    } else if (this.loc.y - this.radius <= 0) {
      this.veloc.y = Math.abs(this.veloc.y);

      //meh, not DRY
      this.color = "#EEEEEE";
    }

    //Update position
    this.loc.x += this.veloc.x;
    this.loc.y += this.veloc.y;

    //interactivity
    //Get distance from the ball to the mouse
    if (
      mouse.x - this.loc.x < mouseEffectArea &&
      mouse.x - this.loc.x > -mouseEffectArea &&
      mouse.y - this.loc.y < mouseEffectArea &&
      mouse.y - this.loc.y > -mouseEffectArea
    ) {
      //only grow up to the maxRadius
      if (this.radius < maxRadius) {
        this.radius += growRate;
      }

      //change the color to inital color if hovered
      this.color = "#303841";

      //grow back to minRadius
    } else if (this.radius > this.minRadius) {
      this.radius -= growRate / 1.25;
    }

    //Draw new ball
    this.draw();
    this.drawDirection();
  }
}

// ------------------------------------------------------------
// ---- Tracking Events
// ------------------------------------------------------------

const mouse = new Vector2D(0, 0);

c.font = "700 20px Arial";
c.textBaseline = "middle";

//add Eventlisteners
//Updating the mouse position
["mousemove", "touchmove"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
});

//Clear mouse position if pointer is not pointing on the canvas
["mouseleave", "touchleave"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = undefined;
    mouse.y = undefined;
  });
});

//Changing the canvas size when the user resizes it
window.addEventListener("resize", function () {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
});

//Attract all balls to the pointer
canvas.addEventListener("click", function (e) {
  //getting coordinates of the click
  const x = e.x;
  const y = e.y;

  //update movement directions of all balls, so that all balls arrive at the same time
  activeBalls.forEach((ball) => {
    ball.veloc.x = (x - ball.loc.x) * 0.01;
    ball.veloc.y = (y - ball.loc.y) * 0.01;
  });
});

//Repel all points from the pointer, the closer balls faster than the ones that are further away
canvas.addEventListener("dblclick", function (e) {
  //getting coordinates of double click
  const x = e.x;
  const y = e.y;

  //update movement directions of all balls, so that all balls are getting repelled away from the pointer
  activeBalls.forEach((ball) => {
    let length = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
    ball.veloc.x = (x - ball.loc.x) * -0.08 * Math.random();
    ball.veloc.y = (y - ball.loc.y) * -0.08 * Math.random();
  });
});

// ------------------------------------------------------------
// ---- Animation
// ------------------------------------------------------------

//creating n Balls
for (const i in [...Array(nBalls)]) {
  //random values
  let radius = randomIntFromInterval(minRadius, maxRadius); //ball radius

  let x = Math.random() * (canvas.width - radius * 2) + radius; //x coordinate
  let y = Math.random() * (canvas.height - radius * 2) + radius; //y coordinate

  let dx = (Math.random() - 0.5) * dxFactor; //change in x
  let dy = (Math.random() - 0.5) * dyFactor; //change in y

  new Ball(x, y, dx, dy, radius);
}

//animation loop
const animateBall = function () {
  requestAnimationFrame(animateBall); //animation works by "refreshing" the page a certain amount of time -> fps
  c.clearRect(0, 0, innerWidth, innerHeight); //clearing the entire canvas
  drawGrid(canvas, c, squareSize);
  //update every ball on the screen
  activeBalls.forEach((ball) => {
    ball.update();
  });

  drawMousePosition(c, mouse, mouseEffectArea);
};

//TODO: GUI

//Starting the animation
animateBall();
