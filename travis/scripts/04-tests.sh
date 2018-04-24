#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Launch tests
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
if [ -f "mvnw" ]; then
    ./mvnw test \
        -Dlogging.level.io.github.jhipster.sample=ERROR \
        -Dlogging.level.io.github.jhipster.travis=ERROR
elif [ -f "gradlew" ]; then
    ./gradlew test \
        -Dlogging.level.io.github.jhipster.sample=ERROR \
        -Dlogging.level.io.github.jhipster.travis=ERROR
fi

#-------------------------------------------------------------------------------
# Launch Ionic tests
#-------------------------------------------------------------------------------
cd "$IONIC_FOLDER"
npm test
npm e2e
