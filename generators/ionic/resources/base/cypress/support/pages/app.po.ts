export class Page {
  pageSelector: string;

  back() {
    cy.get(`${this.pageSelector} ion-back-button`).click();
  }

  getPageTitle() {
    return cy.get(`${this.pageSelector} ion-title`).should('be.visible');
  }
}
