#!/bin/bash
set -ev

#-------------------------------------------------------------------------------
# Choose the repo
#-------------------------------------------------------------------------------
export JHIPSTER_REPO=https://github.com/jhipster/generator-jhipster.git
export JHIPSTER_BRANCH=master
export IONIC4J_REPO=https://github.com/${TRAVIS_PULL_REQUEST_SLUG:-$TRAVIS_REPO_SLUG}.git
export IONIC4J_BRANCH=$BRANCH
echo $IONIC4J_REPO
echo $IONIC4J_BRANCH

#-------------------------------------------------------------------------------
# Clone JHipster
#-------------------------------------------------------------------------------
cd "$HOME"
git clone $JHIPSTER_REPO generator-jhipster
cd generator-jhipster
if [ "$JHIPSTER_BRANCH" == "latest" ]; then
    LATEST=$(git describe --abbrev=0)
    git checkout -b $LATEST $LATEST
elif [ "$JHIPSTER_BRANCH" != "master" ]; then
    git checkout -b $JHIPSTER_BRANCH origin/$JHIPSTER_BRANCH
fi
git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
npm link

#-------------------------------------------------------------------------------
# Clone Ionic for JHipster
#-------------------------------------------------------------------------------
cd "$HOME"
git clone $IONIC4J_REPO generator-jhipster-ionic
cd generator-jhipster-ionic
if [ "$IONIC4J_BRANCH" == "latest" ]; then
    LATEST=$(git describe --abbrev=0)
    git checkout -b $LATEST $LATEST
elif [ "$IONIC4J_BRANCH" != "master" ]; then
    git checkout -b $IONIC4J_BRANCH origin/$IONIC4J_BRANCH
fi
git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
npm link
