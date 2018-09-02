#!/bin/sh

# run prettier for each javascript files

SCRIPT_DIR=$(dirname $0)
PRETTIER=${SCRIPT_DIR}/../node_modules/.bin/prettier

find ${SCRIPT_DIR} -name '*.mjs' | while read i; do (${PRETTIER} ${i} --write &); done
