

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class OrderController {

  Future<List?> getMyOrders() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Map<String, dynamic> decodedToken = JwtDecoder.decode(prefs.getString('token')!);
    var url = '${dotenv.env['URL_API']}/orders/${decodedToken['username']}';

    var response = await http.get(Uri.parse(url),
      headers: {"Content-Type": "application/json",
      "Authorization": "Bearer ${prefs.getString('token')}"},
    );
    
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint("Your orders have been found.");

      return json.decode(response.body);
    } else {
      debugPrint("Couldn't get your orders.");

      return null;
    }
  }
}