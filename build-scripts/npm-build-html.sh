#!/bin/bash
set -e -x

usemin $npm_package_config_src/index.html -d $npm_package_config_dist > $npm_package_config_dist/index.html
