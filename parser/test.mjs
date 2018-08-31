import libp from "./parser_combinator";

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
