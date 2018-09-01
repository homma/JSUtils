/*
 *
 * A parser combinator library which covers PEG functionarity.
 *
 */

/*** String Reader ***/

export //
const StringReader = function(text, origin = 0) {
  this.string = text;
  this.origin = origin;
};

StringReader.prototype.read = function(n) {
  return this.string.substr(this.origin, n);
};

StringReader.prototype.regexp_read = function(regexp) {
  let re = regexp;

  if (!re.sticky) {
    re = new RegExp(re.source, re.flags + "y");
  }

  re.lastIndex = this.origin;

  const res = re.exec(this.string);

  if (res) {
    return res[0];
  }

  return null;
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
  console.log(`[Parse Succeeded] accepted: ${JSON.stringify(this.data)}`);
};

const ParseFailure = function(expected, reader) {
  this.success = false;
  this.expected = expected;
  this.reader = reader;
};

ParseFailure.prototype.print = function() {
  const received = this.reader.string.substr(this.reader.origin, 20);
  console.log(
    `[Parse Failed]    expected: ${JSON.stringify(
      this.expected
    )} received: ${received}`
  );
};

/*** parsers ***/

export //
const string = str => input => {
  const len = str.length;
  const res = input.read(len);

  if (res == str) {
    input.advance(len);

    return new ParseSuccess(str);
  }

  return new ParseFailure(str, input);
};

export //
const regexp = pattern => input => {
  const res = input.regexp_read(pattern);

  if (res) {
    input.advance(res.length);

    return new ParseSuccess(res);
  }

  return new ParseFailure(pattern, input);
};

export //
const any1 = () => input => {
  const res = input.read(1);

  if (res.length == 1) {
    input.advance(1);

    return new ParseSuccess(res);
  }

  return new ParseFailure("any char", input);
};

/*** combinators ***/

/*
 * SEQ PARSER
 * parsing e1 e2 e3 ...
 */
export //
const seq = (...parsers) => input => {
  const origin = input.origin;
  const data = [];

  for (let parser of parsers) {
    const res = parser(input);

    if (!res.success) {
      input.set_origin(origin);
      data.push(res.expected);

      return new ParseFailure(data, input);
    }

    data.push(res.data);
  }

  return new ParseSuccess(data);
};

/*
 * OR PARSER
 * parsing e1 / e2 / e3 / ...
 */
export //
const or = (...parsers) => input => {
  let expected = [];

  for (let parser of parsers) {
    const res = parser(input);
    if (res.success) {
      return res;
    }

    expected.push(res.expected);
  }

  return new ParseFailure(expected, input);
};
