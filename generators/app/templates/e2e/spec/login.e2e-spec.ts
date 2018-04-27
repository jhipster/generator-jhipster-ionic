import { browser, by, element, ExpectedConditions as ec, protractor } from 'protractor';
import { LoginPage } from '../pages/login.po';

describe('Login', () => {

    let loginPage;

    beforeAll(() => {
        loginPage = new LoginPage();
        loginPage.navigateTo('/');
        browser.waitForAngular();
    });

    it('should show a login button', () => {
        expect(loginPage.getHeader()).toMatch(/Welcome, Java Hipster/);
        expect(loginPage.loginButton.isPresent());
    });

    it('should fail to login with bad password', () => {
        loginPage.login('admin', 'foo');
        <%_ if (authenticationType !== 'oauth2') { _%>
        const error = element(by.css('.toast-message'));
        browser.wait(ec.visibilityOf(error)).then(() => {
            error.getText().then((value) => {
                expect(value).toMatch(/Unable to sign in/);
            });
        });
        <%_ } else { _%>
        // Keycloak
        const alert = element.all(by.css('.alert-error'));
        alert.isPresent().then((result) => {
            if (result) {
                expect(alert.first().getText()).toMatch('Invalid username or password.');
            } else {
                // Okta
                const error = element.all(by.css('.infobox-error')).first();
                browser.wait(ec.visibilityOf(error), 2000).then(() => {
                    expect(error.getText()).toMatch('Sign in failed!');
                });
            }
        });
        <%_ } _%>
    });

    it('should login successfully with admin account', () => {
        loginPage.clearUserName();
        loginPage.setUserName('admin'); // use process.env.E2E_USERNAME if you want to use env variables
        loginPage.clearPassword();
        loginPage.setPassword('admin');
        loginPage.loginButton.click();

        browser.waitForAngular();
        browser.driver.sleep(500);

        const welcome = /Welcome, Admin<% if (authenticationType === 'jwt') { %>istrator<% } %>/;
        browser.wait(ec.visibilityOf(loginPage.logoutButton), 10000).then(() => {
            <%_ if (authenticationType === 'oauth2') { _%>
            expect(element.all(by.css('ion-title')).get(2).getText()).toMatch(welcome);
            <%_ } else { _%>
            expect(element.all(by.css('ion-title')).get(3).getText()).toMatch(welcome);
            <%_ } _%>
        });
    });

    it('should logout successfully', () => {
        loginPage.logout();
        browser.wait(ec.urlContains('/#/welcome'), 2000);
        expect(loginPage.signInButton.isPresent());
    })
});
