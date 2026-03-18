import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:http/http.dart' as http;
import '../pages/login.dart';

class SignupController {

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController adresseController = TextEditingController();
  
  Future registerUser(BuildContext context) async {
    var url = '${dotenv.env['URL_API']}/register';
    debugPrint(url);
    var response = await http.post(Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": usernameController.text,
          "password": passwordController.text,
          "role": 1,
          "email": emailController.text,
          "adresse": adresseController.text
        }));
    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);

      // ignore: use_build_context_synchronously
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const Login()),
      );
    } else {
      debugPrint(response.body);
    }
  }
}
