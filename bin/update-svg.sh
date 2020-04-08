#!/bin/bash

TOO_MANY_ARGS=255

usage() {
	echo "Usage: ${0##*/}. No arguments required."
	exit $TOO_MANY_ARGS
}

[ $# -ge 1 ] && usage

SOURCE_PATH="node_modules/frontend-templating/src/icon/"
[ $# -eq 0 ] && TARGET_PATH="src/assets/icons/" || TARGET_PATH=$1

declare -a SVG=(\
	"angle-double-right--light.svg"\
	"angle-right--light.svg"\
	"arrow-alt-left--normal.svg"\
	"arrow-alt-right--normal.svg"\
	"caret-right--light.svg"\
	"check-circle--normal.svg"\
	"circle--normal.svg"\
	"expand-alt--light.svg"\
	"expand--light.svg"\
	"search-plus--light.svg"\
	"search-minus--light.svg"\
	"undo--normal.svg"\
)

[ ! -d $TARGET_PATH ] && mkdir -p $TARGET_PATH

for i in "${SVG[@]}"; do
	[ -e $SOURCE_PATH"$i" ] && cp $SOURCE_PATH"$i" $TARGET_PATH || echo "No such file: $i. Skipping ..."
done

unset SOURCE_PATH TARGET_PATH SVG

[ $? -eq 0 ] && exit 0
