import { Page } from './app.po';

export class EntityComponentsPage extends Page {
  clickOnCreateButton() {
    cy.get(`${this.pageSelector} ion-fab-button`).click();
  }
}

export class EntityUpdatePage extends Page {
  save() {
    cy.get(`${this.pageSelector} ion-buttons[slot="end"] ion-button`).click();
  }

  setInputValue(formControlName: string, value: string) {
    cy.get(`${this.pageSelector} ion-input[formControlName="${formControlName}"] input`).type(value);
  }

  setDateTime(formControlName: string, value: string) {
    // cy.get(`${this.pageSelector} ion-datetime[formControlName="${formControlName}"] input`).type(value);
  }

  setDate(formControlName: string, value: string) {
    // cy.get(`${this.pageSelector} ion-datetime[formControlName="${formControlName}"] input`).type(value);
  }

  setTextAreaContent(formControlName: string, value: string) {
    cy.get(`${this.pageSelector} ion-textarea[formControlName="${formControlName}"] textarea`).type(value);
  }

  setBoolean(formControlName: string, value: string) {
    cy.get(`${this.pageSelector} ion-checkbox[formControlName="${formControlName}"] checkbox`).click();
  }

  setBlob(inputName: string, fileName: string) {
    const mimeType = 'image/png';
    cy.fixture('integration-test.png')
      .as('image')
      .get(`${this.pageSelector} input[data-cy="${inputName}"]`)
      .then(function (el) {
        const blob = Cypress.Blob.base64StringToBlob(this.image, mimeType);
        const file = new File([blob], fileName, { type: mimeType });
        const list = new DataTransfer();
        list.items.add(file);
        const myFileList = list.files;
        (el[0] as HTMLInputElement).files = myFileList;
        el[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
  }

  select(formControlName: string, value: string) {
    cy.get(`${this.pageSelector} ion-select[formControlName="${formControlName}"]`).click();
    cy.get('ion-alert div.alert-radio-group button').contains(value).first().click();
    cy.get('ion-alert div.alert-button-group button:not(.alert-button-role-cancel)').click();
  }

  takePhoto(fieldName: string) {
    cy.get(`${this.pageSelector} ion-button[data-cy="${fieldName}-take-photo"]`).click();
    const getPwaCamera = () => cy.get('pwa-camera-modal-instance').shadow().find('pwa-camera').shadow();
    getPwaCamera().find('.shutter-button').should('be.visible');
    cy.wait(200);
    getPwaCamera().find('.shutter-button').click();
    getPwaCamera().find('.accept-use').should('be.visible').click();
  }
}

export class EntityDetailPage extends Page {
  edit() {
    cy.get(`${this.pageSelector} ion-button[color="primary"]`).click();
  }

  delete() {
    cy.get(`${this.pageSelector} ion-button[color="danger"]`).click();
  }
}
