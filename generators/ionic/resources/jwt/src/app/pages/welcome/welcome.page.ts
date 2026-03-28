import { Component, OnInit } from '@angular/core';
import { NavController, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '#app/services/auth/account.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink, TranslateModule],
})
export class WelcomePage implements OnInit {
  constructor(
    private accountService: AccountService,
    private navController: NavController,
  ) {}

  ngOnInit() {
    this.accountService.identity().then(account => {
      if (account) {
        this.navController.navigateRoot('/tabs');
      }
    });
  }
}
