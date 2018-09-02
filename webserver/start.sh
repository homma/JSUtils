#!/bin/sh

SCRIPT_DIR=$(dirname $0)

node --experimental-modules ${SCRIPT_DIR}/webserver.mjs
