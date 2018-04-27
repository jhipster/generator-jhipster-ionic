#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Launch Ionic for JHipster tests
#-------------------------------------------------------------------------------
cd "$TRAVIS_BUILD_DIR"
npm i
npm test

#-------------------------------------------------------------------------------
# Launch JHipster tests
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
if [ -f "mvnw" ]; then
    ./mvnw -q test \
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
