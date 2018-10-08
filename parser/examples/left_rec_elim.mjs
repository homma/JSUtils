/* left recursion elimination example (by hand) */

import {
  string,
  regexp,
  any1,
  seq,
  rep0,
  notp,
  lazy,
  modify,
  leftrec
} from "../parser_combinator.mjs";

const parser = input => {
  // helper parsers
  const numeral = regexp(/[0-9]+/);
  const plus = string("+");
  const eof = notp(any1());

  //// syntax
  // expression <- expression + expression / numeral

  // before modification -- this does not work
  //
  // const expression = lazy(() => or(
  //   seq(expression, plus, expression)),
  //   numeral
  // );
  //

  // left recursion elimination
  //
  // modified to be right recursive
  const expression = lazy(() =>
    modify(seq(numeral, expr_tail), v => leftrec(v))
  );
  const expr_tail = rep0(seq(plus, expression));

  // starting point
  const start = seq(expression, eof);

  return start(input);
};

export default parser;
