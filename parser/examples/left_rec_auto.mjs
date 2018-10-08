/* automatic left recursion elimination example */

import {
  string,
  regexp,
  any1,
  seq,
  rep0,
  notp,
  lazy,
  modify,
  left
} from "../parser_combinator.mjs";

const parser = input => {
  // helper parsers
  const numeral = regexp(/[0-9]+/);
  const plus = string("+");
  const eof = notp(any1());

  // original syntax
  //
  // expression <- expression '+' expression / numeral
  //

  // the direct implementation involves left recursion
  //
  // const expression = lazy(() => or(
  //   seq(expression, plus, expression)),
  //   numeral
  // );
  //

  // so the syntax should be modified like below to eliminate the left recursion
  //
  // expression <- numeral expr_tail
  // expr_tail  <- ('+' expression)*
  //

  // the `left` function do this mutation automatically
  //
  // arguments to the function is somewhat similar to the original syntax
  //
  //   expression <- expression '+' expression / numeral
  //
  const expression = lazy(() =>
    left(expression, seq(plus, expression), numeral)
  );

  // starting point
  const start = seq(expression, eof);

  return start(input);
};

export default parser;
