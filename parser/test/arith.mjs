/*
 *
 * Arithmatic Grammar Test
 *
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/arith.mjs";
import assert from "./assert.mjs";

console.log();

/****** arithmatic grammar test ******/

console.log("## arithmatic grammar test");
console.log();

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
  let input = {};
  let result = {};

  input = "1+1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "(1+1)*10";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "a";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(!result.success);
  console.log();

  input = " ";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(!result.success);
  console.log();

  input = "(1+1) *10";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(!result.success);
  console.log();

  input = "(1)+1)*10";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(!result.success);
  console.log();

  input = "1+2*3+4";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();
};

run_parse();
