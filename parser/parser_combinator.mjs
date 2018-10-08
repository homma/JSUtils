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

ParseSuccess.prototype.shaved = function() {
  return prettify(this.data);
};

ParseSuccess.prototype.print = function() {
  console.log(
    `[Parse Succeeded] accepted: ${JSON.stringify(prettify(this.data))}`
  );
};

const ParseFailure = function(expected, at, reader) {
  this.success = false;
  this.expected = expected;
  this.at = at;
  this.reader = reader;
};

ParseFailure.prototype.print = function() {
  const received = this.reader.string.substr(this.at, 20);
  console.log(
    `[Parse Failed]    expected: ${JSON.stringify(this.expected)} at: ${
      this.at
    } received: ${received}`
  );

  // const len = this.reader.string.length;
  // const parsed = this.reader.origin;
  // console.log(`parsed ${parsed} characters from ${len} characters.`);
};

const prettify = data => {
  const pretty = el => {
    const isEmpty = arr => Array.isArray(arr) && arr.length == 0;
    const isString = el => typeof el == "string";
    const hasSingleChild = arr => Array.isArray(arr) && arr.length == 1;

    let result = [];

    for (let e of el) {
      // lift single element
      // ["1"] => "1"
      // [["foo", "bar"]] => ["foo", "bar"]
      if (hasSingleChild(e)) {
        e = e[0];
      }

      // remove empty
      // [[], "1"] => ["1"]
      if (isEmpty(e)) {
        continue;
      } else if (isString(e)) {
        result.push(e);
      } else {
        result.push(pretty(e));
      }
    }

    // lift single element
    if (hasSingleChild(result)) {
      result = result[0];
    }

    return result;
  };

  return pretty(data);
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

  return new ParseFailure(str, input.origin, input);
};

export //
const regexp = pattern => input => {
  const res = input.regexp_read(pattern);

  if (res) {
    input.advance(res.length);

    return new ParseSuccess(res);
  }

  return new ParseFailure(pattern.source, input.origin, input);
};

export //
const any1 = () => input => {
  const res = input.read(1);

  if (res.length == 1) {
    input.advance(1);

    return new ParseSuccess(res);
  }

  return new ParseFailure("any char", input.origin, input);
};

export //
const empty = () => input => {
  return new ParseSuccess([]);
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
      return res;
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

  const error = expected.reduce((acc, val) => `or(${acc}, ${val})`);
  return new ParseFailure(error, input.origin, input);
};

/*
 * REP0 PARSER
 * parsing e*
 */

export //
const rep0 = parser => input => {
  let result = [];

  while (true) {
    const res = parser(input);
    if (!res.success) {
      break;
    }
    result.push(res.data);
  }

  return new ParseSuccess(result);
};

/*
 * REP1 PARSER
 * parsing e+ (= seq(e, rep(e)))
 */

export //
const rep1 = parser => input => {
  const p = modify(seq(parser, rep0(parser)), data => {
    let fst = [data[0]];
    if (fst == null) {
      fst = [];
    }
    return fst.concat(data[1]);
  });

  const result = p(input);
  return result;
};

/*
 * OPT PARSER
 * parsing e?
 */

export //
const opt = parser => input => {
  const result = parser(input);

  let data = [];

  if (result.success) {
    data = result.data;
  }

  return new ParseSuccess(data);
};

/*
 * ANDP PARSER
 * parsing &e (=notp(notp(e)))
 */

export //
const andp = parser => input => {
  const origin = input.origin;

  const result = parser(input);

  if (result.success) {
    input.set_origin(origin);

    return new ParseSuccess([]);
  }

  // ParseFailure
  return result;
};

/*
 * NOTP PARSER
 * parsing !e
 */

export //
const notp = parser => input => {
  const origin = input.origin;

  const result = parser(input);

  if (result.success) {
    input.set_origin(origin);

    return new ParseFailure(
      "notp " + JSON.stringify(result.data),
      input.origin,
      input
    );
  }

  return new ParseSuccess([]);
};

/*** utility functions ***/

/*
 * LAZY 
 * for recursive parser definitions
 */

export //
const lazy = callback => input => {
  return callback()(input);
};

/*
 * MODIFY
 * for mutate the resulting data
 */

export //
const modify = (parser, fun) => input => {
  const result = parser(input);

  if (result.success) {
    // take care if result.data is null.
    const data = fun(result.data);
    return new ParseSuccess(data);
  }

  return result;
};

/*
 * LEFTREC
 * for mutating right recursive data to left recursive
 */

// helper function
const isEmpty = v => Array.isArray(v) && v.length == 0;

export //
const leftrec = v => {
  const hd = v[0];
  const tl = v[1];

  // ["1", []] => ["1"]
  if (isEmpty(tl)) {
    return [hd];
  }

  // [["1"], [["*", "2"],[...]]] => [["*", "1", "2"],[...]]
  const left = v[0];
  const op = v[1][0][0];
  const right = v[1][0][1];
  const rest = v[1].slice(1);
  return leftrec([[op, left, right], rest]);
};
