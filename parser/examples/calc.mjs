import { StringReader } from "../parser_combinator.mjs";
import parser from "./arith.mjs";

const calc = input => {
  const reader = new StringReader(input);
  const result = parser(reader);

  if (!result.success) {
    result.print();
    return result;
  }

  const transformed = transform(result.shaved());
  const output = expr(transformed);

  return { success: true, result: output };
};

// helper functions
const isArray = v => Array.isArray(v);
const isEmpty = v => isArray(v) && v.length == 0;
const isString = v => typeof v === "string";
const isNumber = v => typeof v === "number";

const op = ["+", "-", "*", "/"];
const isOp = v => op.includes(v);

// transform parsed data
const transform = (data, val) => {
  let ret = null;

  const hd = data.shift();
  const tl = data;

  // hd is an operator
  if (isOp(hd)) {
    // data is a pair -- ex: ["+", "1"]
    const pair = tl.length == 1 && isString(tl[0]);

    if (pair) {
      ret = [hd, val, parseInt(tl[0])];
      return ret;
    }

    // tl is a list -- ex: ["+", [["/", "4"], ["*", "6"]]]
    ret = [hd, val, transform(tl, "UNREACHABLE")];
    return ret;
  }

  // remove parenthesis
  if (hd == "(") {
    return transform(tl.slice(0, tl.length - 1));
  }

  // hd is a value
  if (isString(hd)) {
    return transform(tl, parseInt(hd));
  }

  // isArray(hd)

  if (isEmpty(tl)) {
    return [transform(hd, val)];
  }

  return [transform(tl, transform(hd, val))];
};

// do calculate
const expr = data => {
  // data is a value
  if (isNumber(data)) {
    return data;
  }

  const hd = data.shift();
  const tl = data;

  // ex: [[["+", "1", "2"]]]
  if (isArray(hd)) {
    return expr(hd);
  }

  const v1 = tl[0];
  const v2 = tl[1];

  // calculator
  if (hd == "+") {
    return expr(v1) + expr(v2);
  } else if (hd == "-") {
    return expr(v1) - expr(v2);
  } else if (hd == "*") {
    return expr(v1) * expr(v2);
  } else if (hd == "/") {
    return expr(v1) / expr(v2);
  }
};

export default calc;
