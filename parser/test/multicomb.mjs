import * as libp from "../parser_combinator.mjs";
import assert from "./assert.mjs";

console.log();

/****** multiple combinators test ******/

console.log("## multiple combinators test");
console.log();

// seq - or
const test_seq_or = (str1, str2, str3, str4, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.seq(
    libp.or(libp.string(str1), libp.string(str2)),
    libp.or(libp.string(str3), libp.string(str4))
  );

  const result = parser(input);
  result.print();

  return result;
};

const run_test_seq_or = () => {
  console.log("# test seq - or");

  let result = {};

  result = test_seq_or("+", "-", "*", "/", "+/");
  assert(result.success);
  console.log();

  result = test_seq_or("+", "-", "*", "/", "+ /");
  assert(!result.success);
  console.log();
};

run_test_seq_or();

// rep0 - seq
const test_rep0_seq = (str1, str2, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.rep0(libp.seq(libp.string(str1), libp.string(str2)));

  const result = parser(input);
  result.print();

  return result;
};

const run_test_rep0_seq = () => {
  console.log("# test rep0 - seq");

  let input = {};
  let result = {};

  result = test_rep0_seq("+", "-", "+-");
  assert(result.success);
  console.log();

  result = test_rep0_seq("+", "-", "+-+-");
  assert(result.success);
  console.log();

  result = test_rep0_seq("+", "-", "+-+ -");
  assert(result.success);
  console.log();

  result = test_rep0_seq("+", "-", "+- +-");
  assert(result.success);
  console.log();

  result = test_rep0_seq("+", "-", "+ -+-");
  assert(result.success);
  console.log();
};

run_test_rep0_seq();
