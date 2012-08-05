
# About

JSON2KV converts JSON data into an array of key value pair.
It is useful for storing nested JSON data into key value database.

# Example

## Example 1 : Object

This nested JSON data that an object contains other objects:

  { "parent" : { "child1" : "foo", "child2" : "bar" } }

will be converted as an array of "key" : "value" pair like:

  [ { "parent" : "OBJECT" },              // type information
    { "parent\:" : "child1\:child2" },    // keys
    { "parent\:child1" : "foo" },
    { "parent\:child2" : "bar" } ]

The object key format is "parent key + \: + child key".

Now, you can easily store them to any key value database.

## Example 2 : Array

This JSON:

  { "array" : [ "foo", "bar", "baz" ] }

is converted to:

  [ { "array" : "ARRAY" },    // type information
    { "array\[" : 3 },        // number of members of the array
    { "array\[0" : "foo" },
    { "array\[1" : "bar" },
    { "array\[2" : "baz" } ]

The array key form is "key + \[ + index".

## Example 3 : Deeply nested JSON data

This deeply nested JSON data:

  { "H1" : { "H2" : { "H3" : { "H4" : { "H5" : "val" }}}}}

will be converted as:

  [ { "H1" : "OBJECT" },
    { "H1\:" : "H2" },
    { "H1\:H2" : "OBJECT" },
    { "H1\:H2\:" : "H3" },
    { "H1\:H2\:H3" : "OBJECT" },
    { "H1\:H2\:H3\:" : "H4" },
    { "H1\:H2\:H3\:H4" : "OBJECT" },
    { "H1\:H2\:H3\:H4\:" : "H5" },
    { "H1\:H2\:H3\:H4\:H5" : "val" } ]

## Example 4 : Adding a prefix

You can set a prefix to the keys.
Here, "12345:" is added for each keys.

  [ { "12345:parent" : "OBJECT" },
    { "12345:parent\:" : "child1\:child2" },
    { "12345:parent\:child1" : "foo" },
    { "12345:parent\:child2" : "bar" } ]

It may be useful when you store these data in a key value database.

# Mechanism

# When to use

