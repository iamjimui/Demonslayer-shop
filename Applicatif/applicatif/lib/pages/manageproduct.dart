import 'package:applicatif/controllers/productcontroller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


import 'navbar.dart';

class ManageProduct extends StatefulWidget {
  const ManageProduct({super.key});

  @override
  _ManageProductState createState() => _ManageProductState();
}

class _ManageProductState extends State<ManageProduct> {

  ProductController productController = ProductController();

  @override
  Widget build(BuildContext context) {
    
    return SafeArea(
      child: Scaffold(
        body: Scaffold(
          appBar: const Navbar(),
          body: FutureBuilder(
              future: productController.getFutureMyProducts(),
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
    List? data = productController.getVariableMyProducts();
    return SingleChildScrollView(
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
            ElevatedButton(
              onPressed: () {
                setState(() {
                  productController.deleteProduct(data?[index]['_id']);
                  data = productController.getVariableMyProducts();
                });
              },
              child: const Text(
                'Delete',
              )
            )
          ]
        ),
      )
    );
  }
}