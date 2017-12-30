/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const chunkTypes = {

  0x0004: "old_palette1",
  0x0011: "old_palette2",
  0x2004: "layer",
  0x2005: "cel",
  0x2006: "cel_extra",
  0x2016: "mask",
  0x2017: "path",
  0x2018: "frame_tags",
  0x2019: "palette",
  0x2020: "user_data",
  0x2022: "slice"

}

const AseChunk = function(frame, start) {

  this.frame = frame;
  this.chunk = {};

  this.chunk.size = this.readSize(start);

  const end = start + this.chunk.size;
  this.buf = frame.buf.slice(start, end);

  myapp.nebug(this.chunk.size);
  myapp.nebug(this.buf);

  this.chunk.type = this.readType();
  this.chunk.data = this.readData();

}

myapp.AseChunk = AseChunk;

AseChunk.prototype.dump = function() {

  myapp.nebug("AseChunk dump.");

  console.log("### Chunk ###");

  const keys = Object.keys(this.chunk);

  keys.forEach(v => console.log(`${v} : ${this.chunk[v]}`) )

}

AseChunk.prototype.readSize = function(start) {

  myapp.nebug("chunk: start: ");
  myapp.nebug(start);

  return this.frame.buf.readDWord(start);

}

AseChunk.prototype.readType = function() {

  const type = this.buf.readWord(4);
  return chunkTypes[type];

}

AseChunk.prototype.readData = function() {

  return this.buf.slice(6, this.buf.length).toString();

}

} // namespace boundary
