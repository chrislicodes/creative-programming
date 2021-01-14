"use strict";
//prettier-ignore
import { Vector2D, drawGrid, drawMousePosition, randomFloat} from "../../utils.js";
import Boid from "./Boid.js";
import { Rectangle, QuadTree } from "./Quadtree.js";

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

  const boid = new Boid(param.color, x, y);

  //spawn new boid
  flockArr.push(boid);
  quadTree.insert(boid.pos);
  console.log(quadTree);
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
  showQuadTree: false,
  avoidWalls: true,
  artMode: false,
  color: "#ff6a00",
  nBoids: 50,
};

// ---- GUI
let gui = new dat.GUI();
gui.add(param, "showPerception");
gui.add(param, "showGrid");
gui.add(param, "showQuadTree");
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
let quadTree;

// ---- Spawn n boids
function init() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  width = canvas.width;
  height = canvas.height;

  flockArr = [];

  quadTree = new QuadTree(new Rectangle(0, 0, width, height), 3);
  console.log(quadTree);

  for (const i in [...Array(param.nBoids)]) {
    let boid = new Boid(
      param.color,
      width / 2 + randomFloat(-10, 10),
      height / 2 + randomFloat(-10, 10)
    );

    flockArr.push(boid);

    quadTree.insert(boid.pos);
  }

  console.log(quadTree);
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

  if (param.showQuadTree) {
    quadTree.show(c);
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
  quadTree = new QuadTree(new Rectangle(0, 0, width, height), 3);
  flockArr.forEach((boid) => {
    quadTree.insert(boid.pos);
  });
}

init();
animate();
