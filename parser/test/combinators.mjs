import * as libp from "../parser_combinator.mjs";
import assert from "./assert.mjs";

console.log();

/****** combinator test ******/

console.log("## combinator test");
console.log();

/*** seq test ***/

const test_seq = (expected, str, succeeds) => {
  const input = new libp.StringReader(str);
  const parsers = expected.map(v => libp.string(v));

  const parser = libp.seq(...parsers);
  const result = parser(input);

  result.print();

  if (succeeds) {
    assert(result.success);
  } else {
    assert(!result.success);
  }

  console.log();
};

const run_test_seq = () => {
  console.log("# seq test");

  test_seq(["a", "a"], "aa", true);
  test_seq(["a", "a", "a"], "aaa", true);
  test_seq(["a", "a"], "ab", false);
  test_seq(["abc", "def", "ghi"], "abcdefghi", true);

  console.log();
};

run_test_seq();

/*** or test ***/

const test_or = (expected, str) => {
  const input = new libp.StringReader(str);
  const parsers = expected.map(v => libp.string(v));

  const parser = libp.or(...parsers);
  const result = parser(input);

  result.print();
};

const run_test_or = () => {
  console.log("# or test");

  test_or(["a", "b", "c"], "a");
  test_or(["d", "e", "f"], "a");
  test_or(["abc", "def", "ghi"], "abcdefghi");

  console.log();
};

run_test_or();

/*** rep0 test ***/

const test_rep0 = (str1, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.rep0(libp.string(str1));
  const result = parser(input);

  result.print();
};

const run_test_rep0 = () => {
  console.log("# rep0 test");

  test_rep0("a", "aaa");
  test_rep0("a", "abc");
  test_rep0("b", "abc");
  test_rep0("ab", "ababc");

  console.log();
};

run_test_rep0();

/*** rep1 test ***/

const test_rep1 = (str1, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.rep1(libp.string(str1));
  const result = parser(input);

  result.print();
};

const run_test_rep1 = () => {
  console.log("# rep1 test");

  test_rep1("a", "aaa");
  test_rep1("a", "abc");
  test_rep1("b", "abc");
  test_rep1("ab", "ababc");

  console.log();
};

run_test_rep1();

/*** andp test ***/

const test_andp = (str1, str2, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.seq(libp.andp(libp.string(str1)), libp.string(str2));
  const result = parser(input);

  result.print();
};

const run_test_andp = () => {
  console.log("# andp test");

  test_andp("a", "a", "aaa");
  test_andp("a", "ab", "abc");
  test_andp("a", "bc", "abc");
  test_andp("b", "bc", "abc");
  test_andp("ab", "abc", "abcbc");
  test_andp("ab", "bcd", "ababc");

  console.log();
};

run_test_andp();

/*** notp test ***/

const test_notp = (str1, str2, str) => {
  const input = new libp.StringReader(str);

  const parser = libp.seq(libp.notp(libp.string(str1)), libp.string(str2));
  const result = parser(input);

  result.print();
};

const run_test_notp = () => {
  console.log("# notp test");

  test_notp("b", "a", "aaa");
  test_notp("b", "ab", "abc");
  test_notp("a", "bc", "abc");
  test_notp("b", "bc", "abc");
  test_notp("bc", "abc", "abcbc");
  test_notp("ab", "bcd", "ababc");

  console.log();
};

run_test_notp();
