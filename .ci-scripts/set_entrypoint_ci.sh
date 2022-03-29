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
# placeholder for upcoming patches in the main branch
    ;;
  develop)
    echo 'set entrypoint for develop ...'
    ENTRY_POINT=https://subugoe.pages.gwdg.de/emo/backend/sampledata/collection.json
    sed -ri 's|.*("entrypoint"\s*:).*$|\t\t\t\1 "'${ENTRY_POINT}'",|' src/index.template.html
    ;;
esac

[ $? -eq 0 ] && exit 0
