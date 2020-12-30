"use strict";

//Selecting the canvas element
const canvas = document.querySelector("canvas");

//Setting the size of canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Adding context to add methods for drawing
const c = canvas.getContext("2d");

const funcContainer = function () {
  //Rectangle At Pos
  c.fillStyle = "rgb(34, 191, 162)"; //adding style to the rectangle
  c.fillRect(100, 100, 100, 100);
  c.fillStyle = "rgb(80, 198, 241)";
  c.fillRect(300, 300, 100, 150);

  //Line On Path
  c.beginPath(); //We want to start a path
  c.moveTo(50, 300); //Where to start our line
  c.lineTo(300, 100); //creates a line to the coordinates
  c.lineTo(150, 600); //creates a line to the coordinates
  c.strokeStyle = "rgb(207, 79, 79)"; //adding style to the line
  c.stroke(); //draws the line

  //Arc / Circle
  c.beginPath(); //beginning a new path
  c.arc(300, 300, 50, 0, Math.PI * 2, false); //creating the outline
  c.stroke();
};

const randomIntFromInterval = function (min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//draw 10 randomly positioned circles
//prettier-ignore
for (const i in [...Array(100)]) {
  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;
  c.strokeStyle = `rgb(${randomIntFromInterval(0, 255)},${randomIntFromInterval(0,255)},${randomIntFromInterval(0, 255)})`;
  c.beginPath(); //beginning a new path
  c.arc(x, y, 50, 0, Math.PI * 2, false); //creating the outline
  c.stroke();
}
