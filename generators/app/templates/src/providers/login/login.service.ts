import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Platform } from 'ionic-angular';

declare const window: any;

@Injectable()
export class LoginService {

    constructor(private oauthService: OAuthService, private platform: Platform) {}

    redirectLogin() {
        this.oauthService.initImplicitFlow();
    }

    appLogin(cb, fail) {
        return this.oauthLogin().then(success => {
            const idToken = success.id_token;
            const accessToken = success.access_token;
            const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
            this.oauthService.tryLogin({
                customHashFragment: keyValuePair,
                disableOAuth2StateCheck: true
            });
            const claims: any = this.oauthService.getIdentityClaims();
            // this.translate.use(account.langKey);
            return cb(claims);
        }, (error) => {
            return fail(error);
        });
    }

    oauthLogin(): Promise<any> {
        return this.oauthService.createAndSaveNonce().then(nonce => {
            let state: string = Math.floor(Math.random() * 1000000000).toString();
            if (window.crypto) {
                const array = new Uint32Array(1);
                window.crypto.getRandomValues(array);
                state = array.join().toString();
            }
            return new Promise((resolve, reject) => {
                const oauthUrl = this.buildUrl(state, nonce);
                const browser = window.cordova.InAppBrowser.open(oauthUrl, '_blank',
                    'location=no,clearsessioncache=yes,clearcache=yes');
                browser.addEventListener('loadstart', (event) => {
                    if ((event.url).indexOf('http://localhost:8100') === 0) {
                        browser.removeEventListener('exit', () => {
                        });
                        browser.close();
                        const responseParameters = ((event.url).split('#')[1]).split('&');
                        const parsedResponse = {};
                        for (let i = 0; i < responseParameters.length; i++) {
                            parsedResponse[responseParameters[i].split('=')[0]] =
                                responseParameters[i].split('=')[1];
                        }
                        const defaultError = 'Problem authenticating with OAuth';
                        if (parsedResponse['state'] !== state) {
                            reject(defaultError);
                        } else if (parsedResponse['access_token'] !== undefined &&
                            parsedResponse['access_token'] !== null) {
                            resolve(parsedResponse);
                        } else {
                            reject(defaultError);
                        }
                    }
                });
                browser.addEventListener('exit', function (event) {
                    reject('The OAuth sign in flow was canceled');
                });
            });
        });
    }

    buildUrl(state, nonce): string {
        return this.oauthService.loginUrl + '?' +
            'client_id=' + this.oauthService.clientId + '&' +
            'redirect_uri=' + this.oauthService.redirectUri + '&' +
            'response_type=id_token%20token&' +
            'scope=' + encodeURI(this.oauthService.scope) + '&' +
            'state=' + state + '&nonce=' + nonce;
    }

    logout() {
        if (this.platform.is('core')) {
            // do global logout when using browser
            this.oauthService.logOut();
        } else {
            // don't redirect to global logout in app
            this.oauthService.logOut(true);
        }
    }
}
