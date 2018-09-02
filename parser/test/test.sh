#!/bin/sh

# test
echo "test"
node --experimental-modules ./parsers.mjs
node --experimental-modules ./combinators.mjs
node --experimental-modules ./non-cfg.mjs
