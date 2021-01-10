"use strict";
//prettier-ignore
import { Vector2D, drawGrid, drawMousePosition} from "../../utils.js";
import Boid from "./Boid.js";

// ------------------------------------------------------------
// ---- Standard Setup
// ------------------------------------------------------------

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//TODO: Make this more stable
export let width = document.body.clientWidth;
export let height = document.body.clientHeight;

canvas.width = width;
canvas.height = height;

const isMobile =
  Math.min(window.screen.width, window.screen.height) < 768 ||
  navigator.userAgent.indexOf("Mobi") > -1;

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

//Adapt canvas siye
addEventListener("resize", () => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  init();
});

// ------------------------------------------------------------
// ---- Implementation
// ------------------------------------------------------------
let flockArr = [];
let nBoids = 50;

// ---- Spawn n boids
function init() {
  flockArr = [];
  for (const i in [...Array(nBoids)]) {
    flockArr.push(new Boid("red"));
  }
  console.log(flockArr);
}

// ---- Parameter

let param = {
  percRadius: 50,
  alignForce: 1,
  cohesionForce: 1,
  separationForce: 1,
  showPerception: true,
  showGrid: true,
};

// ---- GUI
let gui = new dat.GUI();
gui.add(param, "showPerception");
gui.add(param, "showGrid");
gui.add(param, "percRadius", 10, 200);
gui.add(param, "alignForce", 0, 2);
gui.add(param, "cohesionForce", 0, 2);
gui.add(param, "separationForce", 0, 2);

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
      param.showPerception
    );
  });
}

init();
animate();
