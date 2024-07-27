import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private menu: MenuController) {}

  disableScroll() {
    document.body.classList.add('no-scroll');
  }

  enableScroll() {
    document.body.classList.remove('no-scroll');
  }
}
