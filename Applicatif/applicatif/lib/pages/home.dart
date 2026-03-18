import 'package:applicatif/controllers/productcontroller.dart';
import 'package:applicatif/pages/productdetails.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'navbar.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {

  ProductController productController = ProductController();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Scaffold(
          appBar: const Navbar(),
          body: FutureBuilder(
              future: productController.getAllProducts(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return ListView.builder(
                    scrollDirection: Axis.vertical,
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(5.5),
                    itemCount: snapshot.data?.length,
                    itemBuilder: _itemBuilder,
                  );
                } else {
                  return Center(child:Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Image.asset("assets/tanjiroangryface.png"),
                      const Text('There are no products :(')
                    ]));
                }
              }
            )
        )
      ),
    );
  }

  Widget _itemBuilder(BuildContext context, int index) {
    List? data = productController.getVariableAllProducts();
    return InkWell(
      child: Card(
        child: Column(
          children: [
            Image.network(() {
              if (data?[index]['image'] != null && data?[index]['image'] != '') {
                return data?[index]['image'];
              }
              return '${dotenv.env['URL_API']}/no-image-found.png';
              }(),
              height: 200,
              width: 300,
              fit:BoxFit.fill
            ),
            Text(
              "${data?[index]['name']}",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              "Price : ${data?[index]['price']} €",
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ]
        ),
      ),
      onTap: () {
        Navigator.of(context).push(MaterialPageRoute(builder: (context) => ProductDetails(id: data?[index]['_id'])));
      }
    );
  }
}