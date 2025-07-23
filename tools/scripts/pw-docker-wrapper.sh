#!/bin/bash

# Check if --update-snapshots is in the arguments
UPDATE_SNAPSHOTS=""
ARGS=""

for arg in "$@"; do
    if [ "$arg" = "--update-snapshots" ]; then
        UPDATE_SNAPSHOTS="--update-snapshots"
    else
        ARGS="$ARGS $arg"
    fi
done

docker run --rm --ipc=host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.49.0-noble bash -c "cd /work && yarn test:pw $ARGS $UPDATE_SNAPSHOTS" 