#!/bin/bash

# This script takes the old artifacts containing the data needed for the environments and
# adds the current branch's data to them.

dist_dir=$(grep distDir quasar.conf.js | cut -d "'" -f2)
project_id=10921

# get and extract the latest 'deploy' artifact which contains the former states/environments
jobs=$(curl --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/${project_id}/jobs?scope=success" | jq 'sort_by(.finished_at) | reverse')
latest_deploy_job_id=$(echo $jobs | jq '.[] | select(.stage == "deploy").id' | sed -n 1p)
curl --output old-artifact.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/10921/jobs/${latest_deploy_job_id}/artifacts"
unzip -u old-artifact.zip

# add current data to artifact. this only takes place if $CONTINUE_BUILD is set to 'true' or we are on a feature/bugfix/… branch.
# the differentiation between the branches is necessary because $CONTINUE_BUILD is only set on 'main' and 'develop'.
if [[ $CONTINUE_BUILD == "true" || ($CI_COMMIT_BRANCH != "main" && $CI_COMMIT_BRANCH != "develop") ]]; then
    mkdir -p public/{${CI_COMMIT_SHORT_SHA},${CI_COMMIT_REF_SLUG}}
    echo public/${CI_COMMIT_SHORT_SHA} public/${CI_COMMIT_REF_SLUG} | xargs -n 1 cp --remove-destination --recursive ${dist_dir}/*
fi

mkdir -p public/${CI_COMMIT_REF_SLUG}/config-tester
cp .gitlab/pages/config-tester/* public/${CI_COMMIT_REF_SLUG}/config-tester/

[ $? -eq 0 ] && exit 0
