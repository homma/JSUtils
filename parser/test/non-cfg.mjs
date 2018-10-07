/*
 * Non-CFG Grammar
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/non-cfg.mjs";
import assert from "./assert.mjs";

console.log();
console.log("## Non-CFG grammar test");

const parse = str => {
  const input = new StringReader(str);

  const result = parser(input);
  result.print();

  return result;
};

const run_parse = () => {
  console.log();

  let input = null;
  let result = null;

  input = "abc";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "aaabbbccc";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(result.success);
  console.log();

  input = "aaabbbcc";
  console.log(`input: ${input}`);
  result = parse(input);
  assert(!result.success);

  console.log();
};

run_parse();
