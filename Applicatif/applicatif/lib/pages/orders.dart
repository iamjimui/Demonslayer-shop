import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


import '../controllers/ordercontroller.dart';
import 'navbar.dart';

class Orders extends StatefulWidget {
  const Orders({super.key});
  
  @override
  _OrdersState createState() => _OrdersState();
}

class _OrdersState extends State<Orders> {

  OrderController orderController = OrderController();
  List myOrders = [];
  late List<bool> _isExpanded = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Navbar(),
      body: SingleChildScrollView(
        child: FutureBuilder(
              future: orderController.getMyOrders(),
              builder: (BuildContext context, AsyncSnapshot snapshot) {
                if (snapshot.hasData) {
                  if (_isExpanded.length == 0 || _isExpanded == null) {
                    for (int i = 0; i < snapshot.data.length; i++) {
                      _isExpanded.add(false);
                    } 
                  }
                  myOrders = snapshot.data;
                  return ExpansionPanelList(
                    children: buildPanelList(snapshot.data),
                    expansionCallback: (int index, bool isExpanded) {
                      setState(() {
                        _isExpanded[index] = !isExpanded;
                      });
                    },
                  );
              } else {
                return const Text('No orders found.');
              }
          }
        ),
      )
    );
  }

  List<ExpansionPanel> buildPanelList(List data) {
    List<ExpansionPanel> children = [];
    for (int i = 0; i < data.length; i++) {
      children.add(ExpansionPanel(
        headerBuilder: (context, isExpanded) {
          return Column(children: [
            Text('Order n°${data[i]['_id'].toString()}'),
            Text('Date : ${data[i]['created_at'].toString()}'),
             Text('Total price : ${data[i]['total_price'].toString()} €'),
          ]);
        },
        body: Column(
          children: data[i]['orderDetails'].map<Widget>((orderDetails) => 
              buildRowOrderDetails(orderDetails)
            ).toList()
        ),
        isExpanded: _isExpanded[i] ?? false
      ));
    }
    return children;
  }

  Widget buildRowOrderDetails(Map<String,dynamic> orderDetails) {
    return Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children:[
              ClipRRect(
                borderRadius: BorderRadius.circular(20), // Image border
                child:Image.network(() {
                  if (orderDetails.containsKey('product')) {
                    if (orderDetails['product']['image'] != null && orderDetails['product']['image'] != '') {
                      return orderDetails['product']['image'];
                    }
                  }
                    return '${dotenv.env['URL_API']}/no-image-found.png';
                  }(),
                  height: 200,
                  width: 300,
                  fit:BoxFit.fill
              )
            ),
            
            Column(children: [
              Text(() {
                if (orderDetails.containsKey('product')) {
                  return 'Name : ${orderDetails['product']['name']}';
                } else {
                  return 'Name : null';
                }
              }()
              ),
              Text(() {
              if (orderDetails.containsKey('product')) {
                return 'Quantity : ${orderDetails['quantity']}';
              } else {
                return 'Quantity : null';
              }
              }()),
              Text(() {
                debugPrint(orderDetails.toString());
                if (orderDetails.containsKey('product')) {
                  return 'Price : ${orderDetails['price']} €';
                } else {
                  return 'Price : null';
                }
              }())
            ])
            
          ]
        );
    }
  
}