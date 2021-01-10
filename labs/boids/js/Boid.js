"use strict";
import { Vector2D, randomInt } from "../../utils.js";
import { width, height } from "./app.js";

export default class Boid {
  // INITIALIZATION
  constructor(color) {
    //Color
    this.color = color;

    //current position
    this.pos = new Vector2D(Math.random() * width, Math.random() * height);

    //Velocity
    this.vel = Vector2D.randomVec(-1, 3);
    this.vel.setMagnitude(randomInt(2, 4));

    //Acceleration
    this.accel = new Vector2D();

    //Maximum Steering Force
    this.maxForce = 0.05;

    //Maximum Magnitude
    this.maxSpeed = 3;
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
  align(boidsArr, percRadius) {
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
      steerForce.setMagnitude(this.maxSpeed);

      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(this.maxForce);
    }

    return steerForce;
  }

  //Steer torwards the average position
  cohesion(boidsArr, percRadius) {
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
      steerForce.setMagnitude(this.maxSpeed);

      //Steering Direction
      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(this.maxForce);
    }
    return steerForce;
  }

  separation(boidsArr, percRadius) {
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
      steerForce.setMagnitude(this.maxSpeed);
      steerForce.subVec(this.vel);
      steerForce.limitMagnitude(this.maxForce);
    }
    return steerForce;
  }

  drawBoid(c, percRadius, showPerception = false) {
    c.beginPath(); //beginning a new path
    c.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2, false); //creating the outline
    c.fill();

    if (showPerception) {
      //Perception Radius
      c.strokeStyle = "black";
      c.lineWidth = 1;

      c.beginPath(); //beginning a new path
      c.arc(this.pos.x, this.pos.y, percRadius, 0, Math.PI * 2, false); //creating the outline
      c.stroke();
    }
  }

  flock(boidsArr, percRadius, alignForce, cohesionForce, separationForce) {
    let alignment = this.align(boidsArr, percRadius).scaleMult(alignForce);
    let cohesion = this.cohesion(boidsArr, percRadius).scaleMult(cohesionForce);
    let separation = this.separation(boidsArr, percRadius).scaleMult(
      separationForce
    );

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
    showPerception = true
  ) {
    this.flock(
      boidsArr,
      percRadius,
      alignForce,
      cohesionForce,
      separationForce
    );
    this.update();
    this.bound();
    this.drawBoid(ctx, percRadius, showPerception);
  }
}
