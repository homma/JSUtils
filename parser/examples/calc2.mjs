/* calculator example 2 */

import {
  string,
  regexp,
  any1,
  seq,
  or,
  rep0,
  rep1,
  notp,
  lazy,
  modify,
  trace
} from "../parser_combinator.mjs";

const parser = input => {
  // helper parsers
  const numeral = regexp(/[0-9]+/);
  const plus_t = string("+");
  const minus_t = string("-");
  const times_t = string("*");
  const divide_t = string("/");
  const lparen = string("(");
  const rparen = string(")");
  const eof = notp(any1());

  // syntax
  const value = lazy(() => or(seq(lparen, sum, rparen), numeral, uminus));
  const uminus = seq(minus_t, value);

  // const product  = seq(value, rep0(seq(or(times_t, divide_t), value)));
  const times = seq(value, rep0(seq(times_t, value)));
  const divide = seq(times, rep0(seq(divide_t, times)));
  const product = rep0(divide);

  // const sum = seq(product, rep0(seq(or(plus_t, minus_t), product)));
  const plus = seq(product, rep0(seq(plus_t, product)));
  const minus = seq(plus, rep0(seq(minus_t, plus)));
  const sum = trace(rep0(minus));

  const expression = seq(sum, eof);

  return expression(input);
};

export default parser;
