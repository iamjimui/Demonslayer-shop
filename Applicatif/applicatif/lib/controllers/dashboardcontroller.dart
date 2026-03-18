import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:applicatif/pages/dashboard.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class DashboardController {

  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController adresseController = TextEditingController();
  TextEditingController oldPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();

  Future updateUser(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    
    var url = '${dotenv.env['URL_API']}/me';

    var response = await http.get(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"
        }
    );
    debugPrint(response.body);

    var username = usernameController.text;
    var email = emailController.text;
    var adresse = adresseController.text;
    var oldPassword = oldPasswordController.text;
    var newPassword = newPasswordController.text;

    if (username == null || username == '') {
      username = json.decode(response.body)['username'];
    }
    if (email == null || email == '') {
      email = json.decode(response.body)['email'];
    }
    if (adresse == null || adresse == '') {
      adresse = json.decode(response.body)['adresse'];
    }

    Object updatedUser = {
      "username" : username,
      "email" : email,
      "adresse" : adresse,
      "old_password" : oldPassword,
      "role" : json.decode(response.body)['role'],
      "currencies" : json.decode(response.body)['currencies'],
    };

    if (newPasswordController.text != '') {
      updatedUser = {
        "username" : username,
        "email" : email,
        "adresse" : adresse,
        "old_password" : oldPassword,
        "new_password" : newPassword,
        "role" : json.decode(response.body)['role'],
        "currencies" : json.decode(response.body)['currencies'],
      };
    }
    debugPrint(json.encode(updatedUser));
    url = '${dotenv.env['URL_API']}/user/${json.decode(response.body)['username']}';
    response = await http.put(Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${prefs.getString('token')}"},
        body: jsonEncode(updatedUser)
    );

    if (response.statusCode == 200) {
      // ignore: avoid_print
      debugPrint(response.body);

      // ignore: use_build_context_synchronously
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const Dashboard()),
      );
      
    } else {
      debugPrint(response.body);
    }
  }
}