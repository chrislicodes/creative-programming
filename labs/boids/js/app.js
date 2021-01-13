"use strict";
//prettier-ignore
import { Vector2D, drawGrid, drawMousePosition, randomFloat} from "../../utils.js";
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
  flockArr.push(new Boid(param.color, x, y));
});

//Adapt canvas size
addEventListener("resize", init);

// ------------------------------------------------------------
// ---- Implementation
// ------------------------------------------------------------

// ---- Parameter

let param = {
  percRadius: 100,
  maxSpeed: 6,
  maxForce: 0.05,
  alignForce: 1.2,
  cohesionForce: 1.3,
  separationForce: 1.6,
  showPerception: false,
  showGrid: false,
  avoidWalls: true,
  artMode: false,
  color: "#ff6a00",
  nBoids: 50,
};

// ---- GUI
let gui = new dat.GUI();
gui.add(param, "showPerception");
gui.add(param, "showGrid");
gui.add(param, "avoidWalls");
gui.add(param, "artMode");
gui.add(param, "maxSpeed", 1, 15);
gui.add(param, "percRadius", 10, 200);
gui.add(param, "maxForce", 0, 1);
gui.add(param, "alignForce", 0, 3);
gui.add(param, "cohesionForce", 0, 3);
gui.add(param, "separationForce", 0, 3);
// gui.add(param, "nBoids", 0, 200);

gui.add(param, "color").onFinishChange(function (value) {
  param.color = value;
});

let flockArr = [];

// ---- Spawn n boids
function init() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  width = canvas.width;
  height = canvas.height;

  flockArr = [];

  for (const i in [...Array(param.nBoids)]) {
    flockArr.push(
      new Boid(
        param.color,
        width / 2 + randomFloat(-10, 10),
        height / 2 + randomFloat(-10, 10)
      )
    );
  }
}

// ---- Animate boids
function animate() {
  requestAnimationFrame(animate);

  if (!param.artMode) {
    //Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
  }

  //Dev Mode
  if (param.showGrid) {
    drawGrid(canvas, c, squareSize);
    drawMousePosition(c, mouse, mouseEffectArea);
  }

  //Creating a copy so that each iteration every boid will be updated on a snapshot
  const flockArrCopy = flockArr.slice();

  //we need to save the array so the updates are correct
  flockArr.forEach((boid) => {
    boid.simulate(
      c,
      flockArrCopy,
      param.percRadius,
      param.alignForce,
      param.cohesionForce,
      param.separationForce,
      param.showPerception,
      param.maxForce,
      param.maxSpeed,
      param.avoidWalls
    );
  });
}

init();
animate();
