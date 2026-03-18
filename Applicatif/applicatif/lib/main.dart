import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'pages/home.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
Future main() async {
  await dotenv.load(fileName: ".env");
  runApp(const Main());
}


class Main extends StatelessWidget {
  const Main({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UmaiShop',
      theme: ThemeData(fontFamily: 'BobaMilky'),
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Container(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/introDemonSlayerBackground1.jpg"),
              fit: BoxFit.cover,
            ),
          ),
          child: const Center(child: MyWidget())
        )
      )
    );
  }
}

class MyWidget extends StatelessWidget {
  const MyWidget({super.key});
  void resetCart() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('cart', '{"total_price": 0, "products": []}');
  }
  @override
  Widget build(BuildContext context) {
    resetCart();
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Image.asset("assets/UmaiShop_Logo.png"),
        TextButton(
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all<Color>(const Color.fromARGB(255, 129, 31, 24)),
            foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
          ),
          onPressed: () {
            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const Home()));
          },
          child: const Text('Go to UmaiShop'),
        )
      ],
    );
  }
}