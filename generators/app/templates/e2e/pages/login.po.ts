import { browser, by, element } from 'protractor';
import { Page } from './app.po';

export class LoginPage extends Page {
    <%_ if (authenticationType === 'oauth2') { _%>
    username = element(by.name('username'));
    password = element(by.name('password'));
    // button on IdP sign-in form
    loginButton = element(by.css('input[type=submit]'));
    <%_ } else { _%>
    // todo: figure out why more than one element exists
    username = element.all(by.name('username')).get(1);
    password = element.all(by.name('password')).get(1);
    loginButton = element(by.id('login'));
    <%_ } _%>
    signInButton = element(by.id('signIn'));
    <%_ if (authenticationType === 'oauth2') { _%>
    logoutButton = element.all(by.id('logout')).get(1);
    <%_ } else { _%>
    logoutButton = element(by.id('logout'));
    <%_ } _%>
    header = element.all(by.css('ion-title')).get(1);

    getHeader() {
        return this.header.getText();
    }

    setUserName(username) {
        this.username.sendKeys(username);
    }

    getUserName() {
        return this.username.getAttribute('value');
    }

    clearUserName() {
        this.username.clear();
    }

    setPassword(password) {
        this.password.sendKeys(password);
    }

    getPassword() {
        return this.password.getAttribute('value');
    }

    clearPassword() {
        this.password.clear();
    }

    login(username: string, password: string) {
        this.signInButton.click();
        <%_ if (authenticationType === 'oauth2') { _%>
        // Entering non angular site, tell webdriver to switch to synchronous mode.
        browser.waitForAngularEnabled(false);
        this.username.isPresent().then(() => {
            this.username.sendKeys(username);
            this.password.sendKeys(password);
            this.loginButton.click();
        }).catch(error => {
            browser.waitForAngularEnabled(true);
        });
        <%_ } else { _%>
        this.setUserName(username);
        this.setPassword(password);
        browser.driver.sleep(500);
        this.loginButton.click();
        <%_ } _%>
    }

    logout() {
        return this.logoutButton.click();
    }
}
