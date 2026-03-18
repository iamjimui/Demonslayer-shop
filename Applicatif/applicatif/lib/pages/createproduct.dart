import 'dart:io';

import 'package:applicatif/controllers/productcontroller.dart';
import 'package:flutter/material.dart';

import 'navbar.dart';

class CreateProduct extends StatefulWidget {
  const CreateProduct({super.key});

  @override
  _CreateProductState createState() => _CreateProductState();
}

class _CreateProductState extends State<CreateProduct> {

  ProductController productController = ProductController();
  String state = "";
  var selectedProductSizes = [];
  String selectedProductTypeId = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Navbar(),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const SizedBox(
                height: 20,
              ),
              const Text('Name'),
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
                    controller: productController.nameController,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.zero,
                      fillColor: Colors.white,
                      filled: true,
                      hintText: 'Name',
                      enabledBorder: OutlineInputBorder(),
                      focusedBorder: OutlineInputBorder(),
                    )
                  ),
                ),
              ),
              const SizedBox(
                height: 20,
              ),
              const Text('Description'),
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
                    controller: productController.descriptionController,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.zero,
                      fillColor: Colors.white,
                      filled: true,
                      hintText: 'Description',
                      enabledBorder: OutlineInputBorder(),
                      focusedBorder: OutlineInputBorder(),
                    )
                  ),
                ),
              ),
              const SizedBox(
                height: 20,
              ),
              const Text('Price'),
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
                    controller: productController.priceController,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.zero,
                      fillColor: Colors.white,
                      filled: true,
                      hintText: 'Price',
                      enabledBorder: OutlineInputBorder(),
                      focusedBorder: OutlineInputBorder(),
                    )
                  ),
                ),
              ),
              FutureBuilder(
                future: productController.getProductTypes(),
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return Column(
                        children: snapshot.data!
                          .map((productSize) => 
                            SizedBox(
                              width:200,
                              height:50,
                              child: RadioListTile(
                                title: Text(
                                  "${productSize['name']}",
                                  style: const TextStyle(height: 2, fontSize: 11),
                                ),
                                groupValue: selectedProductTypeId,
                                value: productSize['_id'],
                                onChanged: (val) {
                                  setState(() {
                                    selectedProductTypeId = val;
                                  });
                              },
                            ),
                          )
                        ).toList()
                      );
                  } else {
                    return const Text('No types for this product.');
                  }
                }
              ),
              const SizedBox(
                height: 20,
              ),
              FutureBuilder(
                future: productController.getProductSizes(),
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return ListView.builder(
                      scrollDirection: Axis.vertical,
                      shrinkWrap: true,
                      itemCount: snapshot.data?.length,
                      itemBuilder: (_, int index) {
                      return Card(
                        color: Colors.white,
                        elevation: 2.0,
                        child: CheckboxListTile(
                          title: Text(snapshot.data?[index]['name']),
                          subtitle: Text(snapshot.data?[index]['name']),            
                          value: selectedProductSizes.contains(snapshot.data?[index]['_id']),
                          onChanged: (_) {
                            if (selectedProductSizes.contains(snapshot.data?[index]['_id'])) {
                              setState(() {
                                selectedProductSizes.remove(snapshot.data?[index]['_id']);   
                              });
                              debugPrint(selectedProductSizes.toString());
                            } else {
                              setState(() {
                                selectedProductSizes.add(snapshot.data?[index]['_id']);  // select
                              });
                              debugPrint(selectedProductSizes.toString());
                            }
                          },
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                      );
                    },
                  );
                  } else {
                    return const Text('No types for this product.');
                  }
                }
              ),
              const SizedBox(
                height: 20,
              ),
              ElevatedButton(
                onPressed: () {
                  productController.createProduct(context, selectedProductSizes, selectedProductTypeId);
                },
                child: const Text(
                  'Create',
                )
              ),
            ],
          ),
        ),
      )
    );
  }
  
}