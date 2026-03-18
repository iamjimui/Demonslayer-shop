import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CartService } from '../_services/cart.service';
import { Product } from '../interfaces/product';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  URL_FRONT = environment.URL_FRONT;
  constructor(public apiService: ApiService, public cartService: CartService) {}
  ngOnInit() {
    this.apiService.getProducts();
  }
  submitForm(event: any) {
    event.preventDefault();
    if (event.target.productSize) {
      if (event.target.productSize.value) {
        const productSelected = event.target;
        var arrayProduct : Product = {
          _id: productSelected._id.value,
          userId: productSelected.userId.value,
          productTypeId: productSelected.productTypeId.value,
          name: productSelected.name.value,
          description: productSelected.description.value,
          price: parseFloat(productSelected.price.value),
          productPrice: parseFloat(productSelected.productPrice.value),
          image: productSelected.image.value,
          productSize: JSON.parse(productSelected.productSize.value),
          quantity: parseInt(productSelected.quantity.value)
        }
        event.target.reset();
        this.cartService.addToCart(arrayProduct);
      } else {
        console.log("Size of Product not selected.");
      }
    } else {
      console.log("No sizes for this product.")
    }
  }
}
