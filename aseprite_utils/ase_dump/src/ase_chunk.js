/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const chunkTypes = {

  0x0004: "old_palette_1",
  0x0011: "old_palette_2",
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

  switch(this.chunk.type) {

    case "palette":
      this.dumpPalette();
      break;

    default:
      this.dumpGeneric();

  }

}

AseChunk.prototype.dumpGeneric = function() {

  const keys = Object.keys(this.chunk).filter(v => v != "data");
  keys.forEach(v => console.log(`${v} : ${this.chunk[v]}`) )

  const toHex = data => {

    return (0 + data.toString(16).toUpperCase()).slice(-2);

  }

  let data = this.chunk.data.reduce((acc, v) => `${acc} ${toHex(v)}`, "");
  console.log(`data :${data}`);

}

AseChunk.prototype.dumpPalette = function() {

  const keys = Object.keys(this.chunk).filter(v => v != "data");
  keys.forEach(v => console.log(`${v} : ${this.chunk[v]}`) )

  const palette = new myapp.AsePalette(this);
  palette.dump();

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

  return this.buf.slice(6, this.buf.length).buf;

}

} // namespace boundary
