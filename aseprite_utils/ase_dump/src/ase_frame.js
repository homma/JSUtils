/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const AseFrame = function(frames, start) {

  this.frames = frames;
  this.frame = {};

  this.frame.bytes = this.readBytes(start);

  const end = start + this.frame.bytes;
  this.buf = frames.buf.slice(start, end);

  this.frame.magic_number = this.readMagicNumber();
  this.frame.nchunks = this.readNumberOfChunks();
  this.frame.frame_duration = this.readFrameDuration();

  this.chunks = this.readChunks();

}

myapp.AseFrame = AseFrame;

AseFrame.prototype.dump = function() {

  myapp.nebug("AseFrame dump.");

  console.log("### Frame ###");

  const keys = Object.keys(this.frame);

  keys.forEach(v => console.log(`${v} : ${this.frame[v]}`));
  this.chunks.forEach(v => v.dump());

}

AseFrame.prototype.readBytes = function(start) {

  myapp.nebug(start);
  myapp.nebug(this.frames.buf);
  myapp.nebug(this.frames.buf.buf.length);

  return this.frames.buf.readDWord(start);

}

AseFrame.prototype.readMagicNumber = function() {

  myapp.nebug(this.buf);

  b0 = this.buf.readByte(5);
  b1 = this.buf.readByte(4);

  return (b0.toString(16) + b1.toString(16)).toUpperCase();

}

AseFrame.prototype.readNumberOfChunks = function() {

  myapp.nebug("n chunks");
  myapp.nebug(this.buf.readWord(6));

  return this.buf.readWord(6);

}

AseFrame.prototype.readFrameDuration = function() {

  return this.buf.readWord(8);

}

AseFrame.prototype.readChunks = function() {

  let start = 16;
  const n = this.frame.nchunks;

  const chunks = [];

  for(let i = 0; i < n; i++) {

    let c = new myapp.AseChunk(this, start);
    start += c.chunk.size;

    myapp.nebug("start:");
    myapp.nebug(start);

    chunks.push(c);

  }

  return chunks;

}

} // namespace boundary
