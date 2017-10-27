/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const lib = jsutils || window

//// repeat
// repeat nth with index
lib.repeat = (n, fun) => { for(let i = 0; i < n; i++) fun(i) }

// # usage
// repeat(3,(i)=>console.log(i))

//// loop
// repeat nth without index
lib.loop = (n, fun) => { while(n--) fun() }

// # usage
// loop(3,()=>console.log("foo"))

//// pipeline
// execute functions one by one, tail to nose (i.e. in reverse order)
// using returned value from previous function
lib.execute = (...funs) => funs.reduce((f1, f2) => f1(f2));

// # usage
// const read = (fun) => process.stdin.on('data', fun);
// const write = (data) => process.stdout.write(data);
// execute(read, write);

} // namespace boundary
