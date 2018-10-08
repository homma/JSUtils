/* calculator example 2 */

import {
  string,
  regexp,
  any1,
  seq,
  or,
  rep0,
  notp,
  lazy,
  modify
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
  // const times = seq(value, rep0(seq(times_t, value)));
  // const divide = seq(value, rep0(seq(divide_t, value)));
  // const product = or(times, divide);
  const times = seq(times_t, value);
  const divide = seq(divide_t, value);
  const product = seq(value, rep0(or(times, divide)));

  const sum = seq(product, rep0(seq(or(plus_t, minus_t), product)));
  // const plus = seq(product, rep0(seq(plus_t, product)));
  // const minus = seq(product, rep0(seq(minus_t, product)));
  // const sum = or(plus, minus);

  const expression = seq(sum, eof);

  return expression(input);
};

export default parser;
