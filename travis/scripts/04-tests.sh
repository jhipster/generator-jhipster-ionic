#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Check Javadoc generation
#-------------------------------------------------------------------------------
# cd "$APP_FOLDER"
# if [ -f "mvnw" ]; then
#     ./mvnw javadoc:javadoc
# elif [ -f "gradlew" ]; then
#     ./gradlew javadoc
# fi

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

npm test

#-------------------------------------------------------------------------------
# Launch Ionic tests
#-------------------------------------------------------------------------------
cd "$IONIC_FOLDER"
npm test
npm e2e
