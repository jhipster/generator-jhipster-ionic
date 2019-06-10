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
npm install -g generator-jhipster-ionic yo
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

# Okta for Authentication

If you choose OAuth 2.0 / OIDC for authentication, you can use Okta for authentication. See [JHipster's security docs](https://www.jhipster.tech/security/#-oauth2-and-openid-connect) to see how to configure JHipster for Okta. You should be able to use the same OIDC app for Ionic for JHipster. However, you'll need to add a few redirect URIs:

## Create an Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

From the **Applications** page, choose **Add Application**. On the Create New Application page, select **Native**. Give your app a memorable name, and configure it as follows:
 
* Login redirect URIs: 
  * `http://localhost:8100/implicit/callback`
  * `dev.localhost.ionic:/callback`
* Logout redirect URIs:
  * `http://localhost:8100/implicit/logout`
  * `dev.localhost.ionic:/logout`
  
**NOTE:** `dev.localhost.ionic` is the default scheme, but you can also use something more traditional like `com.okta.dev-737523` (where `dev-737523.okta.com` is your Okta Org URL). If you'd like to change it, be sure to update the `URL_SCHEME` in `package.json`.

```json
"cordova-plugin-customurlscheme": {
    "URL_SCHEME": "com.okta.dev-737523"
},
```

# iOS 

Generate a native project with the following command:

```
ionic cordova prepare ios
```

Open your project in Xcode, configure code signing, and run your app.

```
open platforms/ios/MyApp.xcworkspace
```

# Android

Generate a native project with the following command:

```
ionic cordova prepare android
```

Set the launchMode to `singleTask` so the URL does not trigger a new instance of the app in `platforms/android/app/src/main/AndroidManifest.xml`:

```xml
<activity
      android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
      android:name="com.mydomain.app.MainActivity"
      android:label="@string/title_activity_main"
      android:launchMode="singleTask"
      android:theme="@style/AppTheme.NoActionBarLaunch">
```

Open your project in Android Studio and run your app.

```
studio platforms/android
```

You'll need to run a couple commands to allow the emulator to communicate with your API and Keycloak.

```
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
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
