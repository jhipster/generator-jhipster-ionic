# Ionic for JHipster
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A JHipster Module that generates an Ionic Client

# Introduction

This is a [JHipster](http://www.jhipster.tech/) module. You can use it to generate an Ionic app that talks to a JHipster backend. It uses the [Ionic JHipster Starter](https://github.com/oktadeveloper/ionic-jhipster-starter) as a base template, then applies functionality (e.g. entity generation) on top of it. 

To learn more about this module, see [Use Ionic for JHipster to Create Mobile Apps with OIDC Authentication](https://developer.okta.com/blog/2018/01/30/jhipster-ionic-with-oidc-authentication).

# Prerequisites

As this is a [JHipster](http://www.jhipster.tech/) module, we expect you to have an existing JHipster app and Ionic already installed.

- [Installing JHipster](https://www.jhipster.tech/installation.html)
- [Installing Ionic](https://ionicframework.com/docs/intro/installation/)

Or simply:

```bash
npm i -g generator-jhipster ionic
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

Create a JHipster app using `yo jhipster`, or a backend-only with `yo jhipster:server`. Choose `JWT` or `OAuth 2.0` as the authentication type. 

In a directory alongside your JHipster app, run this module. This will create an Ionic app for you and install the necessary JHipster files for it to communicate with the backend.

```bash
yo jhipster-ionic
```

# Entity Generator

To generate entities, run `yo jhipster-ionic:entity <name>`.

# Testing

You can run unit tests with:

```
npm test
```

And e2e tests with:

```
npm run build --prod && npm run e2e
```

See the [testing section](https://github.com/oktadeveloper/ionic-jhipster-starter#testing) of the Ionic JHipster Starter for more information.

# Contributing

Please read our [guidelines](/CONTRIBUTING.md#submitting-an-issue) before submitting an issue. If your issue is a bug, please use the bug template pre populated [here](https://github.com/jhipster/generator-jhipster-ionic/issues/new). For feature requests and queries you can use [this template][feature-template].

# License

Apache-2.0 © [Okta](https://developer.okta.com)

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-ionic.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-ionic
[travis-image]: https://travis-ci.org/oktadeveloper/generator-jhipster-ionic.svg?branch=master
[travis-url]: https://travis-ci.org/oktadeveloper/generator-jhipster-ionic
[daviddm-image]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic
[feature-template]: https://github.com/oktadeveloper/generator-jhipster-ionic/issues/new?body=*%20**Overview%20of%20the%20request**%0A%0A%3C!--%20what%20is%20the%20query%20or%20request%20--%3E%0A%0A*%20**Motivation%20for%20or%20Use%20Case**%20%0A%0A%3C!--%20explain%20why%20this%20is%20a%20required%20for%20you%20--%3E%0A%0A%0A*%20**Browsers%20and%20Operating%20System**%20%0A%0A%3C!--%20is%20this%20a%20problem%20with%20all%20browsers%20or%20only%20IE8%3F%20--%3E%0A%0A%0A*%20**Related%20issues**%20%0A%0A%3C!--%20has%20a%20similar%20issue%20been%20reported%20before%3F%20--%3E%0A%0A*%20**Suggest%20a%20Fix**%20%0A%0A%3C!--%20if%20you%20can%27t%20fix%20this%20yourself%2C%20perhaps%20you%20can%20point%20to%20what%20might%20be%0A%20%20causing%20the%20problem%20(line%20of%20code%20or%20commit)%20--%3E
