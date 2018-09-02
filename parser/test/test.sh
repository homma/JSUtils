#!/bin/sh

# run all tests

node --experimental-modules ./parsers.mjs
node --experimental-modules ./combinators.mjs
node --experimental-modules ./non-cfg.mjs
