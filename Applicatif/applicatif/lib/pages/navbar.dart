import 'package:applicatif/pages/cart.dart';
import 'package:applicatif/pages/manageproduct.dart';
import 'package:flutter/material.dart';
import 'package:applicatif/pages/login.dart';

import '../controllers/authcontroller.dart';
import 'createproduct.dart';
import 'dashboard.dart';
import 'home.dart';
import 'orders.dart';

enum MenuItem {
  item1,
  item2,
  item3,
  item4
}

class Navbar extends StatelessWidget implements PreferredSizeWidget {

  const Navbar({super.key});
  
  @override
  Widget build(BuildContext context) {
    AuthController authController = AuthController();
    return FutureBuilder(
            future: authController.getAuthToken(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData){
                return AppBar(
                    title: Image.asset('assets/UmaiShop_Logo.png', height: 50, fit:BoxFit.fill,),
                    backgroundColor: const Color.fromARGB(255, 129, 31, 24),
                    actions: <Widget>[
                      TextButton(
                        style: ButtonStyle(
                          foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
                        ),
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Home()));
                        },
                        child: const Text('Home'),
                      ),
                      IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        tooltip: 'Go to cart',
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Cart()));
                        },
                      ),
                      PopupMenuButton(
                        icon: const Icon(Icons.settings),
                        tooltip: 'Settings',
                        onSelected: (value) {
                          if (value == MenuItem.item1) {
                            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Dashboard()));
                          } else if (value == MenuItem.item2) {
                            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const CreateProduct()));
                          } else if (value == MenuItem.item3) {
                            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ManageProduct()));
                          } else if (value == MenuItem.item4) {
                            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Orders()));
                          }
                        },
                        itemBuilder: (context) => const [
                          PopupMenuItem(
                            value: MenuItem.item1,
                            child: Text('Dashboard'),
                          ),
                          PopupMenuItem(
                            value: MenuItem.item2,
                            child: Text('Create a Product'),
                          ),
                          PopupMenuItem(
                            value: MenuItem.item3,
                            child: Text('Manage Product'),
                          ),
                          PopupMenuItem(
                            value: MenuItem.item4,
                            child: Text('Check my orders'),
                          ),
                        ]
                      ),
                      IconButton(
                        icon: const Icon(Icons.exit_to_app),
                        tooltip: 'Log out',
                        onPressed: () {
                          authController.logoutUser(context);
                        },
                      ),
                    ],
                  );
              } else {
                return AppBar(
                    title: Image.asset('assets/UmaiShop_Logo.png', height: 50, fit:BoxFit.fill),
                    backgroundColor: const Color.fromARGB(255, 129, 31, 24),
                    actions: <Widget>[
                      TextButton(
                        style: ButtonStyle(
                          foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
                        ),
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Home()));
                        },
                        child: const Text('Home'),
                      ),
                      IconButton(
                        icon: const Icon(Icons.account_box_sharp),
                        tooltip: 'Login',
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Login()));
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        tooltip: 'Go to cart',
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Cart()));
                        },
                      ),
                    ],
                  );
              }
          }
    );
  }
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
