#!/bin/bash

# get dist dir
distdir=$(grep distDir quasar.conf.js | cut -d "'" -f2)

# get the latest 'deploy' artifact which contains the former states/environments
jobs=$(curl --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/10921/jobs?scope=success" | jq 'sort_by(.finished_at) | reverse')
latest_deploy_job_id=$(echo $jobs | jq '.[] | select(.stage == "deploy").id' | sed -n 1p)
artifact=$(curl --output old-artifact.zip --header "PRIVATE-TOKEN: $API_TOKEN" "https://gitlab.gwdg.de/api/v4/projects/10921/jobs/$latest_deploy_job_id/artifacts")

# add current data to artifact
unzip -u old-artifact.zip
mkdir -p public/${CI_COMMIT_SHORT_SHA}
cp --remove-destination --recursive ${distdir}/* public/${CI_COMMIT_SHORT_SHA}
mkdir -p public/${CI_COMMIT_REF_SLUG}
cp --remove-destination --recursive ${distdir}/* public/${CI_COMMIT_REF_SLUG}
