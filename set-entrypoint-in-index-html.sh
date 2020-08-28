#!/bin/bash

# During the development of the EMo viewer, we work with data from the Ahiqar project.
# The released version, however, should present test data with is stored and handled by a different
# back end.
# Therefore we have to make the entrypoint of the dependent on the branch we're currently on.

echo CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}

case ${CI_COMMIT_REF_NAME} in
"master")
  entrypoint="https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/3r9ps/collection.json"
  ;;
"develop")
  entrypoint="https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/3r9ps/collection.json"
  ;;
*)
  entrypoint="https://ahikar-test.sub.uni-goettingen.de/api/textapi/ahikar/3r9ps/collection.json"
  ;;
esac

filename="src/index.template.html"
sed -i "s,\$ENTRYPOINT,$entrypoint,g" "$filename"