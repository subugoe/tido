#!/bin/bash

# This script takes the old artifacts containing the data needed for the environments and
# adds the current branch's data to them.

dist_dir=$(grep distDir quasar.config.js | cut -d "'" -f2)
project_id=10921

mkdir public

# Create branch artifact
mkdir -p public/${CI_COMMIT_REF_SLUG}/examples
cp --recursive --remove-destination ${dist_dir}/* public/${CI_COMMIT_REF_SLUG}/${dist_dir}/
cp --recursive examples/* public/${CI_COMMIT_REF_SLUG}/examples/

# Create main artifact
if [[ $CI_COMMIT_REF_SLUG != "main" ]]; then
  curl --output old-artifact-main.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs/artifacts/main/download?job=pages"
  unzip -u old-artifact-main.zip -d artifact-main
  mkdir -p public/main/examples
  cp --recursive artifact-main/public/main/* public/main/
  cp --recursive examples/* public/main/examples/
fi

# Create develop artifact
if [[ $CI_COMMIT_REF_SLUG != "develop" ]]; then
  curl --output old-artifact-develop.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs/artifacts/develop/download?job=pages"
  unzip -u old-artifact-develop.zip -d artifact-develop
  mkdir -p public/develop/examples
  cp --recursive artifact-develop/public/develop/* public/develop/
  cp --recursive examples/* public/develop/examples/
fi
