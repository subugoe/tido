#!/bin/bash

# This script is resposible for determining which artifacts are too old to be
# kept any longer. The artifacts are needed and preserved for having the
# environments at hand any time.
#
# Currently artifacts are kept for two weeks since this is our average sprint
# duration.
#
# Some lines have been commented out since they don't work properly at the moment.
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
current_date_in_s=$(date -d "$current_date" "+%s")

cd public || exit

for entry in *
    do
        last_modified=$(date -r ${entry} "+%Y%m%d")
        last_modified_in_s=$(date -d ${last_modified} +%s)
        # difference in days
        diff=$(((current_date_in_s - last_modified_in_s) / (24*3600)))
        # preserve content of development branch except data that doesn't belong here...
        if [[ ${entry} = "develop" ]]; then
			cd develop || exit
			GLOBIGNORE="*.js:*.html"
			rm -rf -- *
			unset GLOBIGNORE
			cd ..
        # ... remove other entries that are older than 2 weeks ...
        elif [[ $diff -gt 14 ]]; then
            rm -r "$entry"
		# ... clean up other entries ...
		else
			cd "$entry" || exit
			GLOBIGNORE="*.js:*.html"
			rm -rf -- *
			unset GLOBIGNORE
			cd ..
        ## ... keep the single commit entries ...
        #elif [[ ${#entry} == 8  && ${entry} =~ [a-z0-9] ]]; then
        #    :
        ## ... but throw away entries of branches that have already been deleted
        #elif [[ ! ${active_branches[@]} =~ ${entry} ]]; then
        #    rm -r $entry
        fi
    done
