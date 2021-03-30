import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button, BottomSheet, Divider } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt,
  faCloudUploadAlt,
  faShoppingCart,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/Colors';
const window = Dimensions.get('window');
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from "react-native-modal-datetime-picker";

export default class PrescriptionBottomsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      description:'',
      prescDate:'',
      isDatePickerVisible:false
    };
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

  addPrescription =  () => {
    if (this.state.file != null) {
      let fileToUpload = this.state.file;
      let formData = new FormData();

      formData.append('prescDesc', this.state.description);
      formData.append('prescDate', this.state.prescDate);
      formData.append('prescUser', 1);
      formData.append('prescImage', fileToUpload);
      formData.append('prescFreq', 3);

      axios.post('https://caretakerr.herokuapp.com/prescription', formData,
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

  
  showDateTimePicker = () => {
    this.setState({ isDatePickerVisible: true });
    }

  hideDateTimePicker = () => {
    this.setState({ isDatePickerVisible: false });
  }

  handleDatePicked = (pickedDate) => {
    this.setState({ prescDate: (pickedDate.getFullYear())+"-"+("0" + (pickedDate.getMonth() + 1)).slice(-2) +"-"+("0" + (pickedDate.getDate())).slice(-2) });
    this.hideDateTimePicker();
  };
  render() {
    return (
      <BottomSheet
        isVisible={true}
        containerStyle={{ marginBottom: 38 }}>
        <View style={styles.panel}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.panelTitle}>New Prescription</Text>
            <TouchableOpacity onPress={this.props.active}>
              <FontAwesomeIcon
                icon={faTimes}
                size={20}
                color={Colors.primaryColor}></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder={'Prescription Description'}
            placeholderColor="#c4c3cb"
            onChangeText={(value) => {
                    this.setState({ description: value });
                  }}
            value={this.state.description}
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
          placeholder="Prescription Date"
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
            onPress={this.selectFile}
            buttonStyle={styles.panelButton}
            title={'Upload Prescription'}
            icon={
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                size={17}
                color="white"
              />
            }
          />
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
            <Button
                  onPress={this.addPrescription}
                  buttonStyle={styles.panelButton}
                  title={'Save Prescription'}
                />
        </View>
      </BottomSheet>
    );
  }
}

const styles = StyleSheet.create({
 panel: {
    padding: 30,
    backgroundColor: "white"
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
    marginTop: 10
  },
  panelButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    alignItems: "center"
  }
});
