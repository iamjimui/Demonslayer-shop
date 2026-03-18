import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL_API = environment.URL_API;
  constructor(private http: HttpClient) { }

  login(formData, msgToken, cookieService) {
    const headers = new HttpHeaders().set('Content-Type','application/json');
    this.http
      .post(this.URL_API+'/login', JSON.stringify(Object.fromEntries(formData)), {headers: headers})
      .subscribe(res => {
        msgToken = res;
        const token = JSON.parse(window.atob(msgToken.token.split('.')[1]));
        const exp = token.exp;
        const iat = token.iat;
        var duration = exp - iat;
        cookieService.createCookie(msgToken, duration);
      });
  }
}
