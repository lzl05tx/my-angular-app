import { UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { environment } from '../../environments/environment';
import { UntypedFormBuilder } from '@angular/forms';
import { XMessageService } from '@ng-nest/ui/message';
import cloudbase from "@cloudbase/js-sdk";
const app = cloudbase.init({
  env: "reward-wall-sys-3g10xtceb7153f73"
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  // 登录的loding
  loading: boolean = false;

  userForm: UntypedFormGroup = this.formBuilder.group({
    account: [],
    password: []
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public formBuilder: UntypedFormBuilder,
    public message: XMessageService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  // 登录
  login() {
    if (this.loading == false) {
      let user = this.userForm.value;
      if (user.account && user.password) {
        this.loading = true;
        app
          .auth({
            persistence: 'local'
          }).signInWithEmailAndPassword(user.account, user.password).then((loginState) => {
            // 邮箱密码登录成功
            console.log(loginState);
            this.loading = false;
            if (loginState.user) {//登录成功
              this.message.success('登录成功!');
              this.authService.loginTest(user).subscribe(
                () => {
                  if (this.authService.isLoggedIn) {
                    // let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : `/${environment.layout}`;
                    // this.router.navigate([redirect]);
                    this.router.navigate(['/index']);
                  }
                },
                () => {
                  this.loading = false;
                },
                () => {
                  this.loading = false;
                }
              );
            }
          })
          .catch((error) => {
            this.loading = false;
            console.log("登录失败=========" + error);
            this.message.warning('登录失败，请联系管理员解决!');
          });


        // .signUpWithEmailAndPassword(user.account, user.password)
        // .then(() => {
        //   // 发送验证邮件成功
        //   this.message.warning('账户激活邮件已发送到您的邮箱!');
        // });


      } else {
        this.loading = false;
        this.message.warning('用户名或密码不能为空！');
      }
    }
  }
}
