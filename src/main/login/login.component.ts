import { UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
// import { environment } from '../../environments/environment';
import { UntypedFormBuilder } from '@angular/forms';
import { XMessageService } from '@ng-nest/ui/message';
import cloudbase from "@cloudbase/js-sdk";
const app = cloudbase.init({
  env: "reward-wall-sys-3g10xtceb7153f73"
});

const auth = app
  .auth({
    persistence: 'local'
  })
const db = app.database();

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

  showLoginTips:boolean = false;
  loginTips:string="";
  tipsType:string="tips-warning"
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
        if(!this.validateAccountPass(user.password)){
          this.loginTips = "密码长度为8-16位，且必须为字母和数字组合"
          this.showLoginTips = true;
          this.tipsType = "tips-warning";
          return;
        }
        this.loading = true;
        auth.signUpWithEmailAndPassword(user.account, user.password)
          .then(() => {
            // 发送验证邮件成功
            this.message.success('账户激活邮件已发送到您的邮箱!');
            this.loginTips = "*账户激活链接已发送到您的邮箱，请前往邮箱点击链接激活账户！"
            this.showLoginTips = true;
            this.tipsType = "tips-success";
          }).catch((error) => {
            console.log("错误=======" + error)
            if ((error+"").includes("mail user exist")) {
              auth.signInWithEmailAndPassword(user.account, user.password).then((loginState) => {
                  // 邮箱密码登录成功
                  console.log(loginState);
                  this.loading = false;
                  if (loginState.user) {//登录成功
                    db.collection("Users")
                      .where({
                        Email: user.account
                      })
                      .get()
                      .then((res) => {
                        console.log(res.data);
                        if (res.data) {
                          if (res.data.length > 0) {//本地库中有此用户
                            this.loginSkip(user);
                          } else {//本地库中没有此用户
                            this.message.warning("请联系管理员为您添加账号！");
                          }
                        }
                      });


                    this.message.success('登录成功!');

                  }
                })
                .catch((error) => {
                  this.loading = false;
                  console.log("登录失败=========" + error);
                  this.message.warning('登录失败，请联系管理员解决!');
                });
            }
          });


      } else {
        this.loading = false;
        this.message.warning('用户名或密码不能为空！');
      }
    }
  }


  loginSkip(user: User) {
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

  /**
   * 验证密码规则
   */

   validateAccountPass(pass:string) {
    var passRegex = new RegExp( "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$");
    return passRegex.test(pass);
}

}
