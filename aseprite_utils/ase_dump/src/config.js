/*
 * @author Daisuke Homma
 */

const myapp = {}; // global object

{ // namespace boundary

myapp.config = {};
const config = myapp.config;

config.debug = false;
config.header_size = 128;

} // namespace boundary
