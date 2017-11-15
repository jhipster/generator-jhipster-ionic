# Ionic for JHipster
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A JHipster Module that generates an Ionic Client

# Introduction

This is a [JHipster](http://www.jhipster.tech/) module, that is meant to be used to generate an Ionic app that talks to a JHipster backend.

# Prerequisites

As this is a [JHipster](http://www.jhipster.tech/) module, we expect you to have an existing JHipster app and Ionic already installed.

- [Installing JHipster](https://www.jhipster.tech/installation.html)
- [Installing Ionic](https://ionicframework.com/docs/intro/installation/)

Or simply:

```bash
npm i -g generator-jhipster ionic cordova
```

# Installation

To install this module:

```bash
npm install -g generator-jhipster-ionic
```

To update this module:

```bash
npm update -g generator-jhipster-ionic
```

# Usage

Create a JHipster app using `yo jhipster`, or a backend-only with `yo jhipster:server`. Choose `JWT` as the authentication type since that's the only one supported at this time.

In a directory alongside your JHipster app, run this module. This will create an Ionic app for you and install the necessary JHipster files for it to communicate with the backend.

```bash
yo jhipster-ionic
```

# Entity Generator

To generate entities, run `yo jhispter-ionic:entity`. 

# License

Apache-2.0 © [Matt Raible](https://developer.okta.com)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-ionic.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-ionic
[travis-image]: https://travis-ci.org/oktadeveloper/generator-jhipster-ionic.svg?branch=master
[travis-url]: https://travis-ci.org/oktadeveloper/generator-jhipster-ionic
[daviddm-image]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic
