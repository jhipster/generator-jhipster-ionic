describe('App', () => {
  describe('default screen', () => {
    it('should have the correct title', () => {
      cy.visit('/');
      cy.title().should('include', 'Ionic App');
    });
  });
});
