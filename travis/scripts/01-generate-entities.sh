#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Functions
#-------------------------------------------------------------------------------
moveEntity() {
    local entity="$1"
    cp "$JHIPSTER_SAMPLES"/.jhipster/"$entity".json "$APP_FOLDER"/.jhipster/
}

#-------------------------------------------------------------------------------
# Copy entities json
#-------------------------------------------------------------------------------

rm -Rf "$APP_FOLDER"
mkdir -p "$APP_FOLDER"/.jhipster/

    moveEntity Blog
    moveEntity Entry
    moveEntity Tag
    moveEntity Product

ls -l "$APP_FOLDER"/.jhipster/
