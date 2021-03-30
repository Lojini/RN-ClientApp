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
import { Card, Button, BottomSheet } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faCloudUploadAlt,
  faCloudDownloadAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";
import axios from "axios";
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from "react-native-modal-datetime-picker";

export default class ReportsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataItem: [],
      visible: false,
      description: "",
      reportDate: "",
      file: "",
      isDatePickerVisible:false,
      status:false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  setStatus(value, id) {
    var temp = [...this.state.data];
    temp.map((t) => {
      if (t.id == id) {
        this.setState({ status: value == true ? 1 : 0 });
        t.reportShow = value == true ? 1 : 0;
        
      }
    });

    this.setState({ data: temp });
    this.updateReportAccess(value, id);
  }

  fetchData() {
    this.setState({ refreshing: true });
    axios
      .get("https://caretakerr.herokuapp.com/reports/1")
      .then((resJson) => {
        this.setState({ data: resJson.data.reports });
      })
      .catch((e) => console.log(e));
  }

  fetchDataById(id) {
    this.setState({ visible: true });
    axios
      .get("https://caretakerr.herokuapp.com/report/" + id)
      .then((resJson) => {
        this.setState({ dataItem: resJson.data.report });
        this.setState({ reportDate: resJson.data.report.reportDate });
        this.setState({ description: resJson.data.report.reportDesc });
        this.setState({ status: resJson.data.report.reportShow });
        this.setState({ file: resJson.data.report.reportFile });
      })
      .catch((e) => console.log(e));
  }

  deleteReport(id) {
    axios
      .delete("https://caretakerr.herokuapp.com/report/" + id)
      .then(() => {
        this.setState({ visible: false });
        this.fetchData();
      })
      .catch((e) => console.log(e));
  }

  updateReportAccess(value, id) {
    if (value) {
      axios
        .put("https://caretakerr.herokuapp.com/report/show/" + id)
        .then(() => {
          this.fetchData();
        })
        .catch((e) => console.log(e));
    } else {
      axios
        .put("https://caretakerr.herokuapp.com/report/" + id)
        .then(() => {
          this.fetchData();
        })
        .catch((e) => console.log(e));
    }
  }

  selectFile = async () => {
    try {
      let res = await DocumentPicker.getDocumentAsync({})
      this.setState({file:res});
    } catch (err) {
        this.setState({file:null});
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  
  updateReport = (id) => {
    if (this.state.file != null) {
      let fileToUpload = this.state.file;
      let formData = new FormData();

      formData.append("reportDesc", this.state.description);
      formData.append("reportDate", this.state.reportDate);
      formData.append("reportImage", fileToUpload);

      axios
        .put("https://caretakerr.herokuapp.com/report/"+id, formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        })
        .then((resJson) => {
          this.setState({visible:false});
          this.fetchData();
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
        ("0" + pickedDate.getDate()).slice(-2)
    });
    this.hideDateTimePicker();
  };

  renderBottomSheet = (dataItem) => (
    <BottomSheet
      isVisible={this.state.visible}
      containerStyle={{ marginBottom: 38 }}
      //Toggling the visibility state
    >
      <View style={styles.panel}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.panelTitle}>View Report</Text>
          <TouchableOpacity onPress={() => this.setState({ visible: false })}>
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
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
        <TextInput
          onChangeText={(value) => {
            this.setState({ description: value });
          }}
          value={this.state.description}
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
        />
        <Button
           onPress={this.selectFile}
          buttonStyle={styles.panelButton}
          title=" Upload Report"
          icon={
            <FontAwesomeIcon icon={faCloudUploadAlt} size={17} color="white" />
          }
        />
          <Text
          style={{
            margin: 10,
            textAlign: "center",
            fontSize: 10,
            fontFamily: "montserrat-semibold",
            color: "black",
          }}
        >
          {this.state.file}
        </Text>
        <Button
          buttonStyle={styles.panelButton}
          title=" Download Report"
          icon={
            <FontAwesomeIcon
              icon={faCloudDownloadAlt}
              size={17}
              color="white"
            />
          }
        />
        <Button 
        onPress={() => this.updateReport(dataItem.id)}
        buttonStyle={styles.panelButton} title="Save Report" />
        <Button
          onPress={() => this.deleteReport(dataItem.id)}
          buttonStyle={styles.panelButton}
          title="Remove Report"
        />
      </View>
    </BottomSheet>
  );

  renderItemComponent = ({ item }) => (
    <TouchableHighlight
      onPress={() => this.fetchDataById(item.id)}
      underlayColor="white"
    >
      <Card containerStyle={{ borderRadius: 9 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ justifyContent: "space-between", flexShrink: 5 }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat",
                color: "black",
              }}
            >
              {item.reportDate}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "montserrat",
                fontSize: 14,
                color: "grey",
              }}
            >
              {item.reportDesc}
            </Text>
          </View>
          <Switch
            onValueChange={(value) => this.setStatus(value, item.id)}
            value={item.reportShow == 1 ? true : false}
          />
        </View>
      </Card>
    </TouchableHighlight>
  );

  render() {
    return (
      <HeaderBar title="Reports" add="true" name="Report" func={this.fetchData}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItemComponent}
          keyExtractor={(item) => item.id.toString()}
          extraData={this.state}
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
