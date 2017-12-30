/*
 * @author Daisuke Homma
 */

const myapp = {}; // global object

{ // namespace boundary

myapp.config = {};
const config = myapp.config;

config.debug = false;
config.header_size = 128;

} // namespace boundary
/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const debug = function(str) {
    console.log(str);
}

// no debug
const nebug = function() {}

myapp.debug = debug;
myapp.nebug = nebug;

} // namespace boundary
/*
 * @author Daisuke Homma
 */

{ // namespace boundary

//// Ase Buffer Utility

const AseBuffer = function(buf) {

  this.buf = buf;
  this.length = buf.length;

}

myapp.AseBuffer = AseBuffer;

AseBuffer.prototype.slice = function(start, end) {

  const buf = this.buf.slice(start, end);
  return new myapp.AseBuffer(buf);

}

AseBuffer.prototype.toString = function() {

  const str = this.buf.map(v => v.toString(16)).join(' ').toUpperCase();
  return str;

}

AseBuffer.prototype.readByte = function(start) {

  return this.buf[start];

}

// n : bytes, 0 < n < 5
AseBuffer.prototype.readBytes = function(start, n) {

  if(n < 1 || 4 < n) {
    console.trace("AseBuffer.prototype.readBytes");
    process.exit(1);
  }

  const slice = this.buf.slice(start, start + n);
  const view = new Uint32Array(slice.length);

  slice.forEach( (val, idx, arr) => view[idx] = arr[idx] );

  myapp.nebug(slice);
  myapp.nebug(view);

  const data = view.map((val, idx) => val << (idx * 8)).
               reduce((acc, val) => acc + val);

  myapp.nebug(data);

  return data

}

AseBuffer.prototype.readWord = function(start) {

  return this.readBytes(start, 2);

}

AseBuffer.prototype.toInt8Array = function(buf) {

  const arrBuf = new ArrayBuffer(buf.length);
  const view = new Int8Array(arrBuf);

  slice.forEach( (val, idx, arr) => view[idx] = arr[idx] );

  return view;

}

AseBuffer.prototype.readShort = function(start) {

  const len = 2;

  const slice = this.buf.slice(start, start + len);
  const view = this.toInt8Array(slice);

  const data = view.map((curr, idx) => curr << (idx * 8)).
                    reduce((acc, curr) => acc + curr);

  return data
}

AseBuffer.prototype.readDWord = function(start) {

  return this.readBytes(start, 4);

}

AseBuffer.prototype.readFixed = function(start) {

  const integer = this.readBytes(start + 2, 2);
  const fraction = this.readBytes(start, 2);

  const ret = (integer).toString() + "." + (fraction).toString();

  return ret;
}

AseBuffer.prototype.readByteArray = function(start, n) {

  return this.buf.slice(start, start + n);

}

AseBuffer.prototype.readString = function(start) {

  const len = this.readWord(start);
  const str = this.readByteArray(start + 2, len).toString('utf8');
  const size = len + 2;

  return { length: len, string: str };

}


AseBuffer.prototype.readRGBA = function(start) {

  const n = 4;
  const rgba = this.buf.slice(start, start + n);

  const color = { red: rgba[0], green: rgba[1], blue: rgba[2], alpha: rgba[3] }

  return color;

}

AseBuffer.prototype.readGrayScale = function(start) {

  const n = 2;
  const gs = this.buf.slice(start, start + n);

  const color = { value: gs[0], alpha: gs[1] };

  return color;
}

AseBuffer.prototype.readIndexed = function(start) {

  return this.buf[start];

}

} // namespace boundary

/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const AsePaletteColor = function(palette, start) {

  this.palette = palette;
  this.buf = palette.buf;

  this.color = {};
  this.color.size = 5;
  this.color.has_name = this.readHasName(start + 0);
  this.color.red = this.buf.readByte(start + 2);
  this.color.green = this.buf.readByte(start + 3);
  this.color.blue = this.buf.readByte(start + 4);
  this.color.alpha = this.buf.readByte(start + 5);

  if(this.color.has_name == 1) {

    myapp.debug(this.color.has_name);

    let str = this.buf.readString(start + 6);

    myapp.debug(str);

    this.color.name = str.string;
    this.color.size += str.size;

  }

  myapp.nebug(this.color.size);

}

myapp.AsePaletteColor = AsePaletteColor;

AsePaletteColor.prototype.dump = function() {

  myapp.nebug("AsePaletteColor dump.");

  // console.log("##### Palette Color #####");

  const toHex = color => {

    return (0 + color.toString(16).toUpperCase()).slice(-2);

  }

  const r = toHex(this.color.red);
  const g = toHex(this.color.green);
  const b = toHex(this.color.blue);

  console.log(`# ${r} ${g} ${b}`);

}

AsePaletteColor.prototype.readHasName = function(start) {

  return this.buf.readWord(start);

}

} // namespace boundary
/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const AsePalette = function(chunk) {

  this.chunk = chunk;

  const start = 6;
  this.buf = chunk.buf.slice(start, chunk.buf.length);

  this.palette = {};

  this.palette.size = this.readSize();
  this.palette.first_color_index = this.readFirstColorIndex();
  this.palette.last_color_index = this.readLastColorIndex();
  this.palette.colors = this.readColors();

}

myapp.AsePalette = AsePalette;

AsePalette.prototype.dump = function() {

  myapp.nebug("AsePalette dump.");

  console.log("#### Palette ####");

  const keys = Object.keys(this.palette).filter(v => v != "colors");
  keys.forEach(v => console.log(`${v} : ${this.palette[v]}`) )

  console.log("#### Palette Colors ####");

  this.palette.colors.forEach(v => v.dump());

}

AsePalette.prototype.readSize = function() {

  return this.buf.readDWord(0);

}

AsePalette.prototype.readFirstColorIndex = function() {

  return this.buf.readDWord(4);

}

AsePalette.prototype.readLastColorIndex = function() {

  return this.buf.readDWord(8);

}

AsePalette.prototype.readColors = function() {

  let start = 16;
  const n = this.palette.size;

  const colors = [];

  for(let i = 0; i < n; i++) {

    let c = new myapp.AsePaletteColor(this, start);

    myapp.nebug(c);

    start += c.color.size;

    colors.push(c);

  }

  return colors;

}

} // namespace boundary
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
/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const AseHeader = function(ase) {

  this.ase = ase;

  const start = 0;
  const end = myapp.config.header_size - 1;
  this.buf = ase.buf.slice(start, end);

  this.header = {};

  this.header.file_size = this.readFileSize();
  this.header.magic_number = this.readMagicNumber();
  this.header.frames = this.readFrames();
  this.header.width = this.readWidth();
  this.header.height = this.readHeight();
  this.header.color_depth = this.readColorDepth();
  this.header.flags = this.readFlags();
  this.header.speed = this.readSpeed();
  this.header.palette_entry = this.readPaletteEntry();
  this.header.n_colors = this.readNumberOfColors();
  this.header.pixel_width = this.readPixelWidth();
  this.header.pixel_height = this.readPixelHeight();

}

myapp.AseHeader = AseHeader;

AseHeader.prototype.dump = function() {

  console.log("## Header ##");

  const keys = Object.keys(this.header);

  keys.forEach(v => console.log(`${v} : ${this.header[v]}`) )

}

AseHeader.prototype.readFileSize = function() {

  return this.buf.readDWord(0);

}

AseHeader.prototype.readMagicNumber = function() {

  b0 = this.buf.readByte(5);
  b1 = this.buf.readByte(4);

  return (b0.toString(16) + b1.toString(16)).toUpperCase();

}

AseHeader.prototype.readFrames = function() {

  return this.buf.readWord(6);

}

AseHeader.prototype.readWidth = function() {

  return this.buf.readWord(8);

}

AseHeader.prototype.readHeight = function() {

  return this.buf.readWord(10);

}

AseHeader.prototype.readColorDepth = function() {

  return this.buf.readWord(12);

}

AseHeader.prototype.readFlags = function() {

  return this.buf.readDWord(14);

}

AseHeader.prototype.readSpeed = function() {

  return this.buf.readWord(18);

}

AseHeader.prototype.readPaletteEntry = function() {

  return this.buf.readByte(28);

}

AseHeader.prototype.readNumberOfColors = function() {

  return this.buf.readWord(32);

}

AseHeader.prototype.readPixelWidth = function() {

  return this.buf.readByte(34);

}

AseHeader.prototype.readPixelHeight = function() {

  return this.buf.readByte(35);

}

} // namespace boundary
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

/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const check_args = () => {

  n_args = process.argv.length;
  if(n_args != 3) {

    console.log("Usage: node myapp.js <FILE>");
    process.exit();

  }
}

const get_file_path = () => {

  return process.argv[2];

}

const main = () => {

  check_args();
  const buf = get_file_path();

  const ase = new myapp.Ase(buf);
  ase.dump();

}

main();

} // namespace boundary
