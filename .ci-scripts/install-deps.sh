#!/bin/sh

apk update && \
apk add bash && \
apk add curl && \
apk add jq && \
apk add --no-cache unzip
