import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CookieService } from '../_services/cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(public router: Router, public apiService: ApiService, public cookieService: CookieService) {}
  
  ngOnInit() {
    this.apiService.getOrders(this.cookieService.credentials.username, this.cookieService.getToken());
  }

  changePageToDashboard() {
    this.router.navigate(['dashboard']);
  }

  changePageToProductManagement() {
    this.router.navigate(['dashboard/product-management']);
  }

  changeArrowIcon(i) {
    var arrowState = document.getElementsByClassName('fa-solid')[i];
    if (arrowState.classList.contains('fa-angles-down')) {
      arrowState.classList.remove('fa-angles-down');
      arrowState.classList.add('fa-angles-up');
    } else {
      arrowState.classList.remove('fa-angles-up');
      arrowState.classList.add('fa-angles-down');
    }
  }
}

