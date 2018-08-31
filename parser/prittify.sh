#!/bin/sh -x

# prettify
echo "prettify"
for i in *.mjs; do ../node_modules/.bin/prettier ${i} --write; done
