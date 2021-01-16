"use strict";
//prettier-ignore
import { Vector2D, drawMousePosition, randomFloat } from "../../utils.js";
import { Rectangle, QuadTree } from "./Quadtree.js";
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
  showMousePos: false,
  showQuadTree: false,
  avoidWalls: true,
  artMode: false,
  color: "#ff6a00",
  nBoids: 50,
  updateBoids: true,
  drawBoids: true,
  treeCapacity: 5,
};

let paramFunc = {
  clearBoids: function () {
    flockArr = [];
  },

  spawnBoids: function () {
    for (const i in [...Array(Math.floor(param.nBoids))]) {
      let boid = new Boid(
        param.color,
        width / 2 + randomFloat(-10, 10),
        height / 2 + randomFloat(-10, 10)
      );

      flockArr.push(boid);

      quadTree.insert(boid.pos);
    }
  },
};
// ---- GUI
let gui = new dat.GUI();
let generalParams = gui.addFolder("General Parameter");
generalParams.add(param, "showMousePos");
generalParams.add(param, "artMode");

let boidParams = gui.addFolder("Boid Parameter");
boidParams.add(param, "showPerception");
boidParams.add(param, "avoidWalls");
boidParams.add(param, "maxSpeed", 1, 15);
boidParams.add(param, "percRadius", 10, 200);
boidParams.add(param, "maxForce", 0, 1);
boidParams.add(param, "alignForce", 0, 3);
boidParams.add(param, "cohesionForce", 0, 3);
boidParams.add(param, "separationForce", 0, 3);
boidParams.add(param, "updateBoids");
boidParams.add(param, "drawBoids");
boidParams.addColor(param, "color").onFinishChange(function (value) {
  param.color = value;
});
boidParams.add(paramFunc, "clearBoids");
boidParams.add(param, "nBoids", 1, 200);
boidParams.add(paramFunc, "spawnBoids");

let quadParams = gui.addFolder("Quadtree Parameter");
quadParams.add(param, "showQuadTree");
quadParams.add(param, "treeCapacity", 1, 30);
// gui.add(param, "nBoids", 0, 200);

for (const [_, value] of Object.entries(gui.__folders)) {
  value.open();
}

generalParams.open();

let flockArr = [];
let quadTree;

// ---- Spawn n boids
function init() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  width = canvas.width;
  height = canvas.height;

  flockArr = [];

  quadTree = new QuadTree(
    new Rectangle(0, 0, width, height),
    param.treeCapacity
  );
  console.log(quadTree);

  for (const i in [...Array(Math.floor(param.nBoids))]) {
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
  if (param.showMousePos) {
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
      param.avoidWalls,
      param.updateBoids,
      param.drawBoids
    );
  });
  quadTree = new QuadTree(
    new Rectangle(0, 0, width, height),
    param.treeCapacity
  );
  flockArr.forEach((boid) => {
    quadTree.insert(boid.pos);
  });
}

init();
animate();
