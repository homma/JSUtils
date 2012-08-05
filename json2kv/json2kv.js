/**
 * @author Daisuke Homma
 * @fileOverview JSON <-> Key Value Pairs converter
 */

new function() { // block

var self;

if(typeof exports !== 'undefined') {
  self = exports;
} else {
  self = window.JSON2KV = this;
}

/*** JSON to key-value ********************************************************/

/**
 * @description convert JSON string to an array of key-value pairs
 * @param {String} json A JSON string
 * @returns {String} An array of key-value pair in JSON format
 */
self.json2kv = function(json, prefix, odelim, adelim) {

  var ret = [];

  var tree = JSON.parse(json);

  ret = self.object2kv(tree, prefix, odelim, adelim);

  return JSON.stringify(ret);

}

/**
 * @description convert JSON object to an array of key-value pairs
 * @param {Object} tree A JSON convetable object
 * @param {String} prefix A prefix to be added to ahead of keys
 * @param {String} delim A delimeter of keys
 * @returns {Array} An array of key-value pair
 */
self.object2kv = function(tree, prefix, odelim, adelim) {

  var ret = [];

  if( self.isObject(tree) ) {

    ret = self.traverseObject(tree, prefix, odelim, adelim);

  } else if( self.isArray(tree) ) {

    ret = self.traverseArray(tree, prefix, adelim, adelim);

  } else {

    console.log("JSON parse error.");
    return null;

  }

  return ret;

}

/**
 * @description visit each entry of an object and make key-value pairs
 * @param {Object} object A valid JSON object to be traversed
 * @param {String} prefix A prefix to be added to ahead of keys
 * @param {String} delim A delimeter of keys
 */
self.traverseObject = function(object, prefix, odelim, adelim) {

  var ret = [];

  var pre = prefix || "";
  var odel = odelim || "\:";
  var adel = adelim || "\[";

  var entry;

  for(var i in object) {

    var key = pre + i;
    var val = object[i];

    // Object
    if( self.isObject(val) ) {

      ret.push( self.createObject(key, "OBJECT") );
      var keys = self.keysInString(val);
      ret.push( self.createObject(key + odel, keys) );
      ret = ret.concat( self.traverseObject(val, key + odel, odelim, adelim) );

    // Array
    } else if( self.isArray(val) ) {

      ret.push( self.createObject(key, "ARRAY") );
      ret.push( self.createObject(key + adel, val.length) );
      ret = ret.concat( self.traverseArray(val, key + adel, odelim, adelim) );

    // Numeric, String, Boolean, null
    } else {

      ret.push( self.createObject(key, val) );

    }

  }

  return ret;

}

self.keysInString = function(obj) {

  var keys = Object.keys(obj);
  var str = new String();

  for(var i = 0; i < keys.length; i++) {
    str = str + "," + keys[i];
  }

  return str;

}

self.createObject = function(key, val) {

  ret = {};
  ret[key] = val;

  return ret;

}

/**
 * @description visit each entry of an array and make key-value pairs
 * @param {Array} array A valid JSON array to be traversed
 * @param {String} prefix A prefix to be added to every key
 * @param {String} delim A delimeter of keys
 */
self.traverseArray = function(array, prefix, odelim, adelim) {

  var ret = [];

  var pre = prefix || "";
  var odel = odelim || "\:";
  var adel = adelim || "\[";
  var len = array.length;

  var entry;

  for(var i = 0; i < len; i++) {

    var key = pre + i;
    var val = array[i];

    // Object
    if( self.isObject(val) ) {

      ret.push( self.createObject(key, "OBJECT") );
      var keys = self.keysInString(val);
      ret.push( self.createObject(key + odel, keys) );
      ret = ret.concat( self.traverseObject(val, key + odel, odelim, adelim) );

    // Array
    } else if( self.isArray(val) ) {

      ret.push( self.createObject(key, "ARRAY") );
      ret.push( self.createObject(key + adel, val.length) );
      ret = ret.concat( self.traverseArray(val, key + adel, odelim, adelim) );

    // Numeric, String, Boolean, null
    } else {

      ret.push( self.createObject(key, val) );
      continue;

    }

  }

  return ret;

}

self.isObject = function(val) {

  var ret = true;

  if( (typeof val == "number") || (typeof val == "string")
      || (typeof val == "boolean") || (val == null)
      || (val instanceof Array) ) {

      ret = false;

  }

  return ret;

}

self.isArray = function(val) {

  return (val instanceof Array);

}

/*** key-value to JSON ********************************************************/

/**
 * @description convert an array of key-value pairs into JSON string
 * @param {String} kv A JSON string of an array which includes key-value pairs
 * @returns {String} A JSON string 
 */
self.kv2json = function(kv, prefix, odelim, adelim) {

  var ret = [];

  var tree = JSON.parse(kv);

  ret = self.kv2object(tree, prefix, odelim, adelim);

  return JSON.stringify(ret);

}

self.kv2object = function(array, prefix, odelim, adelim) {

  var tree = {};

  for(var i = 0; i < array.length; i++) {

    var kv = array[i];
    var key = Object.keys(kv)[0];
    var val = kv[key];

    if(prefix) {
      key.splice(0, prefix.length);
    }

    var names = self.splitKey(key, odelim, adelim);
    self.makeTree(tree, names, val);

  }

  return tree;

}

/**
 * @description split a key by delimeters
 * @param {String} key A key to become nested JSON name
 * @param {String} odelim Object delimeter
 * @param {String} adelim Array delimeter
 * @returns An array of { name, kind } pair
 */
self.splitKey = function(key, odelim, adelim) {

  var ret = [];

  var odel = odelim || "\:";
  var adel = adelim || "\[";

  var str = key;
  var kind;

  while(true) {

    var res = self.takeOneKey(str, odel, adel);

    if(res == null) {

      ret.push( { name : str, kind : "VALUE" } );
      break;

    }

    if(res.rest.length == 0) {

      kind = "META";

    } else if(res.delim == odel) {

      kind = "OBJECT";

    } else {

      kind = "ARRAY";

    }

    ret.push( { name : res.string, kind : kind } );

    str = res.rest;

  }

  return ret;

}

self.takeOneKey = function(string, delim0, delim1) {

  end0 = string.indexOf(delim0);
  end1 = string.indexOf(delim1);
  len0 = delim0.length;
  len1 = delim1.length;

  if( (end0 == -1) && (end1 == -1) ) {
    return null;
  }

  var ret = {};

  if( (end0 == -1) || (end1 < end0) ) {
    ret.string = string.substring(0, end1);
    ret.rest = string.substring(end1 + len1);
    ret.delim = delim1;

    return ret;
  }

  if( (end1 == -1) || (end0 < end1) ) {
    ret.string = string.substring(0, end0);
    ret.rest = string.substring(end0 + len0);
    ret.delim = delim0;

    return ret;
  }


}

self.makeTree = function(top, names, val) {

  var obj = top;

  for(var i = 0; i < names.length; i++) {

    var name = names[i].name;
    var kind = names[i].kind;

    if( obj.hasOwnProperty(name) ) {
      obj = obj[name];
      continue;
    }

    if( kind == "OBJECT" ) {
      if(!obj[name]) {
        obj[name] = {};
      }
    } else if ( kind == "ARRAY" ) {
      if(!obj[name]) {
        obj[name] = [];
      }
    } else if ( kind == "META" ) {
      break;
    } else if ( kind == "VALUE" ) {
      if( (val == "OBJECT") || (val == "ARRAY") ) { break; }
      obj[name] = val;
    }

    obj = obj[name];

  }

}

} // block

