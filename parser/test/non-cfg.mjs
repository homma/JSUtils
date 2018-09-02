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

const parse = str => {
  const input = new StringReader(str);

  const A = lazy(() => seq(string("a"), opt(A), string("b")));
  const B = lazy(() => seq(string("b"), opt(B), string("c")));

  const S = seq(andp(seq(A), string("c")), rep1(string("a")), B, notp(any1()));

  S(input).print();
};

const run_parse = () => {
  console.log();
  parse("abc");
  parse("aaabbbccc");
  parse("aaabbbcc");
  console.log();
};

run_parse();
