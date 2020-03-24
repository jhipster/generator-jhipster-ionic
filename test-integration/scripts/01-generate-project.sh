#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Force no insight
#-------------------------------------------------------------------------------
if [ "$APP_FOLDER" == "$HOME/backend" ]; then
    mkdir -p "$HOME"/.config/configstore/
    cp "$JHIPSTER_TRAVIS"/configstore/*.json "$HOME"/.config/configstore/
fi

#-------------------------------------------------------------------------------
# Generate the project with jhipster
#-------------------------------------------------------------------------------
mkdir -p "$APP_FOLDER"
cp -f "$JHIPSTER_SAMPLES"/"$JHIPSTER".jdl "$APP_FOLDER"/
cd "$APP_FOLDER"
jhipster import-jdl "$JHIPSTER".jdl --force --no-insight --skip-checks --skip-git --skip-commit-hook --skip-install

#-------------------------------------------------------------------------------
# Generate an Ionic app with yo jhipster-ionic
#-------------------------------------------------------------------------------
cd "$HOME"
yo jhipster-ionic default --force --no-insight
cd "$IONIC_FOLDER"
yo jhipster-ionic:import-jdl "$APP_FOLDER"/"$JHIPSTER".jdl

