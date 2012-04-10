
// @author: Daisuke Homma

// ToDo:
//// check if ceil / floor is necessary
//// add margin if necessary

new function() { // block

var self;

if(typeof exports !== 'undefined') {
  self = exports;
} else {
  self = window.HitTest = {};
}

self.debug = false;

self.debugPrint = function(s) {
  if(self.debug) console.log(s);
}

self.Point = function(x, y) {
  this.x = x;
  this.y = y;
}

self.Quad = function(a, b, c, d) {
  return new Array(a, b, c, d);
}

self.Triangle = function(a, b, c) {
  return new Array(a, b, c);
}

self.diagonalOfPointZero = function(quad) {
  // calculates diagonal point of quad[0].

  var a = quad[0];
  var b = quad[1];
  var c = quad[2];
  var d = quad[3];

  var ab = (a.y == b.y) ? 0 : (a.x - b.x) / (a.y - b.y);
  var ac = (a.y == c.y) ? 0 : (a.x - c.x) / (a.y - c.y);
  var ad = (a.y == d.y) ? 0 : (a.x - d.x) / (a.y - d.y);

  if(ab >= ac) {
    if(ad >= ab) return 1;  // ad >= ab >= ac
    if(ac >= ad) return 2;  // ab >= ac >= ad
    return 3;               // ab >= ad >= ac
  } else {  // ac > ab
    if(ad >= ac) return 2;  // ad >= ac >  ab
    if(ab >= ad) return 1;  // ac >  ab >= ad
    return 3;               // ac >= ad >= ab
  }

}

self.isInBound = function(points, x, y) {
  // determines if the point (x, y) is inside the rectangle.

  xIsMax = xIsMin = yIsMax = yIsMin = true;

  // self.debugPrint("x: " + x + ", y: " + y);

  for(var i in points) {
    // self.debugPrint("points[" + i + "].x: " + points[i].x);
    // self.debugPrint("points[" + i + "].y: " + points[i].y);
    if(x <= points[i].x) xIsMax = false;
    if(x >= points[i].x) xIsMin = false;
    if(y <= points[i].y) yIsMax = false;
    if(y >= points[i].y) yIsMin = false;
  }

  if(xIsMax || xIsMin || yIsMax || yIsMin) {
    // self.debugPrint("isInBound: false");
    // self.debugPrint("xIsMax: " + xIsMax);
    // self.debugPrint("xIsMin: " + xIsMin);
    // self.debugPrint("yIsMax: " + yIsMax);
    // self.debugPrint("yIsMin: " + yIsMin);
    return false;
  }

  return true;
}

self.yIsInRange = function(p0, p1, y) {
  // determines if y is in between p0.y and p1.y

  if( (p0.y > y) && (p1.y > y) ) {
    // self.debugPrint("yIsInRange: false");
    return false;
  }
  if( (p0.y < y) && (p1.y < y) ) {
    // self.debugPrint("yIsInRange: false");
    return false;
  }
  return true;

}

self.xAtYOfLine = function(p0, p1, y) {
  // calculates x at y in line p0-p1.

  // if( (p0.y == p1.y) && (p0.y != y) ) raise exception...

  if( (p0.y == p1.y) && (p0.y == y) ) return p0.x;  // enough?

/*
 * y = ax + b
 * b = y - ax
 * x = (y - b) / a
 */

  var a = (p0.x - p1.x) / (p0.y - p1.y);
  var b = p0.y - p0.x * a;
  var x = (y - b) / a;

  return x;  // Math.ceil or floor?
}

self.isInsideOfTriangle = function(tri, x, y) {

  // Min/Max test
  if( !self.isInBound(tri, x, y) ) {
    // self.debugPrint("isInsideOfTriangle: false");
    return false;
  }

  var a = tri[0];
  var b = tri[1];
  var c = tri[2];

  if( self.yIsInRange(a, b, y) ) { // abx

    if( self.yIsInRange(b, c, y) ) { // bcx
      var abx = self.xAtYOfLine(a, b, y);
      var bcx = self.xAtYOfLine(b, c, y);

      if( (Math.max(abx, bcx) >= x) && (x >= Math.min(abx, bcx)) )
        return true;

      // self.debugPrint("isInsideOfTriangle: false");
      return false;
    }

    if( self.yIsInRange(c, a, y) ) { // cax
      var abx = self.xAtYOfLine(a, b, y);
      var cax = self.xAtYOfLine(c, a, y);

      if( (Math.max(abx, cax) >= x) && (x >= Math.min(abx, cax)) )
        return true;

      // self.debugPrint("isInsideOfTriangle: false");
      return false;
    }

  } else {
    var bcx = self.xAtYOfLine(b, c, y);
    var cax = self.xAtYOfLine(c, a, y);

    if( (Math.max(bcx, cax) >= x) && (x >= Math.min(bcx, cax)) )
      return true;

    // self.debugPrint("isInsideOfTriangle: false");
    return false;
  }

}

self.isInsideOfQuad = function(quad, x, y) {
  // public interface

  // Min/Max test
  if(! self.isInBound(quad, x, y) ) {
    // self.debugPrint("isInsideOfQuad: false");
    return false;
  }

  // Triangle test
  var diagonal = self.diagonalOfPointZero(quad);  // 1 or 2 or 3

  switch(diagonal) {
    case 1:
      var tri = new self.Triangle(quad[0], quad[1], quad[2]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      tri = new self.Triangle(quad[0], quad[1], quad[3]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      break;

    case 2:
      var tri = new self.Triangle(quad[0], quad[2], quad[1]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      tri = new self.Triangle(quad[0], quad[2], quad[3]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      break;

    case 3:
      var tri = new self.Triangle(quad[0], quad[3], quad[1]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      tri = new self.Triangle(quad[0], quad[3], quad[2]);
      if(self.isInsideOfTriangle(tri, x, y )) return true;

      break;
  }

  return false;

}

self.usage = function() {

  var a = new self.Point(150,100);
  var b = new self.Point(200,150);
  var c = new self.Point(150,200);
  var d = new self.Point(100,150);

  var quad = new self.Quad(a, b, c, d);

  // 1st test
  var x = 150;
  var y = 150;

  if( self.isInsideOfQuad(quad, x, y) ) {
    console.log("hit!");
  } else {
    console.log("miss.");
  }

  // 2nd test
  x = 176;
  y = 175;

  if( self.isInsideOfQuad(quad, x, y) ) {
    console.log("hit!");
  } else {
    console.log("miss.");
  }

}

self.benchmark = function() {
  // test function

  // self.debugPrint("test start...");

  var a = new self.Point(100,100);
  var b = new self.Point(200,100);
  var c = new self.Point(200,200);
  var d = new self.Point(100,200);

  var quad = new self.Quad(a, b, c, d);

  var pre = (new Date).getMilliseconds();
  for(var i = 0; i < 300; i++) {
    for(var j = 0; j < 300; j++) {
      self.isInsideOfQuad(quad, i, j);
      // console.log(i + "@" + j + ": " + self.isInsideOfQuad(quad, i, j));
    }
  }
  var post = (new Date).getMilliseconds();

  console.log("90000: " + (post - pre));

  pre = (new Date).getMilliseconds();
  for(var i = 0; i < 300; i = i + 10) {
    for(var j = 0; j < 300; j = j + 10) {
      self.isInsideOfQuad(quad, i, j);
      // console.log(i + "@" + j + ": " + self.isInsideOfQuad(quad, i, j));
    }
  }
  post = (new Date).getMilliseconds();

  console.log("900: " + (post - pre));

  pre = (new Date).getMilliseconds();
  for(var i = 1000; i < 1300; i = i + 10) {
    for(var j = 1000; j < 1300; j = j + 10) {
      self.isInsideOfQuad(quad, i, j);
      // console.log(i + "@" + j + ": " + self.isInsideOfQuad(quad, i, j));
    }
  }
  post = (new Date).getMilliseconds();

  console.log("0 @ 900: " + (post - pre));

  pre = (new Date).getMilliseconds();
  for(var i = 0; i < 300; i = i + 10) {
    for(var j = 0; j < 300; j = j + 10) {
      self.isInsideOfQuad(quad, 0, 0);
      // console.log(i + "@" + j + ": " + self.isInsideOfQuad(quad, i, j));
    }
  }
  post = (new Date).getMilliseconds();

  console.log("0 @ 900: " + (post - pre));

}

} // block

HitTest.usage();

