import { Page } from './app.po';

export class EntityComponentsPage extends Page {
  clickOnCreateButton() {
    cy.get(`${this.pageSeletor } ion-fab-button`).click();
  }
}

export class EntityUpdatePage extends Page {
  save() {
    cy.get(`${this.pageSeletor} ion-buttons[slot="end"] ion-button`).click();
  }
}

export class EntityDetailPage extends Page {
  edit() {
    cy.get(`${this.pageSeletor } ion-button[color="primary"]`).click();
  }

  delete() {
    cy.get(`${this.pageSeletor } ion-button[color="danger"]`).click();
  }
}
