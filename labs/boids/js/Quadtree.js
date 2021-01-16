//https://github.com/CodingTrain/QuadTree/blob/master/quadtree.js - customized to make it work with Boid and Canvas code (source is working with P5.js)

export class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary; //rectangle class
    this.capacity = n; //n points in each boundary
    this.points = []; //contained points
    this.divided = false; //we just want to split the same tree once
  }

  insert(point) {
    //Check if the point is located within the current QuadTree, if not, return false
    if (!this.boundary.contains(point.pos)) {
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

  query(range, found) {
    //in the first iteration, init found array
    if (!found) {
      found = [];
    }

    //if the range and the current boundary are not intersecting, then dont look further
    if (!range.intersects(this.boundary)) {
      return found;
    }

    this.boundary.color = "red";
    //otherwise, grab all points from the points in the current boundary, which are intersecting with the range
    for (let p of this.points) {
      if (range.contains(p.pos)) {
        found.push(p);
      }
    }

    //if the current tree is divided, also look into the subboundaries
    if (this.divided) {
      this.topLeft.query(range, found);
      this.bottomLeft.query(range, found);
      this.bottomRight.query(range, found);
      this.topRight.query(range, found);
    }

    return found;
  }

  show(c) {
    //draw the rect
    c.beginPath(); //beginning a new path
    c.rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    c.strokeStyle = this.boundary.color;
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
    this.color = "black";
  }

  contains(point) {
    //check if the point is contained within the boundaries
    return (
      point.x >= this.x &&
      point.x <= this.x + this.w &&
      point.y >= this.y &&
      point.y <= this.y + this.h
    );
  }

  intersects(range) {
    let intersection = !(
      //prettier-ignore
      //if range origin is right of the current boundary
      range.x > this.x + this.w ||
      
      //if range origin is below the current boundary
      range.y > this.y + this.h ||

      //if range + width < current boundary
      range.x + range.w < this.x ||

      //if range + height < current boundary
      range.y + range.h < this.y
    );

    return intersection;
  }
}
