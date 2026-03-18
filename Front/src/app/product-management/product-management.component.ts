import { ApiService } from '../_services/api.service';
import { CookieService } from '../_services/cookie.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  clicked : boolean = false;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  constructor(public router: Router, public apiService: ApiService, public cookieService: CookieService) {}
  
  ngOnInit() {
    this.apiService.getMyProducts(this.cookieService.credentials.username, this.cookieService.getToken());
    this.apiService.getProductSizes();
    this.apiService.getProductTypes();
  }

  submitForm(event: any) {
    event.preventDefault();
    if (this.clicked) {
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
        productTypeId: event.target.productTypeId.value,
        productWithSizes: arrayProductWithSizes
      }
      this.apiService.updateProduct(updateProduct, this.cookieService.credentials.username, this.cookieService.getToken());
    } else {
      this.apiService.deleteProduct(event.target._id.value, this.cookieService.credentials.username, this.cookieService.getToken());
    }
  }

  updateProduct() {
    this.clicked = true;
  }

  deleteProduct() {
    this.clicked = false;
  }

  onChange(event) {
    this.fileInput = event.target.files[0];
  }

  addProduct(event: any) {
    var addProduct: any = new FormData();
    addProduct.append('image', this.fileInput);
    var arrayProductWithSizes : Array<String> = [];
    for (let i = 0; i < event.target.productSizes.length; i++) {
      if (event.target.productSizes[i].checked){
        arrayProductWithSizes.push(event.target.productSizes[i].value);
      }
    }
    const newProduct = {
      name: event.target.name.value,
      description: event.target.description.value,
      price: parseFloat(event.target.price.value),
      productTypeId: event.target.productTypeId.value,
      productWithSizes: arrayProductWithSizes
    }
    addProduct.append('data', JSON.stringify(newProduct));
    console.log(this.fileInput);
    if (!this.fileInput.nativeElement) {
      this.apiService.addProduct(addProduct, this.cookieService.credentials.username, this.cookieService.getToken());
      console.log('Creating Product with Image');
    } else {
      this.apiService.addProductWithoutImage(newProduct, this.cookieService.credentials.username, this.cookieService.getToken());
      console.log('Creating Product without Image');
    }
  }

  changePageToDashboard() {
    this.router.navigate(['dashboard']);
  }

  changePageToOrders() {
    this.router.navigate(['dashboard/orders']);
  }
}
