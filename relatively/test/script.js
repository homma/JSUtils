
var canvas;
var ctx;
var width, height;
var x0, y0;  // central, head
var x1 = 240;  // tail
var y1 = 200;  // tail
var x2 = 300;  // target
var y2 = 100;  // target

function setCanvas() {

  canvas = document.getElementById('cnvs');
  ctx = canvas.getContext('2d');

  canvas.onmousedown = this.mouseDown;
  canvas.onmousemove = this.mouseMove;
  canvas.onmouseup   = this.mouseUp;
  canvas.onselectstart = function() { return false; };

}

function setCentral() {

  width  = canvas.width;
  height = canvas.height;

  x0 = width / 2;
  y0 = height / 2;

}

function clear() {

  ctx.save();

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function draw() {

  this.setText();
  this.clear();

  ctx.save();

  ctx.strokeStyle = 'black';

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x0, y0);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(x0, y0);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.arc(x0, y0, 4, 0, 2 * Math.PI, true);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.fillStyle = 'gray';
  ctx.lineWidth = 1;
  ctx.arc(x1, y1, 4, 0, 2 * Math.PI, true);
  ctx.fill();

  // Target
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.lineWidth = 1;
  ctx.arc(x2, y2, 4, 0, 2 * Math.PI, true);
  ctx.fill();

  ctx.restore();

}

function getSide() {

  if( Relatively.isRight(x0, y0, x1, y1, x2, y2) ) {
    return 'right';
  }

  if( Relatively.isLeft(x0, y0, x1, y1, x2, y2) ) {
    return 'left';
  }

  return 'center';

}

function getFace() {

  if( Relatively.isFront(x0, y0, x2, y2, x1, y1) ) {
    return 'front';
  }

  if( Relatively.isBack(x0, y0, x2, y2, x1, y1) ) {
    return 'back';
  }

  return 'side';

}

function setText() {

  var head = document.getElementById('head');
  head.innerText = "(" + x0 + ", " + y0 + ")";

  var tail = document.getElementById('tail');
  tail.innerText = "(" + x1 + ", " + y1 + ")";

  var target = document.getElementById('target');
  target.innerText = "(" + x2 + ", " + y2 + ")";

  var side = document.getElementById('side');
  side.innerText = self.getSide();

  var face = document.getElementById('face');
  face.innerText = self.getFace();

}

var dragTarget = false;
var dragTail = false;
var self = this;

function mouseDown(ev) {

  var x = ev.clientX - canvas.offsetLeft;
  var y = ev.clientY - canvas.offsetTop;

  var hit = false;
  hit = self.hitTarget(x, y);
  if(hit) {
    self.dragTarget = true;
    return;
  }

  hit = self.hitTail(x, y);
  if(hit) {
    self.dragTail = true;
  }

}

function hitTarget(x, y) {

  var hit = false;

  ctx.save();

  ctx.beginPath();

  ctx.arc(x2, y2, 4, 0, 2 * Math.PI, true);

  hit = ctx.isPointInPath(x, y);

  ctx.restore();

  return hit;

}

function hitTail(x, y) {

  var hit = false;

  ctx.save();

  ctx.beginPath();

  ctx.arc(x1, y1, 4, 0, 2 * Math.PI, false);

  hit = ctx.isPointInPath(x, y);

  ctx.restore();

  return hit;

}

function mouseMove(ev) {

  if(!self.dragTarget && !self.dragTail) { return; }

  if(dragTail) {
    x1 = ev.clientX - canvas.offsetLeft;
    y1 = ev.clientY - canvas.offsetTop;
  }

  if(dragTarget) {
    x2 = ev.clientX - canvas.offsetLeft;
    y2 = ev.clientY - canvas.offsetTop;
  }
  
  self.draw();

}

function mouseUp() {

  self.dragTarget  = false;
  self.dragTail = false;

}

function main() {

  this.setCanvas();
  this.setCentral();

  this.draw();

}

window.onload = main;

