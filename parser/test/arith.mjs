/*
 *
 * From:
 * https://en.wikipedia.org/wiki/Parsing_expression_grammar
 *
 * License:
 * https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License
 *
 */

import {
  StringReader,
  lazy,
  or,
  regexp,
  seq,
  string,
  rep0
} from "../parser_combinator.mjs";
import assert from "./assert.mjs";

const make_parser = () => {
  const Value = lazy(() =>
    or(regexp(/[0-9]+/), seq(string("("), Expr, string(")")))
  );
  const Product = seq(Value, rep0(seq(or(string("*"), string("/")), Value)));
  const Sum = seq(Product, rep0(seq(or(string("+"), string("-")), Product)));
  const Expr = Sum;

  return Expr;
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
