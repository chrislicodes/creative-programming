"use strict";

//Selecting the canvas element
const canvas = document.querySelector("canvas");

//Setting the size of canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Adding context to add methods for drawing
const c = canvas.getContext("2d");

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
