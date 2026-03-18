import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CookieService } from '../_services/cookie.service';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  constructor(public apiService: ApiService, public cookieService: CookieService) {}

  ngOnInit() {
    this.apiService.getUsers();
    this.apiService.getProductTypes();
    this.apiService.getProductSizes();
  }

  checkProducts(username) {
    this.apiService.getMyProducts(username, this.cookieService.getToken());
  }

  checkOrders(username) {
    this.apiService.getOrders(username, this.cookieService.getToken());
  }

  updateProductForm(event) {
    event.preventDefault();
    var arrayProductWithSizes : Array<String> = [];
      for (let i = 0; i < event.target.productSizes.length; i++) {
        if (event.target.productSizes[i].checked){
          arrayProductWithSizes.push(event.target.productSizes[i].value);
        }
      }
      const updateProduct = {
        _id: event.target._id.value,
        name: event.target.name.value,
        description: event.target.description.value,
        price: parseFloat(event.target.price.value),
        image: event.target.productImage.value,
        productTypeId: event.target.productTypeId.value,
        productWithSizes: arrayProductWithSizes
      }
      this.apiService.updateProduct(updateProduct, this.cookieService.credentials.username, this.cookieService.getToken());
      document.querySelector(".modal-backdrop")?.remove();
  }

  deleteProduct(productId) {
    this.apiService.deleteProduct(productId, this.cookieService.credentials.username, this.cookieService.getToken());
  }

  updateUserForm(event) {
    event.preventDefault();
    const updateUser = {
      _id: event.target._id.value,
      username: event.target.username.value,
      role: parseInt(event.target.role.value),
      email: event.target.email.value,
      adresse: event.target.adresse.value,
      currencies: parseFloat(event.target.currencies.value)
    }
    this.apiService.updateUser(updateUser, event.target.username.value, this.cookieService.getToken());
    document.querySelector(".modal-backdrop")?.remove();
  }

  deleteUser(username) {
    this.apiService.deleteUser(username, this.cookieService.getToken());
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
