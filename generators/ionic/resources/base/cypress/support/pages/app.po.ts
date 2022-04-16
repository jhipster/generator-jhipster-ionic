export class Page {
  navigateTo(destination) {
    return cy.visit(destination);
  }

  getTitle() {
    return cy.title();
  }
}
