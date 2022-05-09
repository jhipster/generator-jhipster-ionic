# An Ionic Client for JHipster 🤓

> Because Ionic Apps need some JHipster 💙 too!

<div>
    <a href="https://ionicframework.com"><img src="src/assets/img/ionic-logo.png" alt="Ionic" width="250"></a>
    <a href="http://www.jhipster.tech"><img src="src/assets/img/jhipster-logo.png" alt="JHipster" width="68"></a>
</div>

## Table of Contents

1. [Getting Started](#getting-started)
2. [Run on iOS](#run-on-ios)
3. [Run on Android](#run-on-android)
4. [Use OpenID Connect for Authentication](#use-openid-connect-for-authentication) { Keycloak, Okta, or Auth0 }
5. [Services](#services)
6. [i18n](#i18n) (adding languages)
7. [Testing](#testing)

## Getting Started

To run this app:

```
npm install
# start the backend manually or run `npm run backend:start`
npm start
```

## Run on iOS

Generate a native iOS project with the following commands:

```
npx ionic build
npx ionic capacitor add ios
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
      <string>dev.localhost.ionic</string>
      <string>com.okta.dev-737523</string>
    </array>
  </dict>
</array>
```

Then, run your project using the Capacitor CLI:

```
npx cap run ios
```

### Modify CORS Settings in JHipster

In order to communicate with your JHipster app, you'll need to modify its CORS settings (in `src/main/resources/config/application-dev.yml`) to allow `capacitor://localhost` as an origin.

To run your app in iOS Simulator with hot-reload, run:

```
npx cap run ios -l --external
```

You will need to modify your JHipster app to allow your external IP as a trusted origin for this to work!

You can also open your project in Xcode and configure code signing.

```
npx cap open ios
```

Then, run your app from Xcode.

## Run on Android

Generate a native project with the following commands:

```
npx ionic build
npx ionic capacitor add android
```

Add your custom scheme in `android/app/src/main/AndroidManifest.xml` to use `dev.localhost.ionic` or your reverse domain name:

```xml
<activity ...>
  <!-- You'll need to add this intent filter so redirects work -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="dev.localhost.ionic" />
  </intent-filter>
  
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
</activity>
```

Then, run your project using the Capacitor CLI:

```
npx cap run android
```

### Modify CORS Settings in JHipster

In order to communicate with your JHipster app, you'll need to modify its CORS settings (in `src/main/resources/config/application-dev.yml`) to allow `http://localhost` as an origin.

To run your app in iOS Simulator with hot-reload, run:

```
npx cap run android -l --external
```

You will need to modify your JHipster app to allow your external IP as a trusted origin for this to work!

You can also open your project in Android Studio and run your app.

```
npx cap open android
```

You'll need to run a couple commands to allow the emulator to communicate with JHipster (and Keycloak if you're using OIDC for authentication).

```
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
```

If you see `java.io.IOException: Cleartext HTTP traffic to localhost not permitted` in your Android Studio console, enable clear text traffic in `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    ...
    android:usesCleartextTraffic="true">
```

See [this Stack Overflow Q&A](https://stackoverflow.com/questions/45940861/android-8-cleartext-http-traffic-not-permitted) for more information.

## Use OpenID Connect for Authentication

Choosing OAuth 2.0 / OIDC for authentication will allow you to use Keycloak or Okta for identity. In theory, you should be able to use any OIDC-compliant identity provider, and these are the only ones we've tested against. JHipster ships with Keycloak configured and ready to go by default. You simply have to start it in your JHipster backend.

```bash
docker-compose -f src/main/docker/keycloak up -d
```

### Use Okta

See [JHipster's Okta Guide](https://www.jhipster.tech/security/#okta) to see how to configure JHipster for Okta. In addition to having an OIDC app for your JHipster backend, you'll need to [create a Native app on Okta](https://www.jhipster.tech/security/#create-native-app-okta) too.

### Use Auth0

See [JHipster's Auth0 Guide](https://www.jhipster.tech/security/#auth0) to see how to configure JHipster for Auth0. In addition to having an OIDC app for your JHipster backend, you'll need to [create a Native app on Auth0](https://www.jhipster.tech/security/#create-native-app-auth0) too.

## Services

A generated Ionic for JHipster app comes with some basic implementations of common services.

### User

The `User` service is used to authenticate users through its `login(accountInfo)` and `signup(accountInfo)` methods, which perform `POST` requests to an API endpoint that you will need to configure.

### Api

The `ApiService` is a simple CRUD frontend to an API.

## i18n

This app comes with internationalization (i18n) out of the box with [ngx-translate](https://github.com/ngx-translate/core). This makes it easy to change the text used in the app by modifying only one file.

### Adding Languages

To add new languages, add new files to the `src/assets/i18n` directory, following the pattern of LANGCODE.json where LANGCODE is the language/locale  code (ex: en/gb/de/es/etc.).

## Testing

There are a number of scripts in `package.json` you can use to run tests:

```json
"e2e": "ng e2e",
"e2e:ci": "ng run app:cypress-headless",
"e2e:open": "ng run app:cypress-open",
...
"test": "ng test --coverage",
"test:watch": "ng test --watch",
"cypress:open": "cypress open",
"cypress:run": "cypress run"
```

### Unit Tests

[Jest](https://facebook.github.io/jest/) is used as the unit test runner in this project. Jest is a complete and easy to set-up JavaScript testing solution created by Facebook. Some of its benefits are:

- Fast and sandboxed
- Built-in code coverage reports
- Zero configuration

To run all your unit tests:

```bash
npm test
```

A test coverage report will be created at `public/coverage/lcov-report/index.html`.

Daniel created Ionic Mocks with Jest Support by forking the [ionic-mocks](https://github.com/stonelasley/ionic-mocks) ionic-mock repository. There are still some issues. Feel free to help him out with his [ionic-mocks-jest](https://github.com/danielsogl/ionic-mocks-jest) repository.

If you want to add ionic-native mocks you should definitely check out Chris Griffith's [ionic-native-mocks](https://github.com/chrisgriffith/ionic-native-mocks) repository

See a unit test example at [`src/app/app.component.spec.ts`](src/app/app.component.spec.ts).

### E2E Tests

The end-to-end (E2E) tests are powered by [Cypress](https://cypress.io).

Add your tests in the `cypress/integration` folder.

See the example end-to-end test in [`cypress/integration/app.e2e-spec.ts`](cypress/integration/app.e2e-spec.ts).

To run the e2e tests:

```bash
npm run e2e
```
