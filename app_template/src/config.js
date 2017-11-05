/*
 * @author Daisuke Homma
 */

const myapp = {}; // global object

{ // namespace boundary

myapp.config = {};
const config = myapp.config;

config.rootElementId = "myapp_root";

config.debug = false;

} // namespace boundary
