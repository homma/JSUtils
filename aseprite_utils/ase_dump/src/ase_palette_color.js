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
