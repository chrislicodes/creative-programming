"use strict";

import { randomIntFromInterval } from "./utils.js";

//Selecting the canvas element
const canvas = document.querySelector("canvas");

//Setting the size of canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Adding context to add methods for drawing
const c = canvas.getContext("2d");

class Circle {
  type = "circle";

  //prettier-ignore
  constructor(x = window.innerWidth / 2, y = window.innerHeight / 2, dx = 1, dy = 1, radius = 50, color = "blue") {
    //x and change in x
    this.x = x;
    this.dx = dx;
    
    //y and change in y
    this.y = y;
    this.dy = dy;

    //circle properties
    this.radius = radius;
    this.color = color;
    
    activeCircles.push(this);
}

  draw() {
    //setting the color
    c.strokeStyle = this.color;
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
      this.color = "red";
    }

    //check for y bounce
    if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;

      //change color to green while bouncing on y
      this.color = "green";
    }

    //Update position
    this.x += this.dx;
    this.y += this.dy;

    //Draw new circle
    this.draw();
  }
}

//tracking all active circles
const activeCircles = [];

const nCircles = 35;
//creating n Circles
for (const i in [...Array(nCircles)]) {
  //random values
  let radius = randomIntFromInterval(5, 100); //circle radius

  let x = Math.random() * (innerWidth - radius * 2) + radius; //x coordinate
  let y = Math.random() * (innerHeight - radius * 2) + radius; //y coordinate

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

animateCircle();
