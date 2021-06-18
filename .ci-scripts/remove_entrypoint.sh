#!/bin/bash

# This script remove any entry point given at src/index.template.html.
# If an entry point is removed, src/index.template.html is committed again
# to the repository which triggers a new pipeline. Here there variable
# $CONTINUE_BUILD comes into play.
# In order to avoid having to build the complete application although the
# current pipeline will trigger a new one, $CONTINUE_BUILD is set to "false"
# and prevents a complete build and deployment.

FILE="src/index.template.html"

if grep -q '"entrypoint": ""' "$FILE"; then 
    echo "No entry point update required."
    echo "CONTINUE_BUILD=true" >> build.env
else
    echo "Entry point has to be removed."
    mkdir -p /tmp/this && cd /tmp/this || exit
    git clone git@gitlab.gwdg.de:subugoe/emo/QViewer.git
    cd QViewer || exit
    sed -i 's/"entrypoint": ".*"/"entrypoint": ""/' src/index.template.html
    git add src/index.template.html && git commit -m "ci: remove entry point" && git push
    echo "CONTINUE_BUILD=false" >> build.env
fi