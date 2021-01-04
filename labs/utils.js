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

    this.magnitude = this.getMagnitude();
  }

  invertVec(x = true, y = true) {
    if (x) x *= -1;
    if (y) y *= -1;

    //Chainable
    return this;
  }

  getMagnitude() {
    this.magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);

    //Chainable
    return this;
  }
}
