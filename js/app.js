"use strict";

import { randomIntFromInterval } from "./utils.js";

// ------------------------------------------------------------
// ---- Canvas Setup
// ------------------------------------------------------------

//Selecting the canvas element
const canvas = document.querySelector("canvas");

//Setting the size of canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Adding context to add methods for drawing
const c = canvas.getContext("2d");

// ------------------------------------------------------------
// ---- Tracking Mouse - Events
// ------------------------------------------------------------

const mouse = {
  x: undefined,
  y: undefined,
};

//add Eventlisteners
["mousemove", "touchmove"].forEach(() => {
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
});

// ------------------------------------------------------------
// ---- Config
// ------------------------------------------------------------

//TODO Config (transfer to new module)
const isMobile =
  Math.min(window.screen.width, window.screen.height) < 768 ||
  navigator.userAgent.indexOf("Mobi") > -1;

//number of circles
let nCircles;
isMobile ? (nCircles = 20) : (nCircles = 100);

const mouseSquare = 100; //px

const maxRadius = 100; //px
const minRadius = 10; //px;
const growRate = 5; //px;

// ------------------------------------------------------------
// ---- Circle Class
// ------------------------------------------------------------

//tracking all active circles
const activeCircles = [];

class Circle {
  type = "circle";

  //prettier-ignore
  constructor(x = window.innerWidth / 2, y = window.innerHeight / 2, dx = 1, dy = 1, radius = 50, color = "#303841") {
    //x and change in x
    this.x = x;
    this.dx = dx;
    
    //y and change in y
    this.y = y;
    this.dy = dy;

    //circle properties
    this.radius = radius;
    this.color = color;

    this.minRadius = this.radius / 2;
    
    activeCircles.push(this);
}

  draw() {
    //setting the color
    c.strokeStyle = "black";
    c.lineWidth = 6;
    c.fillStyle = this.color;

    //draw the circle
    c.beginPath(); //beginning a new path
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //creating the outline
    c.stroke();
    c.fill();
  }

  update() {
    //check for x bounce
    if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;

      //change color to red while bouncing on x
      this.color = "#FF5722";
    }

    //check for y bounce
    if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;

      //change color to green while bouncing on y
      this.color = "#EEEEEE";
    }

    //Update position
    this.x += this.dx;
    this.y += this.dy;

    //interactivity

    //Get distance from the circle to the mouse
    if (
      mouse.x - this.x < mouseSquare &&
      mouse.x - this.x > -mouseSquare &&
      mouse.y - this.y < mouseSquare &&
      mouse.y - this.y > -mouseSquare
    ) {
      if (this.radius < maxRadius) {
        this.radius += growRate;
      }

      this.color = "#303841";
    } else if (this.radius > this.minRadius) {
      this.radius -= growRate / 1.25;
    }

    //Draw new circle
    this.draw();
  }
}

// ------------------------------------------------------------
// ---- Animation
// ------------------------------------------------------------

//creating n Circles
for (const i in [...Array(nCircles)]) {
  //random values
  let radius = randomIntFromInterval(minRadius, maxRadius); //circle radius

  let x = Math.random() * (window.innerWidth - radius * 2) + radius; //x coordinate
  let y = Math.random() * (window.innerHeight - radius * 2) + radius; //y coordinate

  let dx = (Math.random() - 0.5) * 8; //change in x
  let dy = (Math.random() - 0.5) * 8; //change in y
  new Circle(x, y, dx, dy, radius);
}

const animateCircle = function () {
  requestAnimationFrame(animateCircle); //animation works by "refreshing" the page a certain amount of time -> fps
  c.clearRect(0, 0, innerWidth, innerHeight); //clearing the entire canvas

  activeCircles.forEach((circle) => {
    circle.update();
  });
};

//Starting the animation
animateCircle();
