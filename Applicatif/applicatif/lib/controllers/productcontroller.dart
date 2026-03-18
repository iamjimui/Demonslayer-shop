import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../pages/home.dart';

class ProductController {
  late List? allProducts;
  late List? singleProduct;
  late List? singleProductSizes;
  late List? myProducts;

  TextEditingController nameController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  TextEditingController priceController = TextEditingController();
  
  Future<List?> getAllProducts() async {
    var url = '${dotenv.env['URL_API']}/products';

    var response = await http.get(Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint("All the products found.");

      allProducts = json.decode(response.body);
      return allProducts;
    } else {
      debugPrint("Couldn't get all products.");

      allProducts = null;

      return allProducts;
    }
  }

  Future<List?> getSingleProduct(String id) async {

    final url = '${dotenv.env['URL_API']}/product/$id';

    var response = await http.get(Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint("Product found.");

      singleProduct = json.decode(response.body);
      singleProductSizes = singleProduct?[0]['productSizes'];
      
      return singleProduct;
    } else {
      debugPrint("Couldn't get product.");

      singleProduct = null;
      singleProductSizes = null;

      return singleProduct;
    }
  }

  Future<List> getProductSizes() async {
    var url = '${dotenv.env['URL_API']}/productSizes/';

    var response = await http.get(Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );

    return json.decode(response.body);
  }

  Future<List> getProductTypes() async {
    var url = '${dotenv.env['URL_API']}/productTypes/';

    var response = await http.get(Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );

    return json.decode(response.body);
  }

  List? getSingleProductList() {
    return singleProduct;
  }

  List? getVariableAllProducts() {
    return allProducts;
  }

  List? getVariableMyProducts() {
    return myProducts;
  }

  List? getSingleProductSizes() {
    return singleProductSizes;
  }

  Future createProduct(context, selectedProductSizes, selectedProductTypeId) async {

    var url = '${dotenv.env['URL_API']}/product/createWithNoImage';

    Object newProduct = {
      "name" : nameController.text,
      "description" : descriptionController.text,
      "price" : double.parse(priceController.text),
      "productWithSizes" : selectedProductSizes,
      "productTypeId" : selectedProductTypeId
    };

    SharedPreferences prefs = await SharedPreferences.getInstance();

    var response = await http.post(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"
        },
        body: jsonEncode(newProduct)
    );

    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const Home()),
      );
    } else {
      debugPrint(response.body);
    }
  }

  Future<List?> getFutureMyProducts() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    Map<String, dynamic> decodedToken = JwtDecoder.decode(prefs.getString('token')!);

    var url = '${dotenv.env['URL_API']}/products/${decodedToken['username']}';

    var response = await http.get(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"
        }
    );

    if (response.statusCode == 200) {
      // ignore: avoid_print
      myProducts = json.decode(response.body);
      return json.decode(response.body);
    } else {
      debugPrint(response.body);
      myProducts = null;
      return null;
    }
  }

  Future deleteProduct(String productId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    var url = '${dotenv.env['URL_API']}/product/$productId';

    var response = await http.delete(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"
        }
    );

    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);
    } else {
      debugPrint(response.body);
    }
  }
}
