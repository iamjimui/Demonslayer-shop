import { Component, OnInit } from '@angular/core';
import { CookieService } from '../_services/cookie.service';
import { ApiService } from '../_services/api.service';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  URL_FRONT = environment.URL_FRONT;
  path = window.location.pathname;
  pageName = this.path.split("/").pop();

  constructor(public apiService: ApiService, public cartService: CartService, public cookieService: CookieService, public router: Router) {}

  ngOnInit() {
    this.cartService.getNumberOfItems();
    this.cookieService.setCredentials();
    if (!this.cookieService.getToken()) {
      if (this.pageName !== 'home' && this.pageName !== 'cart' && this.pageName !== 'signup' && this.pageName !== 'login' && !this.path.startsWith('/product/')) {
        this.router.navigate(['login']);
      }
    } else {
      this.apiService.getMe(this.cookieService.getToken());
      const myself = this.cookieService.credentials;
      if (myself.role !== 2) {
        if (this.pageName === 'login'
        || this.pageName === 'signup'
        || this.pageName === 'admin-management') {
          this.router.navigate(['home']);
        }
      }
    }
  }

  logout() {
    this.cookieService.deleteCookie();
    window.location.reload();
  }
}
