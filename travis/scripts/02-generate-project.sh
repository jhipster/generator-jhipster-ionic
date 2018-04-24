#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Force no insight
#-------------------------------------------------------------------------------
mkdir -p "$HOME"/.config/configstore/
mv "$JHIPSTER_TRAVIS"/configstore/*.json "$HOME"/.config/configstore/

#-------------------------------------------------------------------------------
# Generate the project with yo jhipster
#-------------------------------------------------------------------------------

mkdir -p "$APP_FOLDER"
mv -f "$JHIPSTER_SAMPLES"/"$JHIPSTER"/.yo-rc.json "$APP_FOLDER"/
cd "$APP_FOLDER"
npm link generator-jhipster
# Generate the project
jhipster --force --no-insight --with-entities
ls -al "$APP_FOLDER"

#-------------------------------------------------------------------------------
# Generate an Ionic app with yo jhipster-ionic
#-------------------------------------------------------------------------------
cd "$HOME"
yo jhipster-ionic default --force --no-insight

