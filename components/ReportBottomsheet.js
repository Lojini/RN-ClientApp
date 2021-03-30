import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TextInput,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, BottomSheet, Divider } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendarAlt, faCloudUploadAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";
const window = Dimensions.get("window");
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class ReportBottomsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      description: "",
      reportDate: "",
      file: "",
      isDatePickerVisible: false,
    };
  }

  selectFile = async () => {
    try {
      let res = await DocumentPicker.getDocumentAsync({});
      this.setState({ file: res });
    } catch (err) {
      this.setState({ file: null });
      if (DocumentPicker.isCancel(err)) {
        alert("Canceled");
      } else {
        alert("Unknown Error: " + JSON.stringify(err));
        throw err;
      }
    }
  };

  addReport = () => {
    if (this.state.file != null) {
      let fileToUpload = this.state.file;
      let formData = new FormData();

      formData.append("reportDesc", this.state.description);
      formData.append("reportDate", this.state.reportDate);
      formData.append("reportUser", 1);
      formData.append("reportImage", fileToUpload);
      axios
        .post("https://caretakerr.herokuapp.com/report", formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        })
        .then((resJson) => {
          this.props.active;
          this.props.func;
        })
        .catch((e) => console.log(e));
    }
  };

  showDateTimePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleDatePicked = (pickedDate) => {
    this.setState({
      reportDate:
        pickedDate.getFullYear() +
        "-" +
        ("0" + (pickedDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + pickedDate.getDay()).slice(-2),
    });
    this.hideDateTimePicker();
  };

  render() {
    return (
      <BottomSheet isVisible={true} containerStyle={{ marginBottom: 38 }}>
        <View style={styles.panel}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text style={styles.panelTitle}>New Report</Text>
            <TouchableOpacity onPress={this.props.active}>
              <FontAwesomeIcon
                icon={faTimes}
                size={20}
                color={Colors.primaryColor}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder={"Report Description"}
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
              placeholder="Report Date"
              editable={false}
              value={this.state.reportDate}
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
            onPress={this.selectFile}
            buttonStyle={styles.panelButton}
            title={"Upload Report"}
            icon={
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                size={17}
                color="white"
              />
            }
          />
          {this.state.file != null ? (
            <Text style={styles.textStyle}>
              File Name: {this.state.file.name ? this.state.file.name : ""}
            </Text>
          ) : null}

          <Button
            onPress={this.addReport}
            buttonStyle={styles.panelButton}
            title={"Save Report"}
          />
        </View>
      </BottomSheet>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    fontFamily: "montserrat",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
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
