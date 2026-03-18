import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CartController {

  Map cartItems = {"totalPrice": 0, "products": []};

  void addProduct(List product, Object size) async {
    // debugPrint(product.toString());
    // debugPrint(size.toString());
    bool found = false;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('cart') == null) {
      await prefs.setString('cart', '{}');
    }

    cartItems = await jsonDecode(prefs.getString('cart')!);

    Object objectProduct = {
      "_id": product[0]['_id'],
      "userId": product[0]['userId'],
      "productTypeId": product[0]['productTypeId'],
      "name": product[0]['name'],
      "description": product[0]['description'],
      "price": product[0]['price'],
      "productPrice": product[0]['price'],
      "image": product[0]['image'],
      "productSize": size,
      "quantity": 1
    };

    final data = objectProduct as Map;

    for (int i = 0; i < cartItems['products'].length; i++) {
      if (cartItems['products'][i]['_id'] == data['_id']
          && cartItems['products'][i]['userId'] == data['userId']
          && cartItems['products'][i]['productTypeId'] == data['productTypeId']
          && cartItems['products'][i]['name'] == data['name']
          && cartItems['products'][i]['image'] == data['image']
          && cartItems['products'][i]['productSize']['name'] == data['productSize']['name']) {
            cartItems['products'][i]['quantity'] += 1;
            cartItems['products'][i]['price'] = double.parse(data['productPrice']) * int.parse(cartItems['products'][i]['quantity']);
            found = true;
        }
    }

    if (!found) {
      cartItems['products'].add(data);
    }
    double totalPrice = 0;
    for (int i = 0; i < cartItems['products'].length; i++) {
      totalPrice += cartItems['products'][i]['price'];
    }
    cartItems['totalPrice'] = totalPrice;
    await prefs.setString('cart', jsonEncode(cartItems).toString());

    debugPrint(prefs.getString('cart'));
  }

  Future<List> getCartItems() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    cartItems = await jsonDecode(prefs.getString('cart')!);
    return cartItems['products'];
  }

  void cleanCart() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('cart', '{"totalPrice": 0, "products": []}');
  }

  Future<List> removeProduct(int index) async {
    debugPrint(index.toString());
    SharedPreferences prefs = await SharedPreferences.getInstance();
    cartItems = await jsonDecode(prefs.getString('cart')!);
    cartItems['products'].removeAt(index);
    double totalPrice = 0;
    for (int i = 0; i < cartItems['products'].length; i++) {
      totalPrice += cartItems['products'][i]['price'];
    }
    cartItems['totalPrice'] = totalPrice;
    await prefs.setString('cart', jsonEncode(cartItems).toString());
    return cartItems['products'];
  }

  Future<double> getTotalPrice() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    cartItems = await jsonDecode(prefs.getString('cart')!);
    return cartItems['totalPrice'];
  }

  Future<List> checkout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var url = '${dotenv.env['URL_API']}/orders';

    var response = await http.post(Uri.parse(url),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${prefs.getString('token')}"
      },
      body: prefs.getString('cart')
    );
    
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);

      cartItems = {"totalPrice": 0, "products": []};

      await prefs.setString('cart', jsonEncode(cartItems).toString());

      return cartItems['products'];
    } else {
      debugPrint(response.body);

      return cartItems['products'];
    }
  }
}