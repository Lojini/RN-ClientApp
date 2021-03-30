import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
} from "react-native";
import HeaderBar from "../components/Header";
import Colors from "../constants/Colors";
import { Card, Divider, BottomSheet, Button } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default class OrdersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataItem: [],
      pharmData:[],
      prescData:[],
      visible: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    axios.get('https://caretakerr.herokuapp.com/orders/1')
    .then((resJson) => {
      this.setState({ data: resJson.data.orders });
    })
    .catch((e) => console.log(e)); 
  }

  fetchPrescriptionById(id){
    axios.get('https://caretakerr.herokuapp.com/prescription/'+id)
    .then((resJson) => {
      this.setState(prevState => {
        let dataItem = Object.assign({}, prevState.dataItem);  // creating copy of state variable jasper
        dataItem.prescription = resJson.data.prescription.prescDesc;        
        return { dataItem };                                 // return new object jasper object
      })
      // this.fetchPharmacyById(id);
    })
    .catch((e) => console.log(e)); 
  }

  fetchPharmacyById(id){
    axios.get('https://caretakerr.herokuapp.com/pharmacy/'+id)
    .then((resJson) => {
      this.setState({ pharmData: resJson.data.presription });
    })
    .catch((e) => console.log(e)); 
  }

  fetchDataById(id) {
    let status;
    this.setState({ visible: true });
    axios.get('https://caretakerr.herokuapp.com/order/'+id)
      .then((resJson) => {
        this.setState({ dataItem: resJson.data.order});
        if(this.state.dataItem.orderStatus==0){
         status = "Ongoing";
        }
        else if(this.state.dataItem.orderStatus==1){
          status = "Delivered";
        }
        else if(this.state.dataItem.orderStatus==2){
          status = "Cencelled";
        }
        this.setState(prevState => {
          let dataItem = Object.assign({}, prevState.dataItem);  // creating copy of state variable jasper
          dataItem.orderStatus = status;                     // update the name property, assign a new value                 
          return { dataItem };                                 // return new object jasper object
        })
        this.fetchPrescriptionById(this.state.dataItem.prescription);
        // if(dataItem.pharmacy!=null)
        //   this.fetchPharmacyById(data.item.pharmacy);
        // else
        //   this.setState({ dataItem : {'pharmacy':'N/A'} });

          
      })
      .catch((e) => console.log(e)); 
  }

  renderBottomSheet = (dataItem) => (
    <BottomSheet
      isVisible={this.state.visible}
      containerStyle={{ marginBottom: 38 }}
    >
      <View style={styles.panel}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.panelTitle}>View Order</Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ visible: false });
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>{dataItem.prescription}</Text>
        <Text style={styles.subtitle}>{dataItem.orderDate}</Text>
        <Text style={dataItem.orderStatus=="0" ?styles.subtitleColoredGray:dataItem.orderStatus=="1"?styles.subtitleColored:styles.subtitleColoredRed}>{dataItem.orderStatus}</Text>
        {/* <Text style={styles.subtitle}>{this.state.data.pharmacy}</Text> */}
        {dataItem.orderStatus!="0"?<Button buttonStyle={styles.panelButton} title=" Cancel Order" />:null}
      </View>
    </BottomSheet>
  );

  renderItemComponent = (data) => (
    <TouchableHighlight
      onPress={() => {
        this.fetchDataById(data.item.id);
      }}
      underlayColor="white"
      key={data.item.id}
    >
      <Card containerStyle={{ borderRadius: 9 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ justifyContent: "space-between" }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat",
                color: "black",
              }}
            >
              {data.item.orderDate}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "montserrat",
                fontSize: 14,
                color: "grey",
              }}
            >
              {data.item.orderStatus==0?"Ongoing":data.item.orderStatus==1?"Delivered on"+data.item.orderStatusDate:"Cancelled on"+data.item.orderStatusDate}
            </Text>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <Text style={{ fontFamily: "montserrat-bold" }}>BPA01</Text>
            {data.item.orderStatus==0?
            <Divider
              style={{
                marginTop: 9,
                backgroundColor: "grey",
                height: 5,
                borderRadius: 8,
              }}
            ></Divider>:data.item.orderStatus==1?
            <Divider
              style={{
                marginTop: 9,
                backgroundColor: "green",
                height: 5,
                borderRadius: 8,
              }}
            ></Divider>:<Divider
              style={{
                marginTop: 9,
                backgroundColor: "red",
                height: 5,
                borderRadius: 8,
              }}
            ></Divider>
            }
          </View>
        </View>
      </Card>
    </TouchableHighlight>
  );

  render() {
    return (
      <HeaderBar title="Orders" >
        <FlatList
          data={this.state.data}
          renderItem={(item) => this.renderItemComponent(item)}
          keyExtractor={(item) => item.id.toString()}
          
        />
        {this.renderBottomSheet(this.state.dataItem)}
      </HeaderBar>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    padding: 30,
    backgroundColor: "white",
  },
  subtitle: {
    color: "black",
    fontFamily: "montserrat",
    textAlign: "left",
    fontSize: 16,
    height: 35,
    marginTop: 10,
  },
  subtitleColored: {
    color: "green",
    fontFamily: "montserrat",
    textAlign: "left",
    fontSize: 16,
    height: 35,
    marginTop: 10,
  },
  subtitleColoredGray: {
    color: "grey",
    fontFamily: "montserrat",
    textAlign: "left",
    fontSize: 16,
    height: 35,
    marginTop: 10,
  },
  subtitleColoredRed: {
    color: "red",
    fontFamily: "montserrat",
    textAlign: "left",
    fontSize: 16,
    height: 35,
    marginTop: 10,
  },
  panelTitle: {
    flex: 2,
    fontFamily: "montserrat-bold",
    textAlign: "center",
    fontSize: 16,
    height: 35,
  },
  panelButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
  },
});
