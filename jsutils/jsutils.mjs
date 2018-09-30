/*
 * @author Daisuke Homma
 */

//// control functons

// repeat
// repeat nth with index
// # usage
// repeat(3,(i)=>console.log(i))

export //
const repeat = (n, fun) => {
  for (let i = 0; i < n; i++) fun(i);
};

// loop
// repeat nth without index
// # usage
// loop(3,()=>console.log("foo"))

export //
const loop = (n, fun) => {
  while (n--) fun();
};

// execute
// execute functions one by one, tail to nose (i.e. in reverse order)
// using returned value from previous function
// # usage
// const read = (fun) => process.stdin.on('data', fun);
// const write = (data) => process.stdout.write(data);
// execute(read, write);

export //
const execute = (...funs) => funs.reduce((f1, f2) => f1(f2));

//// type checkers

// isNull

export //
const isNull = val => val == null;

// isBoolean

export //
const isBoolean = val => typeof val === "boolean";

// isNumber

export //
const isNumber = val => typeof val === "number";

// isString

export //
const isString = val => typeof val === "string";

// isDate

export //
const isDate = val => val instanceof Date;

// isObject

export //
const isObject = val => typeof val === "object";

// isHTMLElement
// check if val is a HTMLElement

export //
const isHTMLElement = val => val instanceof Node || val instanceof HTMLElement;

//// CSS

// toCamel
// convert foo-bar-baz to fooBarBaz

export //
const toCamel = str =>
  str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());

//// String manipulation

// explode
// alt: str => Object.values(str);
// alt: str => str.split('');

export //
const explode = str => Array.from(str);

// implode

export //
const implode = arr => arr.join("");

// stringMap
// Apply Array.map to String
// alt: (str, fun) => Object.values(str).map(fun);
// alt: (str, fun) => Array.prototype.map.call(str, fun);
// alt: (str, fun) => str.split('').map(fun);

export //
const stringMap = (str, fun) => Array.from(str).map(fun);

//// sleep

// sleep
// sleep sec seconds
// needed to be used within an async function with await
// usage: await sleep(3)

export //
const sleep = sec => new Promise(rs => setTimeout(rs, sec * 1000));

// msleep
// sleep msec microseconds

export //
const msleep = msec => new Promise(rs => setTimeout(rs, msec));

// sleepMap
// apply function with msec delay

export //
const sleepMap = async (arr, msec, fun) => {
  for (var i of arr) {
    fun(arr[1]);
    await msleep(msec);
  }
};
