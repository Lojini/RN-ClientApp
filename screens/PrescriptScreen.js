import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import HeaderBar from "../components/Header";
import {
  Card,
  ListItem,
  Button,
  Icon,
  BottomSheet,
} from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faCloudUploadAlt,
  faCloudDownloadAlt,
  faShoppingCart,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";
import axios from "axios";
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from "react-native-modal-datetime-picker";

export default class PrescriptScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataItem: [],
      visible: false,
      isDatePickerVisible:false,
      description: "",
      prescDate: "",
      file: "",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  setStatus(value, id){
    var temp = [...this.state.data]
    temp.map((t) => {
    if (t.id == id) {
        t.prescAuto = value==true?1:0
    }
    })
    
    this.setState({ data: temp });
    this.updatePrescriptionAuto(value,id);
  }

  fetchData() {
    this.setState({ refreshing: true });
    axios
      .get("https://caretakerr.herokuapp.com/prescriptions/1")
      .then((resJson) => {
        this.setState({ data: resJson.data.prescriptions });
      })
      .catch((e) => console.log(e));
  }

  fetchDataById(id) {
    this.setState({ visible: true });
    axios
      .get("https://caretakerr.herokuapp.com/prescription/" + id)
      .then((resJson) => {
        this.setState({ dataItem: resJson.data.prescription });
        this.setState({ prescDate: resJson.data.prescription.prescDate });
        this.setState({ description: resJson.data.prescription.prescDesc });
        this.setState({ file: resJson.data.prescription.prescFile });
      })
      .catch((e) => console.log(e));
  }

  deletePrescription(id) {
    axios
      .delete("https://caretakerr.herokuapp.com/prescription/" + id)
      .then((resJson) => {
        this.setState({ visible: false });
        this.fetchData();
      })
      .catch((e) => console.log(e));
  }

  updatePrescriptionAuto(value, id) {
    if (value) {
      axios
        .put("https://caretakerr.herokuapp.com/prescription/auto/on/" + id)
        .then(() => {
          this.fetchData();
        })
        .catch((e) => console.log(e));
    } else {
      axios
        .put("https://caretakerr.herokuapp.com/prescription/auto/off/" + id)
        .then(() => {
          this.fetchData();
        })
        .catch((e) => console.log(e));
    }
  }

  updatePrescription =  (id) => {
    if (this.state.file != null) {
      let fileToUpload = this.state.file;
      let formData = new FormData();

      formData.append('prescDesc', this.state.description);
      formData.append('prescDate', this.state.prescDate);
      formData.append('prescImage', fileToUpload);
      formData.append('prescFreq', 3);

      axios.put('https://caretakerr.herokuapp.com/prescription/'+id, formData,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    
    }).then((resJson) => {
      this.props.active;
        this.props.func;
      })
      .catch((e) => console.log(e));
    }  
  };

  addOrder = (id) => {
    axios
      .post("https://caretakerr.herokuapp.com/order", {
        "prescription": id,
        "client": 1,
        "orderDate": new Date(),
      })
      .then((resJson) => {
        console.log(resJson);
      })
      .catch((e) => console.log(e));
  };

  showDateTimePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleDatePicked = (pickedDate) => {
    this.setState({
      prescDate:
        pickedDate.getFullYear() +
        "-" +
        ("0" + (pickedDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + pickedDate.getDate()).slice(-2)
    });
    this.hideDateTimePicker();
  };

  renderBottomSheet = (dataItem) => (
    <BottomSheet
      isVisible={this.state.visible}
      containerStyle={{ marginBottom: 38 }}
    >
      <View style={styles.panel}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.panelTitle}>View Prescription</Text>
          <TouchableOpacity onPress={() => this.setState({ visible: false })}>
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <TextInput
          onChangeText={(value) => {
            this.setState({ description: value });
          }}
          value={this.state.description}
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
        />
        <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              editable={false}
              value={this.state.prescDate}
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
            />
            <Button
              onPress={() => {
                this.showDateTimePicker();
              }}
              buttonStyle={{ backgroundColor: Colors.primaryColor }}
              icon={
                <FontAwesomeIcon icon={faCalendarAlt} size={17} color="white" />
              }
            />
            <DateTimePicker
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode={"date"}
            />
          </View>
        <Button
          buttonStyle={styles.panelButton}
          title=" Upload Prescription"
          icon={
            <FontAwesomeIcon icon={faCloudUploadAlt} size={17} color="white" />
          }
        />
        <Text
          style={{
            margin: 10,
            textAlign: "center",
            fontSize: 16,
            fontFamily: "montserrat-semibold",
            color: "black",
          }}
        >
          {this.state.file}
        </Text>
        <Button
          buttonStyle={styles.panelButton}
          title=" Download Prescription"
          icon={
            <FontAwesomeIcon
              icon={faCloudDownloadAlt}
              size={17}
              color="white"
            />
          }
        />
        {dataItem.prescPending == 0 ? (
          <Button
            type="outline"
            buttonStyle={{
              borderColor: Colors.primaryColor,
              borderWidth: 2,
              borderRadius: 10,
              marginTop: 10,
            }}
            titleStyle={{ color: Colors.primaryColor }}
            title=" Inquire Order"
            icon={
              <FontAwesomeIcon
                icon={faShoppingCart}
                size={17}
                color={Colors.primaryColor}
              />
            }
          />
        ) : (
          <Button
            onPress={()=>this.addOrder(dataItem.id)}
            type="outline"
            buttonStyle={{
              borderColor: Colors.primaryColor,
              borderWidth: 2,
              borderRadius: 10,
              marginTop: 10,
            }}
            titleStyle={{ color: Colors.primaryColor }}
            title=" Place Order"
            icon={
              <FontAwesomeIcon
                icon={faShoppingCart}
                size={17}
                color={Colors.primaryColor}
              />
            }
          />
        )}
        <Text
          style={{
            margin: 10,
            textAlign: "center",
            fontSize: 16,
            fontFamily: "montserrat-semibold",
            color: "red",
          }}
        >
          {dataItem.prescPending == 0 ? "Pending" : dataItem.prescPrice}
        </Text>
        <Button 
        onPress={() => this.updatePrescription(dataItem.id)}
        buttonStyle={styles.panelButton} title="Save Prescription" />
        <Button
          onPress={() => this.deletePrescription(dataItem.id)}
          buttonStyle={styles.panelButton}
          title="Remove Prescription"
        />
      </View>
    </BottomSheet>
  );

  renderItemComponent = ({item}) => (
    <TouchableHighlight
      onPress={() => this.fetchDataById(item.id)}
      underlayColor="white">
      <Card containerStyle={{ borderRadius: 9 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: 16,
              fontFamily: "montserrat",
              color: "black",
            }}
          >
            {item.prescPending == 0 ? "Pending" : item.prescPrice}
          </Text>
          <View style={{ justifyContent: "space-between" }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat",
                color: "black",
              }}>
              {item.prescDate}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "montserrat",
                fontSize: 14,
                color: "grey",
              }}
            >
              {item.prescDesc}
            </Text>
          </View>
          <Switch
                onValueChange={(value) => this.setStatus(value,item.id)}
                value={item.prescAuto==1?true:false}
              />
        </View>
      </Card>
    </TouchableHighlight>
  );

  render() {
    return (
      <HeaderBar title="Prescriptions" add="true" name="Prescription" func={this.fetchData()}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItemComponent}
          keyExtractor={(item) => item.id.toString()}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
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

PrescriptScreen.navigationOptions = {
  headerTitle: "Prescription",
};
