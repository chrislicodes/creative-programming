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
["mousemove", "touchmove"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
});

["mouseleave", "touchleave"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = undefined;
    mouse.y = undefined;
  });
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener("click", function (e) {
  //getting coordinates
  const x = e.x;
  const y = e.y;

  activeCircles.forEach((circle) => {
    circle.dx = (x - circle.x) * 0.01;
    circle.dy = (y - circle.y) * 0.01;
  });
});

canvas.addEventListener("dblclick", function (e) {
  //getting coordinates
  const x = e.x;
  const y = e.y;

  activeCircles.forEach((circle) => {
    circle.dx = (x - circle.x) * -0.1 * Math.random();
    circle.dy = (y - circle.y) * -0.1 * Math.random();
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
let growRate; //px;
let mouseSquare; //px
let maxRadius; //px
let minRadius; //px;
let dxFactor;
let dyFactor;

if (isMobile) {
  nCircles = 20;
  growRate = 3;
  mouseSquare = 40;
  maxRadius = 40;
  minRadius = 10;
  dxFactor = 5;
  dyFactor = 5;
} else {
  nCircles = 100;
  growRate = 5;
  mouseSquare = 100;
  maxRadius = 100;
  minRadius = 10;
  dxFactor = 5;
  dyFactor = 5;
}

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

  let dx = (Math.random() - 0.5) * dxFactor; //change in x
  let dy = (Math.random() - 0.5) * dyFactor; //change in y
  new Circle(x, y, dx, dy, radius);
}

//animation loop
const animateCircle = function () {
  requestAnimationFrame(animateCircle); //animation works by "refreshing" the page a certain amount of time -> fps
  c.clearRect(0, 0, innerWidth, innerHeight); //clearing the entire canvas

  activeCircles.forEach((circle) => {
    circle.update();
  });
};

//Starting the animation
animateCircle();
