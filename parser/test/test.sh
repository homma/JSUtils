#!/bin/sh

# run all tests

node --experimental-modules ./parsers.mjs
node --experimental-modules ./combinators.mjs
node --experimental-modules ./multicomb.mjs
node --experimental-modules ./non-cfg.mjs
node --experimental-modules ./arith.mjs
node --experimental-modules ./calc.mjs
