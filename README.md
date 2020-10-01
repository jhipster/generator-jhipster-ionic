# Ionic for JHipster

[![NPM version][npm-image]][npm-url] [![Build Status][github-actions-image]][github-actions-url] [![Dependency Status][daviddm-image]][daviddm-url]

> A JHipster Module that generates an Ionic Client

## Introduction

This is a [JHipster](http://www.jhipster.tech/) module. You can use it to generate an Ionic app that talks to a JHipster backend. It uses the [Ionic JHipster Starter](https://github.com/oktadeveloper/ionic-jhipster-starter) as a base template, then applies functionality (e.g. entity generation) on top of it.

To learn more about this module, see [Build Mobile Apps with Angular, Ionic 4, and Spring Boot](https://developer.okta.com/blog/2019/06/24/ionic-4-angular-spring-boot-jhipster).

## Prerequisites

As this is a [JHipster](http://www.jhipster.tech/) module, we expect you to have an existing JHipster, Ionic, and Angular CLI already installed.

- [Install JHipster](https://www.jhipster.tech/installation/)
- [Install Ionic](https://ionicframework.com/docs/installation/cli)
- [Install Angular CLI](https://angular.io/cli)

Or just run:

```bash
npm i -g generator-jhipster @ionic/cli @angular/cli
```

## Installation

To install this module:

```bash
npm install -g generator-jhipster-ionic yo
```

To update this module:

```bash
npm update -g generator-jhipster-ionic
```

## Usage

Create a JHipster app using `jhipster`, or a backend-only with `yo jhipster:server`. Choose `JWT` or `OAuth 2.0` as the authentication type.

In a directory alongside your JHipster app, run this module. 

```bash
- jhipster-app
- ionic-app
```

The following command will create an Ionic app (and its directory) for you and install the necessary code for it to communicate with your JHipster backend.

```bash
yo jhipster-ionic
```

This module also ships with an `ionic4j` CLI that you can use as a shortcut.

- Use `ionic4j` to generate a new app
- `ionic4j entity <name>` generates entities
- `ionic4j import-jdl <file.jdl>` imports JDL and generates entities

### Okta for Authentication

Choosing OAuth 2.0 / OIDC for authentication will allow you to use Keycloak or Okta for identity. In theory, you should be able to use any OIDC-compliant identity provider, and these are the only ones we've tested against. JHipster ships with Keycloak configured and ready to go by default. You simply have to start it in your JHipster backend.

```bash
docker-compose -f src/main/docker/keycloak up -d
```

See [JHipster's security docs](https://www.jhipster.tech/security/#-oauth2-and-openid-connect) to see how to configure JHipster for Okta.

**NEW:** You can use the [Okta CLI](https://github.com/oktadeveloper/okta-cli) to add JHipster integration in seconds! After running `okta register`, run `okta apps create` and select `JHipster`. 

In addition to having a OIDC app for your JHipster backend, you'll need to create a Native app on Okta too.

#### Create a Native Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account). 

> You can also use the Okta CLI and run `okta apps create`, using the settings below to configure your app.

From the **Applications** page, choose **Add Application**. 

On the Create New Application page, select **Native**

Give your app a memorable name, and configure it as follows:

- Login redirect URIs:
  - `http://localhost:8100/callback`
  - `dev.localhost.ionic:/callback`
- Logout redirect URIs:
  - `http://localhost:8100/logout`
  - `dev.localhost.ionic:/logout`

**NOTE:** `dev.localhost.ionic` is the default scheme, but you can also use something more traditional like `com.okta.dev-737523` (where `dev-737523.okta.com` is your Okta Org URL). If you change it, be sure to update the `scheme` in `src/environments/environment.ts` and the redirect URLs in `src/app/auth/factories/auth.factory.ts`.

If you use the Okta CLI, your terminal should look similar to the following:

```
➜  ionic4j git:(master) okta apps create
Application name [ionic4j]:
Type of Application
(The Okta CLI only supports a subset of application types and properties):
> 1: Web
> 2: Single Page App
> 3: Native App (mobile)
> 4: Service (Machine-to-Machine)
Enter your choice [Web]: 3
Redirect URI
Common defaults:
 Reverse Domain name - com.okta.dev-737523:/callback
Enter your Redirect URI [com.okta.dev-737523:/callback]: dev.localhost.ionic:/callback,com.okta.dev-737523:/callback,http://localhost:8100/callback
Enter your Post Logout Redirect URI [dev.localhost.ionic:/]: dev.localhost.ionic:/logout,com.okta.dev-737523:/logout,http://localhost:8100/logout
Configuring a new OIDC Application, almost done:
Created OIDC application, client-id: 0oa5qrj3i7RKHeyZh357
```

Open `src/app/auth/auth-config.service.ts` in an editor, search for `this.authConfig.clientId` and replace it with the client ID from your Native app. For example:

```ts
environment.oidcConfig.server_host = this.authConfig.issuer;
environment.oidcConfig.client_id = '0oa5qrj3i7RKHeyZh357';
```

You'll also need to add a trusted origin for `http://localhost:8100`. In your Okta dashboard, go to **API** > **Trusted Origins** > **Add Origin**. Use the following values:

- Name: `http://localhost:8100`
- Origin URL: `http://localhost:8100`
- Type: Check **both** CORS and Redirect

Click **Save**.

#### Add Claims to Access Token

In order to authentication successfully with your Ionic app, you have to do a bit more configuration in Okta. Since the Ionic client will only send an access token to JHipster, you need to 1) add a `groups` claim to the access token and 2) add a couple more claims so the user's name will be available in JHipster.

**NOTE:** These steps will not be necessary if you're using a version of JHipster with [a `CustomClaimConverter`](https://github.com/jhipster/generator-jhipster/pull/12609).

Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the **default** one. Click the **Claims** tab and **Add Claim**. Name it "groups" and include it in the Access Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`. Click **Create**.

Add another claim, name it `given_name`, include it in the access token, use `Expression` in the value type, and set the value to `user.firstName`. Optionally, include it in the `profile` scope. Perform the same actions to create a `family_name` claim and use expression `user.lastName`.

### iOS

Generate a native project with the following commands:

```
ionic build
ionic capacitor add ios
```

Add your custom scheme to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.getcapacitor.capacitor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>capacitor</string>
      <string>com.okta.dev-737523</string>
      <string>dev.localhost.ionic</string>
    </array>
  </dict>
</array>
```

Open your project in Xcode and configure code signing.

```
npx cap open ios
```

Then, run your app from Xcode.

### Android

Generate a native project with the following commands:

```
ionic build
ionic capacitor add android
```

Change the custom scheme in `android/app/src/main/res/values/strings.xml` to use `dev.localhost.ionic` or your reverse domain name:

```xml
<string name="custom_url_scheme">com.okta.dev-737523</string>
```

The [SafariViewController Cordova Plugin](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) is installed as part of this project. Capacitor uses AndroidX dependencies, but the SafariViewController plugin uses an older non-AndroidX dependency. Use [jetifier](https://developer.android.com/studio/command-line/jetifier) to [patch usages of old support libraries](https://capacitorjs.com/docs/android/troubleshooting#error-package-android-support-does-not-exist) with the following commands:

```
npm install jetifier
npx jetify
npx cap sync android
```   

Then, open your project in Android Studio and run your app.

```
npx cap open android
```

You'll need to run a couple commands to allow the emulator to communicate with your API and Keycloak.

```
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
```

If you see `java.io.IOException: Cleartext HTTP traffic to localhost not permitted` in your Android Studio **Run** console, see [this Stack Overflow Q&A](https://stackoverflow.com/questions/45940861/android-8-cleartext-http-traffic-not-permitted). If that doesn't work, just use Okta (and its HTTP-by-default feature 😉).

### Entity Generator

To generate entities, run `ionic4j entity <name>` or `yo jhipster-ionic:entity <name>`.

### Import JDL

To import JDL, run `ionic4j import-jdl <entities.jdl>` or `yo jhipster-ionic:import-jdl <entities.jdl>`.

## Testing

You can run unit tests with:

```
npm test
```

See the [testing section](https://github.com/oktadeveloper/ionic-jhipster-starter#testing) of the Ionic JHipster Starter for more information.

## Contributing

Please read our [guidelines](/CONTRIBUTING.md#submitting-an-issue) before submitting an issue. If your issue is a bug, please use the bug template pre populated [here](https://github.com/jhipster/generator-jhipster-ionic/issues/new). For feature requests and queries you can use [this template][feature-template].

## License

Apache-2.0 © [Okta, Inc](https://developer.okta.com)

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-ionic.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-ionic
[github-actions-image]: https://github.com/oktadeveloper/generator-jhipster-ionic/workflows/Ionic/badge.svg
[github-actions-url]: https://github.com/oktadeveloper/generator-jhipster-ionic/actions
[daviddm-image]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/oktadeveloper/generator-jhipster-ionic
[feature-template]: https://github.com/oktadeveloper/generator-jhipster-ionic/issues/new?body=*%20**Overview%20of%20the%20request**%0A%0A%3C!--%20what%20is%20the%20query%20or%20request%20--%3E%0A%0A*%20**Motivation%20for%20or%20Use%20Case**%20%0A%0A%3C!--%20explain%20why%20this%20is%20a%20required%20for%20you%20--%3E%0A%0A%0A*%20**Browsers%20and%20Operating%20System**%20%0A%0A%3C!--%20is%20this%20a%20problem%20with%20all%20browsers%20or%20only%20IE8%3F%20--%3E%0A%0A%0A*%20**Related%20issues**%20%0A%0A%3C!--%20has%20a%20similar%20issue%20been%20reported%20before%3F%20--%3E%0A%0A*%20**Suggest%20a%20Fix**%20%0A%0A%3C!--%20if%20you%20can%27t%20fix%20this%20yourself%2C%20perhaps%20you%20can%20point%20to%20what%20might%20be%0A%20%20causing%20the%20problem%20(line%20of%20code%20or%20commit)%20--%3E
