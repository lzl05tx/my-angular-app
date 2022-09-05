import { Component, ViewEncapsulation } from '@angular/core';

/**
 * 首页
 *
 * @export
 * @class HomeComponent
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  value: any;
  UserName:string = "";

  // items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  constructor() {

  }

  ngOnInit() {
    var User_Account = localStorage.getItem("User_Account")
    if(User_Account){
      this.UserName = JSON.parse(User_Account).Email;
    }
  }
}
