import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { OrderAndDetails } from '../interfaces/order-and-details';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  URL_API = environment.URL_API;
  products: any = [];
  nb: any = 0;
  totalprice: Number = 0;
  constructor(public cookieService: CookieService, private http: HttpClient) { }
  addToCart(product: Product) {
    if (localStorage.getItem('cart')) {
      var found = false;
      var lsArray : Array<Product> = JSON.parse(localStorage.getItem('cart') || '[]');
      for (let i = 0; i < lsArray.length; i++) {
        if (lsArray[i]._id === product._id
          && lsArray[i].userId === product.userId
          && lsArray[i].productTypeId === product.productTypeId
          && lsArray[i].name === product.name
          && lsArray[i].image === product.image
          && lsArray[i].productSize.name === product.productSize.name) {
            lsArray[i].quantity += 1;
            lsArray[i].price = product.productPrice * lsArray[i].quantity;
            found = true;
        }
      }
      if (!found) {
        lsArray.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(lsArray));
    } else {
      const stringifyLocalStorage = '[' + JSON.stringify(product) + ']';
      localStorage.setItem('cart', stringifyLocalStorage);
    }
    this.getNumberOfItems();
  }

  getItems() {
    if (localStorage.getItem('cart')) {
      const lsArray = localStorage.getItem('cart');
      this.products = JSON.parse(lsArray || '[]');
    } else {
      this.products = [];
    }
    this.getNumberOfItems();
    this.getTotalPrice();
  }

  getNumberOfItems() {
    if (localStorage.getItem('cart')) {
      const lsArray = localStorage.getItem('cart');
      this.products = JSON.parse(lsArray || '[]');
      this.nb = this.products.length;
    } else {
      this.nb = 0;
    }
  }

  clearCart() {
    if (localStorage.getItem('cart')) {
      localStorage.setItem('cart', '[]');
    }
  }

  incrementItem(indexOfProduct) {
    var lsArray = localStorage.getItem('cart');
    var lsArrayParse = JSON.parse(lsArray!);
    lsArrayParse[indexOfProduct].quantity += 1;
    lsArrayParse[indexOfProduct].price = lsArrayParse[indexOfProduct].productPrice * lsArrayParse[indexOfProduct].quantity;
    var roundedString = lsArrayParse[indexOfProduct].price.toFixed(2);
    lsArrayParse[indexOfProduct].price = Number(roundedString);
    const lsArrayStringify = JSON.stringify(lsArrayParse);
    localStorage.setItem('cart', lsArrayStringify);
    this.getItems();
  }

  decrementItem(indexOfProduct) {
    var lsArray = localStorage.getItem('cart');
    var lsArrayParse = JSON.parse(lsArray!);
    lsArrayParse[indexOfProduct].quantity -= 1;
    lsArrayParse[indexOfProduct].price = lsArrayParse[indexOfProduct].productPrice * lsArrayParse[indexOfProduct].quantity;
    var roundedString = lsArrayParse[indexOfProduct].price.toFixed(2);
    lsArrayParse[indexOfProduct].price = Number(roundedString);
    if (lsArrayParse[indexOfProduct].quantity <= 0) {
      lsArrayParse.splice(indexOfProduct, 1);
      const lsArrayStringify = JSON.stringify(lsArrayParse);
      localStorage.setItem('cart', lsArrayStringify);
    } else {
      const lsArrayStringify = JSON.stringify(lsArrayParse);
      localStorage.setItem('cart', lsArrayStringify);
    }
    this.getItems();
  }

  removeItem(indexOfProduct) {
    var lsArray = localStorage.getItem('cart');
    var lsArrayParse = JSON.parse(lsArray!);
    lsArrayParse.splice(indexOfProduct, 1);
    const lsArrayStringify = JSON.stringify(lsArrayParse);
    localStorage.setItem('cart', lsArrayStringify);
    this.getItems();
    this.getTotalPrice();
  }

  removeCart() {
    if (localStorage.getItem('cart')) {
      localStorage.removeItem('cart');
    }
  }

  getTotalPrice() {
    var totalPrice = 0;
    for (let i = 0; i < this.products.length; i++) {
      totalPrice += this.products[i].price;
    }
    var roundedString = totalPrice.toFixed(2);
    var rounded = Number(roundedString);
    this.totalprice = rounded;
  }

  submitForm(event: any) {
    event.preventDefault();
    var arrayProducts : OrderAndDetails = {
      totalPrice: parseFloat(event.target.totalPrice.value),
      products: []
    };
    if (event.target.name.length > 1) {
      for (let i = 0; i < event.target.name.length; i++) {
        const product : Product = {
          _id: event.target._id[i].value,
          userId: event.target.userId[i].value,
          productTypeId: event.target.productTypeId[i].value,
          name: event.target.name[i].value,
          description: event.target.description[i].value,
          price: parseFloat(event.target.price[i].value),
          productPrice: parseFloat(event.target.productPrice[i].value),
          image: event.target.image[i].value,
          productSize: JSON.parse(event.target.productSize[i].value),
          quantity: parseInt(event.target.quantity[i].value)
        }
        arrayProducts.products.push(product);
      }
    } else {
      const product : Product = {
        _id: event.target._id.value,
        userId: event.target.userId.value,
        productTypeId: event.target.productTypeId.value,
        name: event.target.name.value,
        description: event.target.description.value,
        price: parseFloat(event.target.price.value),
        productPrice: parseFloat(event.target.productPrice.value),
        image: event.target.image.value,
        productSize: event.target.productSize.value,
        quantity: parseInt(event.target.quantity.value)
      }
      arrayProducts.products.push(product);
    }
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + this.cookieService.getToken()
    });
    this.http
      .post(this.URL_API+'/orders', JSON.stringify(arrayProducts), {headers: headers})
      .subscribe(res => {
        this.clearCart();
        this.getItems();
        console.log(res);
      });
  }
}
