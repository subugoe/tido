#!/bin/bash

#
# Some lines have been commented since they don't work properly at the moment.
# We left them in there as a basis in case we want to improve the performance
# of the build process at a later stage.
#

#active_branches=$(cat $1 | jq '.[].name')

## prepare branch names for BASH regex matching
#active_branches=${active_branches//[\/#]/\-}
#active_branches=${active_branches//\"/}
#active_branches=$(for branch in $active_branches; do echo $branch | tr '[:upper:]' '[:lower:]'; done)

# get current date in seconds–standard procedure for comparing two dates
current_date=$(date "+%Y%m%d")
current_date_in_s=$(date -d $current_date "+%s")

cd public

for entry in *
    do
        last_modified=$(date -r $entry "+%Y%m%d")
        last_modified_in_s=$(date -d $last_modified +%s)
        # difference in days
        diff=$((($current_date_in_s - $last_modified_in_s) / (24*3600)))
        # preserve content of development branch ...
        if [[ ${entry} = "develop" ]]; then
            :
        # ... remove other entries that are older than 2 weeks ...
        elif [[ $diff -gt 14 ]]; then
            rm -r $entry
        ## ... keep the single commit entries ...
        #elif [[ ${#entry} == 8  && ${entry} =~ [a-z0-9] ]]; then
        #    :
        ## ... but throw away entries of branches that have already been deleted
        #elif [[ ! ${active_branches[@]} =~ ${entry} ]]; then
        #    rm -r $entry
        fi
    done
