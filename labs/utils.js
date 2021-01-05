// ------------------------------------------------------------
// ---- Vector Class - will be improved as needed
// ------------------------------------------------------------
export class Vector2D {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  addVec(vec) {
    this.x += vec.x;
    this.y += vec.y;

    return this;
  }

  scaleMult(scale) {
    this.x *= scale;
    this.y *= scale;

    return this;
  }

  scaleAdd(scale) {
    this.x += scale;
    this.y += scale;

    return this;
  }

  invert(x = true, y = true) {
    if (x) x *= -1;
    if (y) y *= -1;

    //Chainable
    return this;
  }

  normalize() {
    const magn = this.getMagnitude();
    this.x /= magn;
    this.y /= magn;

    return this;
  }

  //needs to be called everytime we change call the other methods
  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

// ------------------------------------------------------------
// ---- Canvas Functions
// ------------------------------------------------------------

export const drawGrid = function (canvas, ctx, squareSize) {
  let s = squareSize;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#5c5c5c";
  ctx.beginPath();

  for (let x = 0; x <= canvas.width; x += s) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }

  for (let y = 0; y <= canvas.height; y += s) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  ctx.stroke();
};

export const drawMousePosition = function (c, mouse, effectArea) {
  c.beginPath();
  c.arc(mouse.x, mouse.y, 3, 0, 2 * Math.PI, false);
  c.closePath();
  c.fill();
  c.fillStyle = "#e72727";
  const text = "(" + mouse.x + ", " + mouse.y + ")";
  c.fillText(text, mouse.x + 5, mouse.y);

  //setting the color
  c.strokeStyle = "#e72727";
  c.lineWidth = 3;

  //draw the ball
  c.beginPath(); //beginning a new path
  // c.arc(mouse.x, mouse.y, effectArea, 0, Math.PI * 2, false); //creating the outline
  c.rect(
    mouse.x - effectArea,
    mouse.y - effectArea,
    effectArea * 2,
    effectArea * 2
  );
  c.stroke();
};
// ------------------------------------------------------------
// ---- Helper Functions
// ------------------------------------------------------------

//generates an inclusive random number
export const randomIntFromInterval = function (min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const addVectors = function (vec1, vec2) {
  return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
};