#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Check all versions
#-------------------------------------------------------------------------------
java -version
git --version
node -v
npm -v
docker version
docker-compose version
ionic --version
