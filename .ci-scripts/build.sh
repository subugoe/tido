#!/bin/bash

# This script has originally been a template at .gitlab-ci.yml.
# In order to use it within a Bash conditional we moved it to this script file.

bash .ci-scripts/set_entrypoint_ci.sh
npm install
npm run build
npm run tweak:build
