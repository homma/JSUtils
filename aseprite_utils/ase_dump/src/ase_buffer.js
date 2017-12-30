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

  return { length: len, string: str, size: size };

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

