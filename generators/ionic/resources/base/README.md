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
4. [Use Okta for Authentication](#use-okta-for-authentication)
5. [Use Auth0 for Authentication](#use-auth0-for-authentication)
6. [Services](#services)
8. [i18n](#i18n) (adding languages)
9. [Testing](#testing)

## Getting Started

To run this app:

```
npm install
# start the backend manually or run `npm run backend:start`
npm start # or run `ionic serve`
```

## Run on iOS

Generate a native iOS project with the following commands:

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

## Use Okta for Authentication

Choosing OAuth 2.0 / OIDC for authentication will allow you to use Keycloak or Okta for identity. In theory, you should be able to use any OIDC-compliant identity provider, and these are the only ones we've tested against. JHipster ships with Keycloak configured and ready to go by default. You simply have to start it in your JHipster backend.

```bash
docker-compose -f src/main/docker/keycloak up -d
```

See [JHipster's security docs](https://www.jhipster.tech/security/#-oauth2-and-openid-connect) to see how to configure JHipster for Okta.

**NEW:** You can use the [Okta CLI](https://github.com/oktadev/okta-cli) to add JHipster integration in seconds! After running `okta register`, run `okta apps create jhipster`. Then, source the created `.okta.env` file and start your app.

```shell
source .okta.env
./gradlew # or ./mvnw
```

In addition to having a OIDC app for your JHipster backend, you'll need to create a Native app on Okta too.

### Create a Native Application in Okta

Run `okta apps create`. Select the default app name, or change it as you see fit. Choose **Native** and press **Enter**.

Change the Redirect URI to `[http://localhost:8100/callback,dev.localhost.ionic:/callback]` and the Logout Redirect URI to `[http://localhost:8100/logout,dev.localhost.ionic:/logout]`.

**NOTE:** `dev.localhost.ionic` is the default scheme, but you can also use something more traditional like `com.okta.dev-133337` (where `dev-133337.okta.com` is your Okta Org URL). If you change it, be sure to update the `scheme` in `src/environments/environment.ts` and the redirect URLs in `src/app/auth/factories/auth.factory.ts`.

The Okta CLI will create an OIDC App in your Okta Org. It will add the redirect URIs you specified and grant access to the Everyone group.

```shell
Okta application configuration:
Issuer:    https://dev-133337.okta.com/oauth2/default
Client ID: 0oab8eb55Kb9jdMIr5d6
```

**NOTE**: You can also use the Okta Admin Console to create your app. See [Create a Native App](https://developer.okta.com/docs/guides/sign-into-mobile-app/create-okta-application/) for more information.

Open `ionic/src/app/auth/auth-config.service.ts` and add the client ID from your Native app. For example:

```ts
environment.oidcConfig.server_host = this.authConfig.issuer;
environment.oidcConfig.client_id = '<your-client-id>';
```

You'll also need to add a trusted origin for `http://localhost:8100`. In your Okta Admin Console, go to **Security** > **API** > **Trusted Origins** > **Add Origin**. Use the following values:

- Name: `http://localhost:8100`
- Origin URL: `http://localhost:8100`
- Type: Check **both** CORS and Redirect

Click **Save**.

### Add Claims to Access Token

In order to authentication successfully with your Ionic app, you have to do a bit more configuration in Okta. Since the Ionic client will only send an access token to JHipster, you need to 1) add a `groups` claim to the access token and 2) add a couple more claims so the user's name will be available in JHipster.

**NOTE:** These steps are not necessary if you're using a version of JHipster with [a `CustomClaimConverter`](https://github.com/jhipster/generator-jhipster/pull/12609). In other words, if you're using Spring a MVC-based monolith, you don't need it. Support has not been added to WebFlux, yet.

Navigate to **Security** > **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the **default** one. Click the **Claims** tab and **Add Claim**. Name it "groups" and include it in the Access Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`. Click **Create**.

Add another claim, name it `given_name`, include it in the access token, use `Expression` in the value type, and set the value to `user.firstName`. Optionally, include it in the `profile` scope. Perform the same actions to create a `family_name` claim and use expression `user.lastName`.

## Use Auth0 for Authentication

1. Log in to your Auth0 account (or https://auth0.com/signup[sign up] if you don't have an account). You should have a unique domain like `dev-xxx.us.auth0.com`.

2. Press the *Create Application* button in https://manage.auth0.com/#/applications[Applications section]. Use a name like `Ionic Rocks!`, select `Regular Web Applications`, and click *Create*.

3. Switch to the *Settings* tab and configure your application settings:
    - Allowed Callback URLs: `http://localhost:8080/login/oauth2/code/oidc`
    - Allowed Logout URLs: `http://localhost:8080/`

4. Scroll to the bottom and click *Save Changes*.

5. In the [roles](https://manage.auth0.com/#/roles) section, create new roles named `ROLE_ADMIN` and `ROLE_USER`.

6. Create a new user account in the https://manage.auth0.com/#/users[users] section. Click on the *Role* tab to assign the roles you just created to the new account.

    _Make sure your new user's email is verified before attempting to log in!_

7. Next, head to *Auth Pipeline* > *Rules* > *Create*. Select the `Empty rule` template. Provide a meaningful name like `Group claims` and replace the Script content with the following.

    ```js
    function(user, context, callback) {
      user.preferred_username = user.email;
      const roles = (context.authorization || {}).roles;
    
      function prepareCustomClaimKey(claim) {
        return `https://www.jhipster.tech/${claim}`;
      }
    
      const rolesClaim = prepareCustomClaimKey('roles');
    
      if (context.idToken) {
        context.idToken[rolesClaim] = roles;
      }
    
      if (context.accessToken) {
        context.accessToken[rolesClaim] = roles;
      }
    
      callback(null, user, context);
    }
    ```

    This code is adding the user's roles to a custom claim (prefixed with `https://www.jhipster.tech/roles`). This claim is mapped to Spring Security authorities in `SecurityUtils.java`.

8. Click **Save changes** to continue.

9. Create a `backend/.auth0.env` file and populate it with your Auth0 settings.

    ```
    export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER_URI=https://<your-auth0-domain>/
    export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_ID=<your-client-id>
    export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_SECRET=<your-client-secret>
    export JHIPSTER_SECURITY_OAUTH2_AUDIENCE=https://<your-auth0-domain>/api/v2/
   ```

    You can use the default `Auth0 Management API` audience value from the *Applications* > *API* > *API Audience* field. You can also define your own custom API and use the identifier as the API audience.

### Create a Native OIDC App

1. For Ionic, create a **Native** app and add the following Allowed Callback URLs:

   ```
   http://localhost:8100/callback,dev.localhost.ionic:/callback
   ```

2. Set the Allowed Logout URLs to:

    ```
    http://localhost:8100/logout,dev.localhost.ionic:/logout
   ```

3. Set the Allowed Origins (CORS):

    ```
    http://localhost:8100 
    # todo: is capacitor://localhost needed?
    ```

4. Update `ionic/src/app/auth/auth-config.service.ts` to use the generated client ID:

    ```ts
    environment.oidcConfig.server_host = this.authConfig.issuer;
    environment.oidcConfig.client_id = 'Dz7Oc9Zv9onjUBsdC55wReC4ifGMlA7G';
    ```

5. Update `environment.ts` to specify your audience.

    ```ts
    export const environment = {
      ...
      oidcConfig: {
        ...
        audience: 'https://<your-auth0-domain>/api/v2/'
      },
      ...
    };
    ```

6. Restart your Ionic app and log in with Auth0!

    ```
    npx cap run ios
    ```

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

This starter borrows its testing infrastructure from Daniel Sogl's [Ionic Super Starter](https://github.com/danielsogl/ionic-super-starter). Thanks Daniel!

### Usage

There are a number of scripts in `package.json` you can use to run tests:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:ci": "jest --runInBand",
"test:coverage": "jest --coverage",
"e2e": "ng e2e --port 8100"
```

### Unit Tests

[Jest](https://facebook.github.io/jest/) is used as the unit test runner in this project. Jest is a complete and easy to set-up JavaScript testing solution created by Facebook. Some of its benefits are:

- Fast and sandboxed
- Built-in code coverage reports
- Zero configuration

**NOTE:** If you'd like to convert your project so you can run `ng test` to run your tests, see [Angular CLI: "ng test" with Jest in 3 minutes](https://codeburst.io/angular-6-ng-test-with-jest-in-3-minutes-b1fe5ed3417c).

To run a unit test you have three options.

1. Run `npm test` runs all your created unit-tests
2. Run `npm run test:ci` if you want to run the unit-tests with you favorite CI
3. To create a test-coverage report you can run `npm run test:coverage`

Daniel created Ionic Mocks with Jest Support by forking the [ionic-mocks](https://github.com/stonelasley/ionic-mocks) ionic-mock repository. There are still some issues. Feel free to help him out with his [ionic-mocks-jest](https://github.com/danielsogl/ionic-mocks-jest) repository.

If you want to add ionic-native mocks you should definitely check out Chris Griffith's [ionic-native-mocks](https://github.com/chrisgriffith/ionic-native-mocks) repository

See the unit test example at [`src/app/app.component.spec.ts`](src/app/app.component.spec.ts).

### E2E Tests

The E2E test configuration is from the official [ionic-unit-testing-example](https://github.com/ionic-team/ionic-unit-testing-example) repository. The e2e folder structure has been changed a bit.

```
/e2e
  - pages
  - spec
```

Add your pages into the `/pages` folder and your tests into the `/spec` folder.

See the example end-to-end test in [`e2e/spec/app.e2e-spec.ts`](e2e/spec/app.e2e-spec.ts).

To run the e2e tests:

```bash
npm run e2e
```
