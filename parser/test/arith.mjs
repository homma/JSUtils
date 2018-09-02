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
  StringReader,
  lazy,
  or,
  regexp,
  seq,
  string,
  rep0,
  notp,
  any1
} from "../parser_combinator.mjs";
import assert from "./assert.mjs";

const make_parser = () => {
  const Value = lazy(() =>
    or(regexp(/[0-9]+/), seq(string("("), Sum, string(")")))
  );
  const Product = seq(Value, rep0(seq(or(string("*"), string("/")), Value)));
  const Sum = seq(Product, rep0(seq(or(string("+"), string("-")), Product)));
  const Expr = seq(Sum, notp(any1()));

  return Expr;
};

const parse = str => {
  const input = new StringReader(str);

  const parser = make_parser();

  const result = parser(input);

  result.print();

  // const len = input.string.length;
  // 0const parsed = input.origin;
  // 0console.log(`parsed ${parsed} characters from ${len} characters.`);

  return result;
};

const run_parse = () => {
  console.log();

  let result = {};

  result = parse("1+1");
  assert(result.success);
  console.log();

  result = parse("(1+1)*10");
  assert(result.success);
  console.log();

  result = parse("a");
  assert(!result.success);
  console.log();

  result = parse(" ");
  assert(!result.success);
  console.log();

  result = parse("(1+1) *10");
  assert(!result.success);
  console.log();

  result = parse("(1)+1)*10");
  assert(!result.success);
  console.log();
};

run_parse();
