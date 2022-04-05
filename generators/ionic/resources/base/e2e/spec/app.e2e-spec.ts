import { Page } from '../pages/app.po';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(async () => {
      await page.navigateTo('/');
    });

    it('should have the correct title', async () => {
      expect(await page.getTitle()).toEqual('Ionic App');
    });
  });
});
