/*
 *
 * Calculator Test
 *
 */

import calc from "../examples/calc.mjs";
import assert from "./assert.mjs";

/****** calculator test ******/

console.log();
console.log("## calculator test");

const run_test = () => {
  console.log();

  let input = {};
  let result = {};

  input = "1+1";
  console.log(`input: ${input}`);
  result = calc(input);
  console.log(`output: ${result.result}`);
  assert(result.result == 2);
  console.log();

  input = "1+2-3+4";
  console.log(`input: ${input}`);
  result = calc(input);
  console.log(`output: ${result.result}`);
  assert(result.result == 4);
  console.log();

  input = "(1+1)*10";
  console.log(`input: ${input}`);
  result = calc(input);
  console.log(`output: ${result.result}`);
  assert(result.result == 20);
  console.log();

  input = "1+6/3*4+5-6";
  console.log(`input: ${input}`);
  result = calc(input);
  console.log(`output: ${result.result}`);
  assert(result.result == 8);
  console.log();

  input = "42";
  console.log(`input: ${input}`);
  result = calc(input);
  console.log(`output: ${result.result}`);
  assert(result.result == 42);
  console.log();

  input = "not an arithmatic";
  console.log(`input: ${input}`);
  result = calc(input);
  assert(!result.success);
  console.log();
};

run_test();
