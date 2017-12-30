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
