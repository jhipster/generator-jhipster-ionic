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

  setInputValue(formControlName: string, value: string) {
    cy.get(`${this.pageSeletor} ion-input[formControlName="${formControlName}"] input`).type(value);
  }

  setDateTime(formControlName: string, value: string) {
    // cy.get(`${this.pageSeletor} ion-datetime[formControlName="${formControlName}"] input`).type(value);
  }

  setDate(formControlName: string, value: string) {
    // cy.get(`${this.pageSeletor} ion-datetime[formControlName="${formControlName}"] input`).type(value);
  }

  setTextAreaContent(formControlName: string, value: string) {
    cy.get(`${this.pageSeletor} ion-textarea[formControlName="${formControlName}"] textarea`).type(value);
  }

  setBoolean(formControlName: string, value: string) {
    cy.get(`${this.pageSeletor} ion-checkbox[formControlName="${formControlName}"] checkbox`).click();
  }

  setBlob(formControlName: string, value: string) {
    // cy.get(`${this.pageSeletor} ion-datetime[formControlName="${formControlName}"] input`).type(value);
  }

  select(formControlName: string, value: string) {
    cy.get(`${this.pageSeletor} ion-select[formControlName="${formControlName}"]`).click();
    cy.get('ion-alert div.alert-radio-group button').contains(value).first().click();
    cy.get('ion-alert div.alert-button-group button:not(.alert-button-role-cancel)').click();
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
