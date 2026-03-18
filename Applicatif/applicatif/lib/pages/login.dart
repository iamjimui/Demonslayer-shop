import 'signup.dart';
import 'package:flutter/material.dart';
import 'package:applicatif/controllers/authcontroller.dart';
import 'home.dart';
import 'navbar.dart';

class Login extends StatelessWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    AuthController authController = AuthController();
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
                                  controller: authController.usernameController,
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
                                  controller: authController.passwordController,
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
                            height: 35,
                            ),
                            ElevatedButton(
                              onPressed: () {
                                authController.loginUser(context);
                              },
                              child: const Text(
                                'Login',
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
                                Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Signup()));
                              },
                              child: const Text('Not signed up ? Click this to sign up !'),
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