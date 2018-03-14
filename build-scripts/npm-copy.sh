#!/bin/bash
set -e -x

COPY_TYPE="$1"

if [[ "$COPY_TYPE" == "elements" ]]; then
	cp -r $npm_package_config_src/elements $npm_package_config_dist/elements
elif [[ "$COPY_TYPE" == "spec" ]]; then
	cp -r $npm_package_config_src/spec $npm_package_config_dist/spec
elif [[ "$COPY_TYPE" == "scripts" ]]; then
	cp -r $npm_package_config_src/scripts $npm_package_config_dist/scripts
elif [[ "$COPY_TYPE" == "jasmine" ]]; then
	cp -r $npm_package_config_src/jasmine-2.4.1 $npm_package_config_dist/jasmine-2.4.1
elif [[ "$COPY_TYPE" == "assets" ]]; then
	cp -r $npm_package_config_src/assets $npm_package_config_dist/assets
elif [[ "$COPY_TYPE" == "res" ]]; then
	cp -r $npm_package_config_src/res $npm_package_config_dist/res
else
	echo "[ERROR] unexpected copy action type: $COPY_TYPE"
	exit 1
fi;

