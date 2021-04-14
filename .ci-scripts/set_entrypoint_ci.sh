#!/bin/bash

# this script sets the entrypoint for TIDO
#
# reason: if an entrypoint is provided, it will be compiled and integrated into the build
# the build takes precedence and prevents the according config option to take effect
# on the the other hand, the entrypoint is needed for the demo page to show data
# https://subugoe.pages.gwdg.de/emo/Qviewer/develop/#/


echo CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}

case $CI_COMMIT_REF_NAME in
  main)
# placeholder for upcoming patches in the main branch
    ;;
  develop)
    echo 'set entrypoint for develop ...'
    ENTRY_POINT=https://subugoe.pages.gwdg.de/emo/backend/sampledata/collection.json
    sed -ri 's|.*("entrypoint"\s*:).*$|\t\t\t\1 "'${ENTRY_POINT}'",|' src/index.template.html
    ;;
  *)
    echo "set entrypoint for testing"
    # TIDO is developed in the context of the Ahiqar project, therefore we use the Ahiqar data for
    # development purposes.
    ENTRY_POINT=https://ahikar-test.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/collection.json
    sed -ri 's|.*("entrypoint"\s*:).*$|\t\t\t\1 "'${ENTRY_POINT}'",|' src/index.template.html
    ;;
esac

[ $? -eq 0 ] && exit 0
