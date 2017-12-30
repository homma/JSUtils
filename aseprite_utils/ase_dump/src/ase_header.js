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
