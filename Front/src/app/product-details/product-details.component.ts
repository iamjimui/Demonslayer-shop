import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CartService } from '../_services/cart.service';
import { Product } from '../interfaces/product';
import { Comment } from '../interfaces/comment';
import { CookieService } from '../_services/cookie.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  clicked : boolean = false;
  path = window.location.pathname;
  productId = this.path.split("/").pop();

  constructor(public cookieService: CookieService, public apiService: ApiService, public cartService: CartService) {}
  
  ngOnInit() {
    this.apiService.getProducts();
    this.apiService.getSingleProduct(this.productId);
    this.apiService.getComments(this.productId);
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
      console.log("No sizes for this product.");
    }
  }

  defineRating(indexe) {
    const index = parseInt(indexe);
    var allRatingStars = document.getElementsByClassName('ratingStar');
    if(allRatingStars[index - 1].classList.contains("fa-solid")) {
      allRatingStars[index - 1].classList.remove("fa-solid");
      allRatingStars[index - 1].classList.add("fa-regular");
      for (let i = index; i < allRatingStars.length; i++) {
        allRatingStars[i].classList.remove("fa-solid");
        allRatingStars[i].classList.add("fa-regular");
      }
    } else {
      for (let i = 0; i < allRatingStars.length; i++) {
        allRatingStars[i].classList.add("fa-regular");
        allRatingStars[i].classList.remove("fa-solid");
      }
      for (let i = 0; i < index; i++) {
        allRatingStars[i].classList.add("fa-solid");
        allRatingStars[i].classList.remove("fa-regular");
      }
    }
  }

  submitComment(event) {
    event.preventDefault();
    var ratingValue = 0;
    var allRatingStars = document.getElementsByClassName('ratingStar');
    for (let i = 0; i < allRatingStars.length; i++) {
      if (allRatingStars[i].classList.contains('fa-solid')) {
        ratingValue += 1;
      }
    }
    const newComment : Comment = {
      comment: event.target.comment.value,
      rating: ratingValue
    }
    this.apiService.sendComment(newComment, this.productId, this.cookieService.getToken());
  }

  updateOrDeleteComment(event, commentId) {
    if (this.clicked) {
      
    } else {
      this.apiService.deleteComment(commentId, this.productId, this.cookieService.getToken());
    }
  }

  updateComment() {
    this.clicked = true;
  }

  deleteComment() {
    this.clicked = false;
  }
}
