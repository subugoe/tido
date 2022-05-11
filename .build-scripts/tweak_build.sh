#!/bin/bash

# set exit code !== 0; bash emits '0' on success
BAD_PARAM=127

# the script relies on a properly set up package scope and name

# filter the package name
PKG_NAME=$(grep '\bname\b' './package.json' | cut -d '"' -f4)

# split up scope and name
PKG_SCOPE=${PKG_NAME%/*}
PROD_NAME=${PKG_NAME#*/}

# filter distribution dir
DIST_DIR=$(grep distDir './quasar.config.js' | cut -d "'" -f2) || dist

# get all the js files put out from the build step
declare -a FILES=( ${DIST_DIR}/*.js )

# concatenate all js files
for i in "${FILES[@]}"; do
  cat $i >> ${DIST_DIR}/${PROD_NAME}.js
done

# verify operation
[ $? -eq 0 ] && echo "$PROD_NAME created succesfully inside $DIST_DIR" || (echo "oops! sth went wrong :/" && exit $BAD_PARAM)

# delete the files from the former build step
rm "${FILES[@]}"

# print the result
ls -l $DIST_DIR

# replace the included js files from the former build by the single one concatenated above
sed -ri 's:<script\s+src.*</script>:<script src="'${PROD_NAME}'.js"></script>:' ${DIST_DIR}/index.html

unset BAD_PARAM PKG_NAME PKG_SCOPE PROD_NAME DIST_DIR FILES i

[ $? -eq 0 ] && exit 0
