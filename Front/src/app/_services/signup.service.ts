import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  URL_API = environment.URL_API;
  constructor(private http: HttpClient) { }

  signup(msgRegister, formData) {
    const headers = new HttpHeaders().set('Content-Type','application/json');
    this.http
      .post(this.URL_API+'/register', JSON.stringify(Object.fromEntries(formData)), {headers: headers})
      .subscribe(res => {
        msgRegister = res;
        console.log(msgRegister);
      });
  }
}
