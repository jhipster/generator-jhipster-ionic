#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Check all versions
#-------------------------------------------------------------------------------
java -version
git --version
node -v
npm -v
yo --version
docker version
docker-compose version
ionic --version
ionic4j --version
