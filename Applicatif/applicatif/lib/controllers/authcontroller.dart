import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../pages/home.dart';
import '../pages/login.dart';

class AuthController {

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  
  Future loginUser(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var url = '${dotenv.env['URL_API']}/login';

    var response = await http.post(Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": usernameController.text,
          "password": passwordController.text,
        }));
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);

      var loginArr = json.decode(response.body);
      
      prefs.setString('token', loginArr['token']);

      // ignore: use_build_context_synchronously
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const Home()),
      );
      
    } else {
      debugPrint(response.body);
    }
  }

  Future<String?> getAuthToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    return token;
  }

  void logoutUser(BuildContext context) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove('token');
    // ignore: use_build_context_synchronously
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const Login()),
    );
    debugPrint('You disconnected.');
  }

  Future<Object?> getTokenCredentials() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    Map<String, dynamic> decodedToken = JwtDecoder.decode(token!);
    return decodedToken;
  }

  Future<Object?> getCredentials() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var url = '${dotenv.env['URL_API']}/me';

    var response = await http.get(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"
        }
    );
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);
      return jsonDecode(response.body);
    } else {
      debugPrint(response.body);
      return {};
    }
  }
}
