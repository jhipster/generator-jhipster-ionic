# Ionic for JHipster

> A JHipster Blueprint that generates an Ionic Client

[![NPM version][npm-image]][npm-url]
[![Generator][github-generator-image]][github-generator-url]
[![Integration Test][github-integration-image]][github-integration-url]

## Introduction

This is a [JHipster](http://www.jhipster.tech/) blueprint. You can use it to generate an Ionic app that talks to a JHipster backend.

## Installation

To install or update this blueprint:

```bash
npm install -g generator-jhipster-ionic
```

To update this module:

```bash
npm update -g generator-jhipster-ionic
```

## Usage

Create a JHipster app using `jhipster`, or a backend-only with `jhipster --skip-client`. Choose `JWT` or `OAuth 2.0` as the authentication type.

Create a directory alongside your JHipster app, and run `jhipster-ionic` in it.

```bash
- jhipster-app
- ionic-app
```

You can also create a JHipster app and an Ionic app at the same time using the following command:

```bash
jhipster jdl bug-tracker.jh --blueprints ionic
```

For available options, you can run:

```bash
jhipster-ionic app --help
```

## Add PWA Support

To add PWA support to your Ionic app, run:

```shell
ng add @angular/pwa
```

Watch [use the Angular CLI to transform your Ionic app into a PWA](https://youtu.be/ooKvtmobyPw) to learn more.

# Pre-release

To use an unreleased version, install it using npm + git repository.

```bash
npm install -g jhipster/generator-jhipster-native
jhipster-native --skip-jhipster-dependencies
```

# Updated (or pre-release) generator-jhipster

This blueprint embeds a compatible generator-jhipster version, but it's possible to use an updated generator-jhipster by running the `jhipster` cli with `blueprints` option instead of the builtin `jhipster-native`, like:

```bash
npm install -g jhipster@latest
jhipster --blueprints native
```

## Contributing

Please read our [guidelines](/CONTRIBUTING.md#submitting-an-issue) before submitting an issue. If your issue is a bug, please use the bug template pre populated [here](https://github.com/jhipster/generator-jhipster-ionic/issues/new). For feature requests and queries you can use [this template][feature-template].

## License

Apache 2.0, see [LICENSE](LICENSE).

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-native.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-native
[github-generator-image]: https://github.com/jhipster/generator-jhipster-ionic/actions/workflows/generator.yml/badge.svg
[github-generator-url]: https://github.com/jhipster/generator-jhipster-ionic/actions/workflows/generator.yml
[github-integration-image]: https://github.com/jhipster/generator-jhipster-ionic/actions/workflows/ionic.yml/badge.svg
[github-integration-url]: https://github.com/jhipster/generator-jhipster-ionic/actions/workflows/ionic.yml
[feature-template]: https://github.com/jhipster/generator-jhipster-ionic/issues/new?body=*%20**Overview%20of%20the%20request**%0A%0A%3C!--%20what%20is%20the%20query%20or%20request%20--%3E%0A%0A*%20**Motivation%20for%20or%20Use%20Case**%20%0A%0A%3C!--%20explain%20why%20this%20is%20a%20required%20for%20you%20--%3E%0A%0A%0A*%20**Browsers%20and%20Operating%20System**%20%0A%0A%3C!--%20is%20this%20a%20problem%20with%20all%20browsers%20or%20only%20IE8%3F%20--%3E%0A%0A%0A*%20**Related%20issues**%20%0A%0A%3C!--%20has%20a%20similar%20issue%20been%20reported%20before%3F%20--%3E%0A%0A*%20**Suggest%20a%20Fix**%20%0A%0A%3C!--%20if%20you%20can%27t%20fix%20this%20yourself%2C%20perhaps%20you%20can%20point%20to%20what%20might%20be%0A%20%20causing%20the%20problem%20(line%20of%20code%20or%20commit)%20--%3E
