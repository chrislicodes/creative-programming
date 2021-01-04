//generates an inclusive random number
export const randomIntFromInterval = function (min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//Simple Vector Class - will be improved as needed
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

export const addVectors = function (vec1, vec2) {
  return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
};

export const normalizeVector = function (vec) {
  return new Vector2D(vec.x / vec.magnitude, vec.y / vec.magnitude);
};
