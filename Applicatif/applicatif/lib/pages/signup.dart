import 'package:applicatif/controllers/signupcontroller.dart';
import 'package:applicatif/pages/login.dart';
import 'package:flutter/material.dart';
import 'package:applicatif/controllers/authcontroller.dart';
import 'home.dart';
import 'navbar.dart';

class Signup extends StatelessWidget {
  const Signup({super.key});

  @override
  Widget build(BuildContext context) {
    AuthController authController = AuthController();
    SignupController signupController = SignupController();
    // ignore: unnecessary_null_comparison
    return FutureBuilder(
            future: authController.getAuthToken(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData){
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
                          image: AssetImage("assets/demonslayergarden.jpg"),
                          fit: BoxFit.cover,
                        ),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: <Widget> [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: signupController.usernameController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'Username',
                                    enabledBorder: OutlineInputBorder(),
                                    focusedBorder: OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: signupController.passwordController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'Password',
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
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: signupController.emailController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'Email',
                                    enabledBorder: OutlineInputBorder(),
                                    focusedBorder: OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              child: SizedBox(
                                width: 300.0,
                                height: 50,
                                child: TextFormField(
                                  textAlign: TextAlign.center,
                                  controller: signupController.adresseController,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.zero,
                                    fillColor: Colors.white,
                                    filled: true,
                                    hintText: 'Adresse',
                                    enabledBorder: OutlineInputBorder(),
                                    focusedBorder: OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 35,
                            ),
                            ElevatedButton(
                              onPressed: () {
                                signupController.registerUser(context);
                              },
                              child: const Text(
                                'Register',
                              )
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            TextButton(
                              style: ButtonStyle(
                                backgroundColor: MaterialStateProperty.all<Color>(const Color.fromARGB(255, 129, 31, 24)),
                                foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
                              ),
                              onPressed: () {
                                Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Login()));
                              },
                              child: const Text('You have already an account ? Click this to login !'),
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