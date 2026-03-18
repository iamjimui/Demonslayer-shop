import 'package:applicatif/controllers/cartcontroller.dart';
import 'package:applicatif/controllers/productcontroller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'navbar.dart';

class ProductDetails extends StatelessWidget {

  final String id;
  const ProductDetails({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    ProductController productController = ProductController();
    return Scaffold(
      backgroundColor: Colors.white,
      body: Scaffold(
          appBar: const Navbar(),
          body: FutureBuilder(
          future: productController.getSingleProduct(id),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(snapshot.data?[0]['name']),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.network(() {
                          if (snapshot.data?[0]['image'] != null && snapshot.data?[0]['image'] != '') {
                            return snapshot.data?[0]['image'];
                          }
                          return '${dotenv.env['URL_API']}/no-image-found.png';
                        }(),
                        height: 200,
                        width: 300,
                        fit:BoxFit.fill),
                      ),
                      Container(
                        margin: const EdgeInsets.only(left: 20.0, right: 20.0),
                        child: Container(),
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // ignore: prefer_interpolation_to_compose_strings
                          Text('Description : ' + snapshot.data?[0]['description']),
                          const SizedBox(
                            height: 20,
                          ),
                          Text('Price : ${snapshot.data![0]['price']} € '),
                          const SizedBox(
                            height: 20,
                          ),
                          ProductDetailsSizes(snapshot.data??[]),
                          const SizedBox(
                            height: 20,
                          )
                        ]
                      ),
                    ]
                  ),
                ]
              );
            } else {
              return const Text('Product doesn\'t exist');
            }
          }
        ),
      )
                  
    );
  }
}

class ProductDetailsSizes extends StatefulWidget {
  final List data;

  const ProductDetailsSizes(this.data, {super.key});

  @override
  // ignore: library_private_types_in_public_api, no_logic_in_create_state
  _ProductDetailsSizesState createState() => _ProductDetailsSizesState(data);
}

class _ProductDetailsSizesState extends State<ProductDetailsSizes> {
  final List data;
  late Object productSizeId = {};
  
  _ProductDetailsSizesState(this.data);

  @override
  Widget build(BuildContext context) {
    List productSizesList = data[0]['productSizes'];
    CartController cartController = CartController();
    return Column(
      children: [
        Row(
          children: productSizesList
            .map((productSize) => 
              SizedBox(
                width:120,
                height:50,
                child: RadioListTile(
                  title: Text(
                    "${productSize['productSizeId']['name']}",
                    style: const TextStyle(height: 2, fontSize: 11),
                  ),
                  groupValue: productSizeId,
                  value: productSize['productSizeId'],
                  onChanged: (val) {
                    setState(() {
                      productSizeId = val;
                    });
                },
              ),
            )
          ).toList()
        ),
        Row(children: [
          ElevatedButton(
            onPressed: () {
              cartController.addProduct(data, productSizeId);
            },
            child: const Text(
              'Add To Cart',
            )
          ),
        ],
        )
      ],
    );
  }

}