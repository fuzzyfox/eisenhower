#!/bin/sh

# bower install
if ! which bower > /dev/null
  then npm install -g bower
fi

bower install

# grunt build
if ! which grunt > /dev/null
  then npm install -g grunt-cli
fi

grunt build
