#!/bin/bash

# This script has originally been a template at .gitlab-ci.yml.
# In order to use it within a Bash conditional we moved it to this script file.

npm ci
npm run build
