import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
} from "react-native";
import HeaderBar from "../components/Header";
import { Card, BottomSheet,Button } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShoppingCart,
  faCreditCard,
  faTimes,
  faVideo,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";

export default class PrescriptScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          visible : false,     
      }
  }
  render(){
  return (
    <HeaderBar title="Other" name="Other">
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate("Orders")}
        underlayColor="white"
      >
        <Card containerStyle={{ borderRadius: 9 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              size={24}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
            <View style={{ flex: 2, marginHorizontal: 20 }}>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 16,
                  fontFamily: "montserrat",
                  color: "black",
                }}
              >
                Orders
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: "montserrat",
                  fontSize: 14,
                  color: "grey",
                }}
              >
                View Order History
              </Text>
            </View>
          </View>
        </Card>
      </TouchableHighlight>

      <Card containerStyle={{ borderRadius: 9 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faVideo}
            size={24}
            color={Colors.primaryColor}
          ></FontAwesomeIcon>
          <View style={{ flex: 2, marginHorizontal: 20 }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat",
                color: "black",
              }}
            >
              Video Call
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "montserrat",
                fontSize: 14,
                color: "grey",
              }}
            >
              Contact your caretaker via Zoom
            </Text>
          </View>
        </View>
      </Card>

      <TouchableHighlight
        onPress={()=>this.setState({visible:true})}
        underlayColor="white"
      >
        <Card containerStyle={{ borderRadius: 9 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faCreditCard}
              size={24}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
            <View style={{ flex: 2, marginHorizontal: 20 }}>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 16,
                  fontFamily: "montserrat",
                  color: "black",
                }}
              >
                Payment
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: "montserrat",
                  fontSize: 14,
                  color: "grey",
                }}
              >
                Update Payment Information
              </Text>
            </View>
          </View>
        </Card>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="white">
        <Card containerStyle={{ borderRadius: 9 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faQuestion}
              size={24}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
            <View style={{ flex: 2, marginHorizontal: 20 }}>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 16,
                  fontFamily: "montserrat",
                  color: "black",
                }}
              >
                Help
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: "montserrat",
                  fontSize: 14,
                  color: "grey",
                }}
              >
                Learn how to use this App
              </Text>
            </View>
          </View>
        </Card>
      </TouchableHighlight>

    {/* pop-up dialog box for payment  */}
      <BottomSheet
        isVisible={this.state.visible}
        containerStyle={{ marginBottom: 38 }}
      >
        <View style={styles.panel}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text style={styles.panelTitle}>Payment Information</Text>
            <TouchableOpacity onPress={()=>this.setState({visible:false})}>
              <FontAwesomeIcon
                icon={faTimes}
                size={20}
                color={Colors.primaryColor}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Pick Card Type"
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <TextInput
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              placeholder="MM/YY"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
            />
            <TextInput
              placeholder="CVV"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
            />
          </View>
          <TextInput
            placeholder="Card Holder's Name"
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <Button
            buttonStyle={styles.panelButton}
            title="Save Information"
          />
        </View>
      </BottomSheet>
    </HeaderBar>
  );
}
}

const styles = StyleSheet.create({
  panel: {
    padding: 30,
    backgroundColor: "white",
  },
  panelTitle: {
    flex: 2,
    fontFamily: "montserrat-bold",
    textAlign: "center",
    fontSize: 16,
    height: 35,
  },
  loginFormTextInput: {
    height: 40,
    flex: 1,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    padding: 10,
    marginRight: 5,
    marginTop: 10,
  },
  panelButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
  },
});

