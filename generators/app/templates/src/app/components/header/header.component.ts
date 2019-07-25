
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/login/login.service';
import { NavController } from '@ionic/angular'; 
// todo replace by Router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  languages: any[];
  @Input() title: string;
  constructor(
    public loginService: LoginService,
    public navController: NavController,
    public translateServ: TranslateService) {
  }

  logout() {
    this.loginService.logout();
    this.navController.navigateBack('');
  }

}
