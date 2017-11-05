/*
 * @author Daisuke Homma
 */

{ // namespace boundary

const debug = function(str) {
    console.log(str);
}

// no debug
const nebug = function() {}

myapp.debug = debug;
myapp.nebug = nebug;

} // namespace boundary
