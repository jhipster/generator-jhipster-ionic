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
cp -f "$JHIPSTER_SAMPLES"/"$JHIPSTER"/.yo-rc.json "$APP_FOLDER"/
cd "$APP_FOLDER"
jhipster --force --no-insight --skip-checks --with-entities --skip-git --skip-commit-hook
ls -al "$APP_FOLDER"

#-------------------------------------------------------------------------------
# Generate an Ionic app with yo jhipster-ionic
#-------------------------------------------------------------------------------
cd "$HOME"
yo jhipster-ionic default --force --no-insight
ls -al "$IONIC_FOLDER"

