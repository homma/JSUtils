import * as libp from "./parser_combinator.mjs";

const test_string = (str1, str2) => {
  const input = new libp.StringReader(str2, 0);

  const parser = libp.string(str1);
  const result = parser(input);

  result.print();
};

const run_test_string = () => {
  console.log("");
  console.log("# string test");

  test_string("foo", "foo");
  test_string("foo", "foobar");
  test_string("foo", "bar");

  console.log("");
};

run_test_string();

const test_regexp = (pattern, str, origin) => {
  const input = new libp.StringReader(str, origin);

  const parser = libp.regexp(pattern);
  const result = parser(input);

  result.print();
};

const run_test_regexp = () => {
  console.log("");
  console.log("# regexp test");

  test_regexp(/f../, "foo", 0);
  test_regexp(/[abc]*/, "aaabbbccc", 0);
  test_regexp(/[1-9][0-9]*/, "123", 0);
  test_regexp(/[1-9][0-9]*/, "0123", 0);
  test_regexp(/[1-9][0-9]*/, "0123", 1);

  console.log("");
};

run_test_regexp();
