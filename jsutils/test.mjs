import * as utils from "./jsutils.mjs";
import assert from "../assert/assert.mjs";

const test = () => {
  let val = {};
  let result = {};

  val = [];
  result = utils.isArray(val);
  assert(result);

  val = [];
  result = utils.isEmpty(val);
  assert(result);

  val = null;
  result = utils.isEmpty(val);
  assert(!result);
};

test();
