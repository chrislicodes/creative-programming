"use strict";
//prettier-ignore
import { Vector2D, drawGrid, drawMousePosition} from "../../utils.js";
import Boid from "./Boid.js";

// ------------------------------------------------------------
// ---- Standard Setup
// ------------------------------------------------------------

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

export let width = document.body.clientWidth;
export let height = document.body.clientHeight;

canvas.width = width;
canvas.height = height;

const isMobile =
  Math.min(window.screen.width, window.screen.height) < 768 ||
  navigator.userAgent.indexOf("Mobi") > -1;

let parameter = {};

const addParameter = function (key, value) {
  parameter[key] = value;
};

addParameter("isMobile", isMobile);

// ------------------------------------------------------------
// ---- Event Listeners
// ------------------------------------------------------------

const mouse = new Vector2D(-1000, -1000);

let behindTheScenes = false;
let squareSize = 200;
let mouseEffectArea = 100;

["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, function () {
    if (location.hash === "#dev") {
      behindTheScenes = true;
    } else {
      behindTheScenes = false;
    }
  });
});

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

addEventListener("resize", () => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  init();
});

// ------------------------------------------------------------
// ---- Implementation
// ------------------------------------------------------------
let flock = [];

function init() {
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }
  console.log(flock);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (behindTheScenes) {
    drawGrid(canvas, c, squareSize);
    drawMousePosition(c, mouse, mouseEffectArea);
  }

  flock.forEach((boid) => {
    boid.update();
    boid.bound();
    boid.flock(flock);
    boid.show(c);
  });
}

init();
animate();
