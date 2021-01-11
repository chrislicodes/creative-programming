"use strict";
import { Vector2D, randomInt, addVectors } from "../../utils.js";
import { width, height } from "./app.js";

export default class Boid {
  // INITIALIZATION
  constructor(
    color,
    xPos = Math.random() * width,
    yPos = Math.random() * height
  ) {
    //Color
    this.color = color;

    //current position
    this.pos = new Vector2D(xPos, yPos);

    //Velocity
    this.vel = Vector2D.randomVec(-1, 3);
    this.vel.setMagnitude(randomInt(2, 4));

    //Acceleration
    this.accel = new Vector2D();
  }

  //Update and calculate positions
  update() {
    this.vel.addVec(this.accel);
    this.vel.limitMagnitude(this.maxSpeed);
    this.pos.addVec(this.vel);
    this.accel.scaleMult(0);
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

  //Steer torwards the average direction
  align(boidsArr, percRadius, maxForce, maxSpeed) {
    let percTotal = 0;
    let steerForce = new Vector2D();

    for (let otherBoid of boidsArr) {
      //Calculate the distance to the other boid
      let dist = this.pos.calcDistance(otherBoid);

      //If the boid is not itself and within its perception radius
      if (otherBoid !== this && dist <= percRadius) {
        //Count the number of perceived neighbours
        percTotal++;

        //add the current velocity to the steering Force
        steerForce.addVec(otherBoid.vel);
      }
    }

    //if there is atleast one neighbor
    if (percTotal > 0) {
      //get average velocity
      steerForce.divideBy(percTotal);

      //go along maxSpeed
      steerForce.setMagnitude(maxSpeed);

      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(maxForce);
    }

    return steerForce;
  }

  //Steer torwards the average position
  cohesion(boidsArr, percRadius, maxForce, maxSpeed) {
    let percTotal = 0;
    let steerForce = new Vector2D();

    for (let otherBoid of boidsArr) {
      let dist = this.pos.calcDistance(otherBoid);

      if (otherBoid !== this && dist <= percRadius) {
        percTotal++;
        steerForce.addVec(otherBoid.pos);
      }
    }

    if (percTotal > 0) {
      steerForce.divideBy(percTotal);
      steerForce.subVec(this.pos);
      steerForce.setMagnitude(maxSpeed);

      //Steering Direction
      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(maxForce);
    }
    return steerForce;
  }

  separation(boidsArr, percRadius, maxForce, maxSpeed) {
    let percTotal = 0;

    let steerForce = new Vector2D();

    for (let otherBoid of boidsArr) {
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
      steerForce.setMagnitude(maxSpeed);
      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(maxForce);
    }
    return steerForce;
  }

  drawBoid(c, percRadius, showPerception = false) {
    c.beginPath(); //beginning a new path
    c.arc(this.pos.x, this.pos.y, 8, 0, Math.PI * 2, false); //creating the outline
    c.fillStyle = this.color;
    c.fill();

    const from = this.pos;
    const dist = new Vector2D(this.vel.x, this.vel.y).normalize().scaleMult(25);

    const to = addVectors(from, dist);

    c.lineWidth = 3;

    c.beginPath(); //beginning a new path
    c.moveTo(from.x, from.y);
    c.lineTo(to.x, to.y);
    c.stroke();

    if (showPerception) {
      //Perception Radius
      c.strokeStyle = "black";
      c.lineWidth = 1;

      c.beginPath(); //beginning a new path
      c.arc(this.pos.x, this.pos.y, percRadius, 0, Math.PI * 2, false); //creating the outline
      c.stroke();
    }
  }

  flock(
    boidsArr,
    percRadius,
    alignForce,
    cohesionForce,
    separationForce,
    maxForce,
    maxSpeed
  ) {
    let alignment = this.align(
      boidsArr,
      percRadius,
      maxForce,
      maxSpeed
    ).scaleMult(alignForce);
    let cohesion = this.cohesion(
      boidsArr,
      percRadius,
      maxForce,
      maxSpeed
    ).scaleMult(cohesionForce);
    let separation = this.separation(
      boidsArr,
      percRadius,
      maxForce,
      maxSpeed
    ).scaleMult(separationForce);

    this.accel.addVec(alignment);
    this.accel.addVec(cohesion);
    this.accel.addVec(separation);
  }

  simulate(
    ctx,
    boidsArr,
    percRadius = 50,
    alignForce = 1,
    cohesionForce = 1,
    separationForce = 1,
    showPerception = true,
    maxForce = 0.05,
    maxSpeed = 3
  ) {
    this.flock(
      boidsArr,
      percRadius,
      alignForce,
      cohesionForce,
      separationForce,
      maxForce,
      maxSpeed
    );
    this.update();
    this.bound();
    this.drawBoid(ctx, percRadius, showPerception);
  }
}
