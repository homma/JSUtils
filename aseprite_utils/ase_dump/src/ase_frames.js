/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const AseFrames = function(ase) {

  this.ase = ase;

  const start = myapp.config.header_size;
  const end = start + ase.buf.length;
  this.buf = ase.buf.slice(start, end);

  this.frames = this.readFrames();

}

myapp.AseFrames = AseFrames;

AseFrames.prototype.dump = function() {

  myapp.nebug("AseFrames dump.");

  console.log("## Frames ##");

  this.frames.forEach(v => v.dump());

}

AseFrames.prototype.readFrames = function() {

  const n = this.ase.header.header.frames;
  let start = 0;

  myapp.nebug(n);

  const frames = [];

  for(let i = 0; i < n; i++) {

    let f = new myapp.AseFrame(this, start);
    start += f.bytes;

    frames.push(f);

  }

  myapp.nebug(frames);

  return frames;

}

} // namespace boundary
