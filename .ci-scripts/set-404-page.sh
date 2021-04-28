#!/bin/bash

echo "Create 404 page"
mkdir public
echo "<!DOCTYPE html><html><head><title>TIDO 404</title><meta charset='utf-8'></head><body>404: no build contents have been provided</body>" > public/404.html
