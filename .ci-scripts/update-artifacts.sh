#!/bin/bash

# This script takes the old artifacts containing the data needed for the environments and
# adds the current branch's data to them.

dist_dir=$(grep distDir quasar.conf.js | cut -d "'" -f2)
project_id=10921
ls -l ./public
# Get latest artifact from develop branch
curl --output old-artifact-develop.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs/artifacts/develop/download?job=pages"
unzip -u old-artifact-develop.zip -d artifact-develop
mkdir -p public/develop
cp artifact-develop/public/develop/* public/develop/

# Setup app build and Config Tester for the current branch
mkdir -p public/${CI_COMMIT_REF_SLUG}/config-tester
cp --recursive --remove-destination ${dist_dir}/* public/${CI_COMMIT_REF_SLUG}/
cp .gitlab/pages/config-tester/* public/${CI_COMMIT_REF_SLUG}/config-tester/

[ $? -eq 0 ] && exit 0
