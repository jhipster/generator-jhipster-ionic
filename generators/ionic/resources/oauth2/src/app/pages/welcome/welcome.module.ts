import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WelcomePage } from './welcome.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [WelcomePage],
})
export class WelcomePageModule {}
