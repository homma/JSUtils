/*
 * Non-CFG Grammar
 */

import {
  StringReader,
  lazy,
  seq,
  opt,
  string,
  andp,
  rep1,
  notp,
  any1
} from "../parser_combinator.mjs";
import assert from "./assert.mjs";

const make_parser = () => {
  const A = lazy(() => seq(string("a"), opt(A), string("b")));
  const B = lazy(() => seq(string("b"), opt(B), string("c")));

  const S = seq(andp(seq(A), string("c")), rep1(string("a")), B, notp(any1()));

  return S;
};

const parse = str => {
  const input = new StringReader(str);

  const parser = make_parser();

  const result = parser(input);
  result.print();

  return result;
};

const run_parse = () => {
  console.log();

  let result = parse("abc");
  assert(result.success);
  console.log();

  result = parse("aaabbbccc");
  assert(result.success);
  console.log();

  result = parse("aaabbbcc");
  assert(!result.success);

  console.log();
};

run_parse();
