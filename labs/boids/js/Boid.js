"use strict";
import { Vector2D, randomInt, randomFloat } from "../../utils.js";
import { width, height } from "./app.js";

export default class Boid {
  constructor() {
    this.pos = new Vector2D(Math.random() * width, Math.random() * height);
    this.vel = Vector2D.randomVec(-1, 3);
    this.vel.setMagnitude(randomInt(2, 4));
    this.accel = Vector2D.randomVec(-3, 3);
    this.maxForce = 0.02;
    this.maxSpeed = 3;
  }

  update() {
    this.pos.addVec(this.vel);
    this.vel.addVec(this.accel);
    // this.vel.limit(this.maxSpeed, this.maxSpeed);
    this.accel.scaleMult(0);
  }

  show(c) {
    c.fillRect(this.pos.x, this.pos.y, 30, 30);
  }

  bound() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  flock(boids) {
    let alignment = this.align(boids);
    this.accel.addVec(alignment);

    let cohesion = this.cohesion(boids);
    this.accel.addVec(cohesion);

    let separation = this.separation(boids);
    this.accel.addVec(separation);
  }

  align(boids) {
    let percRadius = 30;
    let percTotal = 0;

    let steerForce = new Vector2D();

    for (let otherBoid of boids) {
      let dist = this.pos.calcDistance(otherBoid);
      if (otherBoid !== this && dist < percRadius) {
        percTotal++;
        steerForce.addVec(otherBoid.vel);
      }
    }

    if (percTotal > 0) {
      steerForce.divideBy(percTotal);
      steerForce.setMagnitude(this.maxSpeed);
      steerForce.subVec(this.vel);
      steerForce.limit(this.maxForce, this.maxForce);
    }
    return steerForce;
  }

  cohesion(boids) {
    let percRadius = 200;
    let percTotal = 0;

    let steerForce = new Vector2D();

    for (let otherBoid of boids) {
      let dist = this.pos.calcDistance(otherBoid);
      if (otherBoid !== this && dist < percRadius) {
        percTotal++;
        steerForce.addVec(otherBoid.pos);
      }
    }

    if (percTotal > 0) {
      steerForce.divideBy(percTotal);
      steerForce.subVec(this.pos);
      steerForce.setMagnitude(this.maxSpeed);
      steerForce.subVec(this.vel);
      steerForce.limit(this.maxForce, this.maxForce);
    }
    return steerForce;
  }

  separation(boids) {
    let percRadius = 200;
    let percTotal = 0;

    let steerForce = new Vector2D();

    for (let otherBoid of boids) {
      let dist = this.pos.calcDistance(otherBoid);
      if (otherBoid !== this && dist < percRadius) {
        let diff = otherBoid.pos.getDistanceVec(this);
        diff.divideBy(dist);
        steerForce.addVec(diff);
        percTotal++;
      }
    }

    if (percTotal > 0) {
      steerForce.divideBy(percTotal);
      steerForce.setMagnitude(this.maxSpeed);
      steerForce.subVec(this.vel);
      steerForce.limit(this.maxForce, this.maxForce);
    }
    return steerForce;
  }
}
