import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  credentials: any = undefined;
  constructor() { }

  createCookie(msgToken, duration: number) {
    var date = new Date();
    date.setTime(date.getTime()+((duration/60)*60*1000));
    var expires = "; expires="+date.toString();
    document.cookie = "token=" + (msgToken.token || '{}')  + expires +"; SameSite=strict; path=/";
    this.setCredentialsAfterLogin();
  }

  getToken() {
    if (document.cookie) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; token=`);
      if (parts.length === 2) {
        const token = parts.pop()?.split(';').shift();
        return token;
      }
    }
    this.credentials = undefined;
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return undefined;
  }
  
  setCredentials() {
    if (this.getToken() !== "" && this.getToken() !== undefined) {
      const token = this.getToken();
      this.credentials = JSON.parse(window.atob(token!.split('.')[1]));
    } else {
      this.credentials = undefined;
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  setCredentialsAfterLogin() {
    if (this.getToken() !== "" && this.getToken() !== undefined) {
      const token = this.getToken();
      this.credentials = JSON.parse(window.atob(token!.split('.')[1]));
      window.location.reload();
    } else {
      this.credentials = undefined;
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  deleteCookie() {
    if (this.credentials) {
      this.credentials = undefined;
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}
