/* Arithmatic with rewriting for associativity */
/*
 *
 * Grammar From:
 * https://en.wikipedia.org/wiki/Parsing_expression_grammar
 *
 * License:
 * https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License
 *
 * Original Grammar:
 *
 *   Expr    <- Sum
 *   Sum     <- Product (("+" / "-") Product)*
 *   Product <- Value (("*" / "/" ) Value)*
 *   Value   <- [0-9]+ / "(" Expr ")"
 *
 * Modified Grammar:
 *
 *   Expr    <- Sum !.
 *   Sum     <- Product (("+" / "-") Product)*
 *   Product <- Value (("*" / "/" ) Value)*
 *   Value   <- [0-9]+ / "(" Sum ")"
 *
 */

import {
  lazy,
  or,
  regexp,
  seq,
  string,
  rep0,
  notp,
  any1,
  modify,
  leftrec
} from "../parser_combinator.mjs";

const parser = input => {
  const Value = lazy(() =>
    or(regexp(/[0-9]+/), seq(string("("), Sum, string(")")))
  );

  const Product = modify(
    seq(Value, rep0(seq(or(string("*"), string("/")), Value))),
    data => leftrec(data)
  );

  const Sum = modify(
    seq(Product, rep0(seq(or(string("+"), string("-")), Product))),
    data => leftrec(data)
  );

  const Expr = seq(Sum, notp(any1()));

  return Expr(input);
};

export default parser;
