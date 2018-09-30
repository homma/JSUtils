/*
 * @author Daisuke Homma
 */

{ // namespace boundary

let jsutils = jsutils || window;
const lib = jsutils;

//// repeat
// repeat nth with index
// # usage
// repeat(3,(i)=>console.log(i))

lib.repeat = (n, fun) => { for(let i = 0; i < n; i++) fun(i) }

//// loop
// repeat nth without index
// # usage
// loop(3,()=>console.log("foo"))

lib.loop = (n, fun) => { while(n--) fun() }

//// pipeline
// execute functions one by one, tail to nose (i.e. in reverse order)
// using returned value from previous function
// # usage
// const read = (fun) => process.stdin.on('data', fun);
// const write = (data) => process.stdout.write(data);
// execute(read, write);

lib.execute = (...funs) => funs.reduce((f1, f2) => f1(f2));

//// value type check
lib.isNull = val => val == null;
lib.isBoolean = val => typeof val === "boolean";
lib.isNumber = val => typeof val === "number";
lib.isString = val => typeof val === "string";
lib.isDate = val => val instanceof Date;
lib.isObject = val => typeof val === "object";

lib.isHTMLElement = val => ( (val instanceof Node) ||
                             (val instanceof HTMLElement) );

//// CSS

// convert foo-bar-baz to fooBarBaz
lib.toCamel = str => str.replace(/-([a-z])/g,
                                   (match, p1) => p1.toUpperCase());

//// String

lib.explode = str => Array.from(str);

// Alt: str => Object.values(str);
// Alt: str => str.split('');

lib.implode = arr => arr.join(''); 
// Apply Array.map to String
lib.stringMap = (str, fun) => Array.from(str).map(fun);

// Alt: (str, fun) => Object.values(str).map(fun);
// Alt: (str, fun) => Array.prototype.map.call(str, fun);
// Alt: (str, fun) => str.split('').map(fun);

//// sleep
// sleep x seconds
// needed to be used within an async function with await
// usage: await sleep(3)

lib.sleep = x => new Promise(rs => setTimeout(rs, x * 1000));

lib.msleep = x => new Promise(rs => setTimeout(rs, x));

} // namespace boundary
