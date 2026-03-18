import 'package:applicatif/controllers/cartcontroller.dart';
import 'package:applicatif/pages/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../controllers/authcontroller.dart';
import 'navbar.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _CartState createState() => _CartState();
}

class _CartState extends State<Cart> {

  AuthController authController = AuthController();
  CartController cartController = CartController();
  late Future<List> ListData = cartController.getCartItems();

  @override
  Widget build(BuildContext context) {
    late Future<double> totalPrice = cartController.getTotalPrice();
    return SafeArea(
      child: Scaffold(
        body: Scaffold(
          appBar: const Navbar(),
          body: FutureBuilder(
              future: ListData,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  // ignore: prefer_is_empty
                  if (snapshot.data?.length != 0) {
                    return SingleChildScrollView(
                      child: Column(
                        children:[
                          ListView.builder(
                            scrollDirection: Axis.vertical,
                            shrinkWrap: true,
                            padding: const EdgeInsets.all(5.5),
                            itemCount: snapshot.data?.length,
                            itemBuilder: _itemBuilder,
                          ),
                          FutureBuilder(
                            future: totalPrice,
                            builder: (context, snapshot) {
                              if (snapshot.hasData) {
                                return Text('Total Price : ${snapshot.data} €');
                              } else {
                                return const Text('Total Price : 0 €');
                              }
                            }
                          ),
                          SizedBox(
                            width: 250.0,
                            height: 50.0,
                            child: FutureBuilder(
                              future: authController.getAuthToken(),
                              builder: (context, snapshot) {
                                if (snapshot.hasData) {
                                  return ElevatedButton(
                                    onPressed: () {
                                      setState(() {
                                        ListData = cartController.checkout(context);
                                      });
                                    },
                                    child: const Text(
                                      'Checkout',
                                    )
                                  );
                                } else {
                                  return TextButton(
                                    onPressed: () {
                                      Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Login()));
                                    },
                                    child: const Text(
                                      'You need to login to purchase.',
                                    )
                                  ); 
                                }
                              }
                            )
                          )
                        ]
                      ),
                    );
                  } else {
                    return Center(child:Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Image.asset("assets/tanjiroangryface.png"),
                        const Text('Nothing in cart :(')
                    ]));
                  }
                } else {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Image.asset("assets/tanjiroangryface.png"),
                      const Text('Nothing in cart :(')
                    ]);
                }
              }
            )
        )
      ),
    );
  }

  Widget? _itemBuilder(BuildContext context, int index) {
    List data = cartController.cartItems['products'];
    if (index < data.length) {
      return Center(
      child: Card(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children:<Widget>[
            Image.network(() {
              if (data[index]['image'] != null && data[index]['image'] != '') {
                return data[index]['image'];
              }
              return '${dotenv.env['URL_API']}/no-image-found.png';
              }(),
              height: 200,
              width: 300,
              fit:BoxFit.fill
            ),
            Text(
              "Name : ${data[index]['name']}",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              "Quantity : ${data[index]['quantity']}",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              "Size : ${data[index]['productSize']['name']}",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              "Price : ${data[index]['price']} €",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  ListData = cartController.removeProduct(index);
                });
              },
              child: const Text('Remove')),
          ]
        ),
      )
    );
    } else {
      return null;
    }
    
  }
}