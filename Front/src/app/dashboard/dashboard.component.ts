import { ApiService } from '../_services/api.service';
import { CookieService } from '../_services/cookie.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  clicked : boolean = false;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  constructor(public router: Router, public apiService: ApiService, public cookieService: CookieService) {}
  
  ngOnInit() {
    this.apiService.getMe(this.cookieService.getToken());
  }

  uploadImage() {
    var fileFormData: any = new FormData();
    fileFormData.set('image', this.fileInput);
    this.apiService.updateUserProfilePicture(fileFormData, this.cookieService.credentials.username, this.cookieService.getToken());
  }

  onChange(event) {
    this.fileInput = event.target.files[0];
  }

  updateCredentials(event) {
    var updateUser = {
      username: event.target.username.value,
      role: event.target.role.value,
      adresse: event.target.adresse.value,
      email: event.target.email.value,
      currencies: event.target.currencies.value,
      old_password: event.target.old_password.value,
      new_password: null
    }
    if (event.target.new_password.value) {
      updateUser = {
        username: event.target.username.value,
        role: event.target.role.value,
        adresse: event.target.adresse.value,
        email: event.target.email.value,
        currencies: event.target.currencies.value,
        old_password: event.target.old_password.value,
        new_password: event.target.new_password.value
      }
    }
    this.apiService.updateMe(updateUser, this.cookieService.credentials.username, this.cookieService.getToken());
  }

  changePageToProductManagement() {
    this.router.navigate(['dashboard/product-management']);
  }

  changePageToOrders() {
    this.router.navigate(['dashboard/orders']);
  }
}
