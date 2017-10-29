/*
 * @author Daisuke Homma
 */

{ // namespace boundary

window.DOMML = this;

// capturing 'this' to 'self' for convenience.
const self = this;

self.append = function(root, elem) {

  root.appendChild(elem);

}

self.create = function(obj) {

  // create element with the specified tag
  const elem = self.tag(obj);

  // copy properties other than DOMML related properties
  const domml_prop = [ 'tag', 'class', 'content', 'style', 'contains' ];
  for(i in obj) {

    // skip DOMML specific properties
    if( domml_prop.includes(i) ) { continue };

    elem[i] = obj[i];

  }

  self.class(obj, elem);
  self.content(obj, elem);
  self.style(obj, elem);
  self.contains(obj, elem);

  return elem;

}

// utility function
// check if the specified property is defined in the object
const defined = function(obj, param) {

  if(typeof obj[param] === 'undefined') {
    return false;
  }

  return true;

}

self.tag = function(obj) {

  if( !defined(obj, 'tag') ) {
    obj.tag = 'div';  // div is the default tag
  }

  return document.createElement(obj.tag);

}

self.class = function(obj, elem) {

  if( !defined(obj, 'class') ) { return };

  elem.className = obj.class;

}

self.content = function(obj, elem) {

  if( !defined(obj, 'content') ) { return };

  elem.innerText = obj.content;

}

self.style = function(obj, elem) {

  if( !defined(obj, 'style') ) { return };

  for(i in obj.style) {

    elem.style[i] = obj.style[i];

  }

}

self.contains = function(obj, elem) {

  if( !defined(obj, 'contains') ) { return };

  const fragment = document.createDocumentFragment();

  obj.contains.forEach( function(v, i) {

    const el = self.create(obj.contains[i]);
    fragment.appendChild(el);

  });

  elem.appendChild(fragment);

}

} // namespace boundary
