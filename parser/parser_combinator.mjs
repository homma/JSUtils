/*
 *
 * A parser combinator library which covers PEG functionarity.
 *
 */

/*** String Reader ***/

export //
const StringReader = function(text, origin) {
  this.string = text;
  this.origin = origin;
};

StringReader.prototype.read = function(n) {
  return this.string.substr(this.origin, n);
};

StringReader.prototype.advance = function(n) {
  this.origin += n;
};

StringReader.prototype.set_origin = function(n) {
  this.origin = n;
};

/*** Parse Result ***/

const ParseSuccess = function(data) {
  this.success = true;
  this.data = data;
};

ParseSuccess.prototype.print = function() {
  console.log(`[Parse Succeeded] accepted: ${this.data}`);
};

const ParseFailure = function(expected, reader) {
  this.success = false;
  this.expected = expected;
  this.reader = reader;
};

ParseFailure.prototype.print = function() {
  const received = this.reader.string.substr(this.reader.origin, 20);
  console.log(
    `[Parse Failed]    expected: ${this.expected} received: ${received}`
  );
};

/*** parsers ***/

export //
const string = str => input => {
  const len = str.length;
  const target = input.read(len);

  if (target == str) {
    input.advance(len);

    return new ParseSuccess(str);
  }

  return new ParseFailure(str, input);
};

/*** combinators ***/
