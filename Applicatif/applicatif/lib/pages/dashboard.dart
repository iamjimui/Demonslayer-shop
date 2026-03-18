import 'package:applicatif/controllers/dashboardcontroller.dart';
import 'package:flutter/material.dart';

import '../controllers/authcontroller.dart';
import 'home.dart';
import 'navbar.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});
  
  @override
  Widget build(BuildContext context) {
    AuthController authController = AuthController();
    DashboardController dashboardController = DashboardController();
    // ignore: unnecessary_null_comparison
    return FutureBuilder(
            future: authController.getCredentials(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (!snapshot.hasData) {
                return const Home();
              } else {
                return MaterialApp(
                  title: 'UmaiShop',
                  theme: ThemeData(fontFamily: 'BobaMilky'),
                  home: Scaffold(
                    appBar: const Navbar(),
                    body: Container(
                      decoration: const BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage("assets/nezukobackground.jpg"),
                          fit: BoxFit.cover,
                        ),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: <Widget> [
                            const Text (
                              'Username'
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: dashboardController.usernameController,
                                  decoration: InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: snapshot.data?['username'],
                                    enabledBorder: const OutlineInputBorder(),
                                    focusedBorder: const OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            const Text (
                              'Email'
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: dashboardController.emailController,
                                  decoration: InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: snapshot.data?['email'],
                                    enabledBorder: const OutlineInputBorder(),
                                    focusedBorder: const OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            const Text (
                              'Adresse'
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: dashboardController.adresseController,
                                  decoration: InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: snapshot.data?['adresse'],
                                    enabledBorder: const OutlineInputBorder(),
                                    focusedBorder: const OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            const Text (
                              'Old Password'
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: dashboardController.oldPasswordController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'Old Password',
                                    enabledBorder: OutlineInputBorder(),
                                    focusedBorder: OutlineInputBorder(),
                                  ),
                                  obscureText: true
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            const Text (
                              'New Password'
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: dashboardController.newPasswordController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'New Password',
                                    enabledBorder: OutlineInputBorder(),
                                    focusedBorder: OutlineInputBorder(),
                                  ),
                                  obscureText: true
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            ElevatedButton(
                              onPressed: () {
                                dashboardController.updateUser(context);
                              },
                              child: const Text(
                                'Update',
                              )
                            ),
                          ]
                        ),
                      )
                    )
                  )
                );
              }  
             }
          );
    
  }
}