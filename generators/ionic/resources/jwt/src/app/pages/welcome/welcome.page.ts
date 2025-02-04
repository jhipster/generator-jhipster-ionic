import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from '#app/services/auth/account.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
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
