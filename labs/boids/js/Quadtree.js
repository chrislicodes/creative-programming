//Learn more about this file here: https://www.youtube.com/watch?v=OJxEcs0w_kE
//https://github.com/CodingTrain/QuadTree/blob/master/quadtree.js - I made some changes to make it work with the Boid and canvas code

export class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary; //rectangle class
    this.capacity = n; //n points in each boundary
    this.points = []; //contained points
    this.divided = false; //we just want to split the same tree once
  }

  insert(point) {
    //Check if the point is located within the current QuadTree, if not, return false
    if (!this.boundary.contains(point)) {
      return false;
    }

    //If there is capacity left, take the point in and stop the insertion process
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    //If not and the tree is not divided yet, divide this tree
    if (!this.divided) {
      this.subdivide(this.capacity);
    }

    //and then insert the point in a subtree, || for short circuiting
    return (
      this.topLeft.insert(point) ||
      this.bottomLeft.insert(point) ||
      this.bottomRight.insert(point) ||
      this.topRight.insert(point)
    );
  }

  subdivide(n) {
    //create a new tree for each subsection
    let x = this.boundary.x;
    let y = this.boundary.y;
    let wh = this.boundary.w / 2;
    let hh = this.boundary.h / 2;

    let tl = new Rectangle(x, y, wh, hh);
    this.topLeft = new QuadTree(tl, this.capacity);

    let bl = new Rectangle(x, y + hh, wh, hh);
    this.bottomLeft = new QuadTree(bl, this.capacity);

    let tr = new Rectangle(x + wh, y, wh, hh);
    this.topRight = new QuadTree(tr, this.capacity);

    let br = new Rectangle(x + wh, y + hh, wh, hh);
    this.bottomRight = new QuadTree(br, this.capacity);

    this.divided = true;
  }

  show(c) {
    //draw the rect
    c.beginPath(); //beginning a new path
    c.rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    c.stroke();
    if (this.divided) {
      this.topRight.show(c);
      this.topLeft.show(c);
      this.bottomRight.show(c);
      this.bottomLeft.show(c);
    }
  }
}

export class Rectangle {
  //boundaries
  constructor(x, y, w, h) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.w = w; //width
    this.h = h; //height
  }

  contains(point) {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.w &&
      point.y >= this.y &&
      point.y <= this.y + this.h
    );
  }
}
