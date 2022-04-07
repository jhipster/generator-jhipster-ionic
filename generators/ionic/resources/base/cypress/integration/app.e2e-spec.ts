import { Page } from '../fixtures/app.po';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have the correct title', () => {
      page.getTitle().should('include', 'Ionic App');
    });
  });
});
