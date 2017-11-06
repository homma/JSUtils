
// @author Daisuke Homma

{ // namespace boundary

const loader = {};
window.loader = loader; 

loader.loadInOrder = function(path) {

  loader.loadInternal(path, false, false);

}

loader.loadAsync = function(path) {

  loader.loadInternal(path, true, false);

}

loader.loadDefer = function(path) {

  loader.loadInternal(path, false, true);

}

loader.load = loader.loadAsync;

loader.loadInternal = function(path, asyn, defer) {

  const el = document.createElement('script');

  el.type = "text/javascript";
  el.src = path;
  el.async = asyn;
  el.defer = defer;

  document.head.appendChild(el);

}

} // namespace boundary

