import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from '../_services/cookie.service';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msgToken: any;
  form: FormGroup;
  constructor (public fb: FormBuilder, public loginService: LoginService, public cookieService: CookieService) {
    this.form = this.fb.group({
      username: [''],
      password: ['']
    });
    this.msgToken = {
      success: [''],
      token: ['']
    };
  }
  ngOnInit() {
  }
  submitForm() {
    var formData: any = new FormData();
    formData.append('username', this.form.get('username')?.value);
    formData.append('password', this.form.get('password')?.value);
    this.loginService.login(formData, this.msgToken, this.cookieService);
  }
}
