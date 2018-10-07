/*
 *
 * Arithmatic Grammar Test
 *
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/arith.mjs";
import assert from "./assert.mjs";

const parse = str => {
  const input = new StringReader(str);

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

  result = parse("1+2*3+4");
  assert(!result.success);
  console.log();
};

run_parse();
