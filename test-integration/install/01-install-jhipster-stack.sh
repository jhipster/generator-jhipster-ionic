#!/bin/bash
set -ev

#-------------------------------------------------------------------------------
# Choose the repo
#-------------------------------------------------------------------------------
export JHIPSTER_REPO=https://github.com/jhipster/generator-jhipster.git
export JHIPSTER_BRANCH=main
export IONIC4J_REPO=https://github.com/${GITHUB_REPOSITORY}.git
export IONIC4J_BRANCH=${GITHUB_REF#refs/heads/}
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
elif [ "$JHIPSTER_BRANCH" != "main" ]; then
    git checkout -b $JHIPSTER_BRANCH origin/$JHIPSTER_BRANCH
fi
git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
npm link

#-------------------------------------------------------------------------------
# Link Ionic
#-------------------------------------------------------------------------------
cd "$GITHUB_WORKSPACE"
npm link generator-jhipster
npm link
