#!/bin/bash

# This script sets the entry point for TIDO's GitLab pages. They are not part of version
# controlling.
#
# Reason: If an entrypoint is provided, it will be compiled and integrated into the build.
# Since we still want to have data at our hands when developing and for the official TIDO
# link, the entry point has to be set without being present in the repository.


echo CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}

case $CI_COMMIT_REF_NAME in
  main)
    echo 'set entrypoint for main ...'
    # for now we set the main entrypoint the same as develop just to have a working state in Gitlab Pages
    ENTRY_POINT=https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/collection.json
    ;;
  develop)
    echo 'set entrypoint for develop ...'
    ENTRY_POINT=https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/collection.json
    ;;
esac

sed -ri 's|.*("entrypoint"\s*:).*$|\t\t\t\1 "'${ENTRY_POINT}'",|' src/index.template.html


[ $? -eq 0 ] && exit 0
