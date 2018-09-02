#!/bin/sh

# run one test

if [ x$1 = "x" ]; then
  echo "Usage: ./run_test.sh <TARGET>"
  exit 1
fi

echo "Command: $0 $1"
node --experimental-modules $1
