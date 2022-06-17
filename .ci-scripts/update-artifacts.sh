#!/bin/bash

# This script takes the old artifacts containing the data needed for the environments and
# adds the current branch's data to them.

dist_dir=$(grep distDir quasar.config.js | cut -d "'" -f2)
project_id=10921

mkdir public

# Create branch artifact
mkdir -p public/${CI_COMMIT_REF_SLUG}/config-tester
cp --recursive --remove-destination ${dist_dir}/* public/${CI_COMMIT_REF_SLUG}/
cp --recursive .gitlab/pages/config-tester/* public/${CI_COMMIT_REF_SLUG}/config-tester/

# Create main artifact
if [ CI_COMMIT_REF_SLUG != 'main']; then
  curl --output old-artifact-main.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs/artifacts/main/download?job=pages"
  unzip -u old-artifact-main.zip -d artifact-main
  mkdir -p public/main/config-tester
  cp --recursive artifact-main/public/main/* public/main/
  cp --recursive .gitlab/pages/config-tester/* public/main/config-tester/
fi

# Create develop artifact
if [ CI_COMMIT_REF_SLUG != 'develop']; then
  curl --output old-artifact-develop.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs/artifacts/develop/download?job=pages"
  unzip -u old-artifact-develop.zip -d artifact-develop
  mkdir -p public/develop/config-tester
  cp --recursive artifact-develop/public/develop/* public/develop/
  cp --recursive .gitlab/pages/config-tester/* public/develop/config-tester/
fi
