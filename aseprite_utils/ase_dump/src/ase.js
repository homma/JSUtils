/*
 * @author Daisuke Homma
 */

{ // namespace boundary

//// Ase Data

const Ase = function(path) {

  this.buf = new myapp.AseBuffer(this.readData(path));

  this.header = new myapp.AseHeader(this);
  this.frames = new myapp.AseFrames(this);

}

myapp.Ase = Ase;

Ase.prototype.dump = function() {

  this.header.dump();
  this.frames.dump();

}

Ase.prototype.readData = path => {

  const fs = require('fs');
  const buf = fs.readFileSync(path);
  return buf;

}

} // namespace boundary

