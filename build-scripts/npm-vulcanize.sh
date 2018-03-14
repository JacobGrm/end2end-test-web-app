#!/bin/bash
set -e -x

vulcanize --inline-scripts --inline-css $npm_package_config_dist/index.html > $npm_package_config_dist/index.min.html
