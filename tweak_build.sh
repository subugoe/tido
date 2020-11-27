#!/bin/bash

PKG_SCOPE=@subugoe
PKG_NAME=qviewer

BAD_PARAM=127

# filter the line holding the distribution dir
# define a single quotation mark as delimiter
# and use the 2nd field which points the dir in question
DIST_DIR=$(grep distDir './quasar.conf.js' | cut -d "'" -f2)

# get all the js files put out from the build step
declare -a files=( ${DIST_DIR}/*.js )

# concatenate all js files
for i in "${files[@]}"; do
  cat $i >> ${DIST_DIR}/${PKG_NAME}.js
done

# verify operation
[ $? -eq 0 ] && echo "$PKG_NAME created succesfully inside $DIST_DIR" || (echo "oops! sth went wrong :/" && exit $BAD_PARAM)

# delete the files from the former build step
rm "${files[@]}"

# print the result
tree $DIST_DIR

unset PKG_SCOPE PKG_NAME DIST_DIR files i

[ $? -eq 0 ] && exit 0
