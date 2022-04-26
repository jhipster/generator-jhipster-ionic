export class Page {
  pageSeletor: string;

  back() {
    cy.get(`${this.pageSeletor} ion-back-button`).click();
  }

  getPageTitle() {
    return cy.get(`${this.pageSeletor} ion-title`).should('be.visible');
  }
}
