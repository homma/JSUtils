/*
 * test functions
 */

const assert = cond => {
  let result = "NG.";
  if (cond) {
    result = "OK.";
  }
  console.log("Assertion: " + result);
};

export default assert;
