/*
 *
 * Left Recursion Elimination Test
 *
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/left_rec_elim.mjs";
import assert from "./assert.mjs";

/****** left recursion elimination test ******/

console.log();
console.log("## left recursion elimination test");

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

  input = "1+1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "1+1+1+1+1";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();
};

run_parse();
