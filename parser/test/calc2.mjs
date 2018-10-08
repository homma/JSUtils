/*
 *
 * Calculator 2 Test
 *
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/calc2.mjs";
import assert from "./assert.mjs";

/****** calculator 2 test ******/

console.log();
console.log("## calculator 2 test");

const parse = str => {
  const input = new StringReader(str);

  const result = parser(input);

  result.print();

  return result;
};

const run_parse = () => {
  console.log();

  let input = {};
  let result = {};

  input = "-1+1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "-1*1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "1*-1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "1+1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "1+2-3+4";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "(1+1)*10";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "1+2/3*4+5-6";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "42";
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
