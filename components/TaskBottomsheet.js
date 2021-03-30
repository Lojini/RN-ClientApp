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
import { faCalendarAlt, faClock, faCloudUploadAlt,faTimes} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/Colors';
const window = Dimensions.get('window');
import axios from 'axios';
import HomeScreen from '../screens/HomeScreen'
import DateTimePicker from "react-native-modal-datetime-picker";


export default class TaskBottomsheet extends React.Component {
  
  constructor(props) {
    super(props);
    this.visibility = true;
    this.state = {
      visible:true,
      title:'',
      description:'',
      startTime:'',
      endTime:'',
      date:'',  
      isStartTimePickerVisible:false,
      isEndTimePickerVisible:false,
      isDatePickerVisible:false
    };
  }
 
  addTask=()=>
    axios.post('https://caretakerr.herokuapp.com/task',
    {"title":this.state.title,"description":this.state.description,"startTime":this.state.startTime,"endTime":this.state.endTime,"date":this.state.date,"user":1}).
    then((resJson) => {
      this.props.active;
       this.props.func;
      console.log(resJson);
    })
    .catch((e) => console.log(e));

    showDateTimePicker = (name) => {
      if(name=="startTime")
      this.setState({ isStartTimePickerVisible: true });
      else if(name=="endTime")
      this.setState({ isEndTimePickerVisible: true });
      else if(name=="date")
      this.setState({ isDatePickerVisible: true });
      }

    hideDateTimePicker = (name) => {
      if(name=="startTime")
      this.setState({ isStartTimePickerVisible: false });
      else if(name=="endTime")
      this.setState({ isEndTimePickerVisible: false });
      else if(name=="date")
      this.setState({ isDatePickerVisible: false });
    }

    handleDatePicked = (pickedDate) => {
      this.setState({ date: (pickedDate.getFullYear())+"-"+("0" + (pickedDate.getMonth() + 1)).slice(-2) +"-"+("0" + (pickedDate.getDate())).slice(-2) });
      this.hideDateTimePicker("date");
    };
  
    handleStartTimePicked = (pickedTime) => {
      this.setState({ startTime: (pickedTime.getHours())+":"+pickedTime.getMinutes()+":"+"00"});
      this.hideDateTimePicker("startTime");
    };
  
    handleEndTimePicked = (pickedTime) => {
      this.setState({ endTime: (pickedTime.getHours())+":"+pickedTime.getMinutes()+":"+"00"});
      this.hideDateTimePicker("endTime");
    };

  render() {
    return (
      <BottomSheet
        isVisible={true}
        containerStyle={{ marginBottom: 38 }}>
        <View style={styles.panel}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.panelTitle}>New Task</Text>
            <TouchableOpacity onPress={this.props.active}>
              <FontAwesomeIcon
                icon={faTimes}
                size={20}
                color={Colors.primaryColor}></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <TextInput
            onChangeText={(value) => {
                this.setState({ title: value });
            }}
            value={this.state.title}
            placeholder={'Title'}
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <TextInput
            onChangeText={(value) => {
                this.setState({ description: value });
            }}
            value={this.state.description}
            placeholder={'Task Description'}
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
          placeholder="Task Date"
            editable={false}
            value={this.state.date}
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <Button
            onPress={() => {
              this.showDateTimePicker("date");
            }}
            buttonStyle={{ backgroundColor: Colors.primaryColor }}
            icon={
              <FontAwesomeIcon icon={faCalendarAlt} size={17} color="white" />
            }
          />
          <DateTimePicker
            isVisible={this.state.isDatePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={()=>this.hideDateTimePicker("date")}
            mode={"date"}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
          placeholder="Start Time"
            editable={false}
            value={this.state.startTime}
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <Button
            onPress={() => {
              this.showDateTimePicker("startTime");
            }}
            buttonStyle={{ backgroundColor: Colors.primaryColor }}
            icon={
              <FontAwesomeIcon icon={faClock} size={17} color="white" />
            }
          />
          <DateTimePicker
            isVisible={this.state.isStartTimePickerVisible}
            onConfirm={this.handleStartTimePicked}
            onCancel={()=>this.hideDateTimePicker("startTime")}
            headerTextIOS={"Pick a Time"}
            mode={"time"}
          />
          </View>
            <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
          placeholder="End Time"
            editable={false}
            value={this.state.endTime}
            placeholderColor="#c4c3cb"
            style={styles.loginFormTextInput}
          />
          <Button
            onPress={() => {
              this.showDateTimePicker("endTime");
            }}
            buttonStyle={{ backgroundColor: Colors.primaryColor }}
            icon={
              <FontAwesomeIcon icon={faClock} size={17} color="white" />
            }
          />
          <DateTimePicker
            isVisible={this.state.isEndTimePickerVisible}
            onConfirm={this.handleEndTimePicked}
            onCancel={()=>this.hideDateTimePicker("endTime")}
            headerTextIOS={"Pick a Time"}
            mode={"time"}
          />
        </View>
          <Button
            onPress={this.addTask}
            buttonStyle={styles.panelButton}
            title={'Save Task'}
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
