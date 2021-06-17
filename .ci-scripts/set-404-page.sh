#!/bin/bash

# This script creates a basic 404 page for GitLab pages.
# It comes into play when a build isn't continued due to the entry point being removed.
# Since the removal of an entry point triggers a new pipeline, the respective GitLab page
# will be created accordingly. The page created by this script serves as a placeholder until
# the correct page has been created.

echo "Create 404 page"
mkdir public
echo "<!DOCTYPE html><html><head><title>TIDO 404</title><meta charset='utf-8'></head><body>404: no build contents have been provided</body>" > public/404.html
