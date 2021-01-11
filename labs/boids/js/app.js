"use strict";
//prettier-ignore
import { Vector2D, drawGrid, drawMousePosition} from "../../utils.js";
import Boid from "./Boid.js";

// ------------------------------------------------------------
// ---- Standard Setup
// ------------------------------------------------------------

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

export let width;
export let height;

// ------------------------------------------------------------
// ---- Event Listeners
// ------------------------------------------------------------

const mouse = new Vector2D(-1000, -1000);

let behindTheScenes = false;
let squareSize = 200;
let mouseEffectArea = 100;

//Checking for Dev Mode
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, function () {
    if (location.hash === "#dev") {
      behindTheScenes = true;
    } else {
      behindTheScenes = false;
    }
  });
});

//Update mouse position
["mousemove", "touchmove"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
});

//Set mouse position to undefined when leaving the canvas
["mouseleave", "touchleave"].forEach((event) => {
  canvas.addEventListener(event, function (e) {
    mouse.x = undefined;
    mouse.y = undefined;
  });
});

canvas.addEventListener("click", function (e) {
  //getting coordinates of the click
  const x = e.x;
  const y = e.y;

  //spawn new boid
  flockArr.push(new Boid("red", x, y));
});

//Adapt canvas size
addEventListener("resize", init);

// ------------------------------------------------------------
// ---- Implementation
// ------------------------------------------------------------

let flockArr = [];
let nBoids = 50;

// ---- Spawn n boids
function init() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  width = canvas.width;
  height = canvas.height;

  flockArr = [];

  for (const i in [...Array(nBoids)]) {
    flockArr.push(new Boid("#e65614"));
  }

  console.log(flockArr);
}

// ---- Parameter

let param = {
  percRadius: 120,
  maxSpeed: 3,
  maxForce: 0.05,
  alignForce: 1,
  cohesionForce: 1,
  separationForce: 1,
  showPerception: true,
  showGrid: false,
};

// ---- GUI
let gui = new dat.GUI();
gui.add(param, "showPerception");
gui.add(param, "showGrid");
gui.add(param, "maxSpeed", 0.1, 10);
gui.add(param, "percRadius", 10, 200);
gui.add(param, "maxForce", 0, 1);
gui.add(param, "alignForce", 0, 3);
gui.add(param, "cohesionForce", 0, 3);
gui.add(param, "separationForce", 0, 3);

// ---- Animate boids
function animate() {
  requestAnimationFrame(animate);

  //Clear the canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  //Dev Mode
  if (param.showGrid) {
    drawGrid(canvas, c, squareSize);
    drawMousePosition(c, mouse, mouseEffectArea);
  }

  //we need to save the array so the updates are correct
  flockArr.forEach((boid) => {
    boid.simulate(
      c,
      flockArr,
      param.percRadius,
      param.alignForce,
      param.cohesionForce,
      param.separationForce,
      param.showPerception,
      param.maxForce,
      param.maxSpeed
    );
  });
}

init();
animate();
