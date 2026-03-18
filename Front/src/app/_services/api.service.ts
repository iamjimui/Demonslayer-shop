import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL_API = environment.URL_API;

  //Variable qui concerne nos informations personnelles
  me: any = [];

  //Variable pour obtenir tous les utilisateurs (seulement Admin)
  users: any = [];

  singleProduct: any = [];

  //Variable pour avoir tous les produits
  products: any = [];

  //Variable pour les produits d'un utilisateur
  myProducts: any = [];

  //Variable pour avoir toutes les tailles d'un produit
  allProductSizes: any = [];

  //Variable pour avoir tous les types de produit
  allProductTypes: any = [];

  //Variable pour avoir les commandes d'un utilisateur
  orders: any = [];

  commentsOfProduct: any = [];

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  cleanPage() {
    this.products = [];
    this.myProducts = [];
    this.orders = [];
    this.allProductSizes = [];
    this.allProductTypes = [];
  }

  getMe(token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.URL_API+'/me', {headers: headers}).subscribe(res => {
      this.me = res;
    })
  }

  getUsers() {
    const headers = new HttpHeaders({
      'Content-Type':'application/json'
    });
    return this.http.get(this.URL_API+'/users', {headers: headers}).subscribe(res => {
      this.users = res;
    })
  }

  getSingleProduct(productId) {
    return this.http.get(this.URL_API+'/product/' + productId).subscribe(res => {
      this.singleProduct = res;
    })
  }

  getProducts() {
    return this.http.get(this.URL_API+'/products').subscribe(res => {
      this.products = res;
    })
  }

  updateUser(updateUser, username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(this.URL_API+'/user/' + username, JSON.stringify(updateUser), {headers: headers}).subscribe(res => {
      this.getUsers();
    })
  }

  updateMe(updateUser, username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(this.URL_API+'/user/' + username, JSON.stringify(updateUser), {headers: headers}).subscribe(res => {
      this.cookieService.deleteCookie();
      const msgToken : any = res;
      console.log(msgToken);
      const token = JSON.parse(window.atob(msgToken.token.split('.')[1]));
      const exp = token.exp;
      const iat = token.iat;
      var duration = exp - iat;
      this.cookieService.createCookie(msgToken, duration);
      this.cookieService.setCredentials();
      this.getMe(this.cookieService.getToken());
    })
  }

  updateUserProfilePicture(fileFormData, username, token) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.URL_API+'/picture/' + username, fileFormData, {headers: headers}).subscribe(res => {
      console.log(res);
      this.getMe(token);
    })
  }

  deleteUser(username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete(this.URL_API+'/user/' + username, {headers: headers}).subscribe(res => {
      console.log(res);
      this.getUsers();
    });
  }

  getProductSizes() {
    return this.http.get(this.URL_API+'/productSizes').subscribe(res => {
      this.allProductSizes = res;
    })
  }

  getProductTypes() {
    return this.http.get(this.URL_API+'/productTypes').subscribe(res => {
      this.allProductTypes = res;
    })
  }

  getMyProducts(username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.URL_API+'/products/'+username, {headers: headers}).subscribe(res => {
      this.orders = [];
      this.myProducts = res;
    })
  }

  addProduct(addProduct, username, token) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.URL_API+'/product/create', addProduct, {headers: headers}).subscribe(res => {
      this.getMyProducts(username, token);
    })
  }

  addProductWithoutImage(addProductWithoutImage, username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.URL_API+'/product/createWithNoImage', JSON.stringify(addProductWithoutImage), {headers: headers}).subscribe(res => {
      this.getMyProducts(username, token);
    })
  }

  updateProduct(updateProduct, username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(this.URL_API+'/product/' + updateProduct._id, JSON.stringify(updateProduct), {headers: headers}).subscribe(res => {
      this.getMyProducts(username, token);
    })
  }

  deleteProduct(productId, username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete(this.URL_API+'/product/' + productId, {headers: headers}).subscribe(res => {
      this.getMyProducts(username, token);
    })
  }

  getOrders(username, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.URL_API+'/orders/'+username, {headers: headers}).subscribe(res => {
      this.myProducts = [];
      this.orders = res;
    });
  }

  sendComment(newComment, productId, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.URL_API+'/comment/' + productId, JSON.stringify(newComment), {headers: headers}).subscribe(res => {
      this.commentsOfProduct = res;
      this.getSingleProduct(productId);
    });
  }

  getComments(productId) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json'
    });
    return this.http.get(this.URL_API+'/comments/product/' + productId, {headers: headers}).subscribe(res => {
      this.commentsOfProduct = res;
    });
  }

  updateComment() {

  }

  deleteComment(commentId, productId, token) {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete(this.URL_API+'/comment/'+ commentId, {headers: headers}).subscribe(res => {
      this.commentsOfProduct = res;
      this.getSingleProduct(productId);
    });
  }
}
