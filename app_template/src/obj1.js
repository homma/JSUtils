/*
 * @author Daisuke Homma
 */

{ // namespace boundary

// Objects to be instantiated will be made as functions.

const obj1 = function(arg) {

  this.prop = arg;

}

myapp.obj1 = obj1;

// if using "this", function() should be used instead of an arrow function.
obj1.prototype.func = function() {

  this.prop = "something";

}

// if not using "this", arrow function can be used.
obj1.prototype.func2 = () => {

}

} // namespace boundary
