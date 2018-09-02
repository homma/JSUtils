/*
 * Non-CFG Grammar
 */

import { StringReader } from "../parser_combinator.mjs";
import parser from "../examples/non-cfg.mjs";
import assert from "./assert.mjs";

const parse = str => {
  const input = new StringReader(str);

  const result = parser(input);
  result.print();

  return result;
};

const run_parse = () => {
  console.log();

  let result = parse("abc");
  assert(result.success);
  console.log();

  result = parse("aaabbbccc");
  assert(result.success);
  console.log();

  result = parse("aaabbbcc");
  assert(!result.success);

  console.log();
};

run_parse();
