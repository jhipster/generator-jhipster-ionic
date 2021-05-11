#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Force no insight
#-------------------------------------------------------------------------------
if [ "$HOME/$APP_FOLDER" == "$HOME/backend" ]; then
    mkdir -p "$HOME"/.config/configstore/
    cp "$JHI_GITHUB_CI"/configstore/*.json "$HOME"/.config/configstore/
fi

#-------------------------------------------------------------------------------
# Generate the project with jhipster
#-------------------------------------------------------------------------------
mkdir -p "$HOME/$APP_FOLDER"
cp -f "$JHIPSTER_SAMPLES"/"$JHIPSTER".jdl "$HOME/$APP_FOLDER"/
cd "$HOME/$APP_FOLDER"
# npm link generator-jhipster
jhipster import-jdl "$JHIPSTER".jdl --force --no-insight --skip-checks --skip-git --skip-commit-hook --skip-install

#-------------------------------------------------------------------------------
# Generate an Ionic app with ionic4j
#-------------------------------------------------------------------------------
cd "$HOME"
ionic4j --defaults --force --no-insight
cd "$HOME/$IONIC_FOLDER"
# to use the cloned generator-jhipster-ionic
npm link generator-jhipster-ionic
# Uncomment if you want to use the cloned generator-jhipster for generator-jhipster-ionic
# cd node_modules/generator-jhipster-ionic && npm link generator-jhipster
# cd ../..
ionic4j import-jdl "$HOME/$APP_FOLDER"/"$JHIPSTER".jdl --force

