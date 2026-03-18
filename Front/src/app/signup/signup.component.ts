import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SignupService } from '../_services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  msgRegister: any;
  form: FormGroup;

  constructor (public signupService: SignupService, public fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      username: [''],
      password: [''],
      role: 1,
      email: [''],
      adresse: [''],
      image: null
    });
    this.msgRegister = {
      success: [''],
      message: ['']
    };
  }
  ngOnInit() {}
  submitForm() {
    var formData: any = new FormData();
    formData.append('username', this.form.get('username')?.value);
    formData.append('password', this.form.get('password')?.value);
    formData.append('role', this.form.get('role')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('adresse', this.form.get('adresse')?.value);
    this.signupService.signup(this.msgRegister, formData);
  }
}
