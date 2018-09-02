/*
 * Non-CFG Grammar
 */

import {
  lazy,
  seq,
  opt,
  string,
  andp,
  rep1,
  notp,
  any1
} from "../parser_combinator.mjs";

const parser = input => {
  const A = lazy(() => seq(string("a"), opt(A), string("b")));
  const B = lazy(() => seq(string("b"), opt(B), string("c")));

  const S = seq(andp(seq(A), string("c")), rep1(string("a")), B, notp(any1()));

  return S(input);
};

export default parser;
