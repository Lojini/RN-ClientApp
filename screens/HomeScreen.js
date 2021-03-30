import React from "react";
import {
  View,
  Platform,
  Text,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Button,
  Icon,
  BottomSheet,
  Divider,
} from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";
import HeaderBar from "../components/Header";
const window = Dimensions.get("window");
import axios from "axios";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataItem: [],
      visible: false,
      status: false,
      refreshing: false,
      isStartTimePickerVisible: false,
      isEndTimePickerVisible: false,
      date:'',
      title:'',
      description:'',
      selectedStartTime: "",
      selectedEndTime: "",
      currentDate : new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)
    };
  }

  componentDidMount() {
    this.fetchData();
  }


  onRefresh() {
    this.setState({refreshing: true},() => {this.fetchData();});
  }

  fetchData() {
    axios
      .get("https://caretakerr.herokuapp.com/tasks/1")
      .then((resJson) => {
        this.setState({ data: resJson.data.tasks });
      })
      .catch((e) => console.log(e));
  }

  fetchDataById(id) {
    this.setState({ visible: true });
    axios
      .get("https://caretakerr.herokuapp.com/task/" + id)
      .then((resJson) => {
        console.log(resJson);
        this.setState({ dataItem: resJson.data.task });
        this.setState({date:resJson.data.task.date});
        this.setState({title:resJson.data.task.title});
        this.setState({description:resJson.data.task.description});
        this.setState({selectedStartTime:resJson.data.task.startTime});
        this.setState({selectedEndTime:resJson.data.task.endTime});
      })
      .catch((e) => console.log(e));
  }

  deleteTask(id) {
    axios
      .delete("https://caretakerr.herokuapp.com/task/" + id)
      .then((resJson) => {
        this.setState({ visible: false });
      })
      .catch((e) => console.log(e));
  }
  updateTask=(id)=>
    axios.put('https://caretakerr.herokuapp.com/task/'+id,
    {"title":this.state.title,"description":this.state.description,"startTime":this.state.selectedStartTime,"endTime":this.state.selectedEndTime,"date":this.state.date,"status":this.state.status}).
    then((resJson) => {
       this.setState({visible:false});
       this.fetchData();
    })
    .catch((e) => console.log(e));

  setStatus(value, id) {
    var temp = this.state.dataItem;
    if (temp.id == id) {
      temp.status = value == true ? 1 : 0;
    }

    this.setState({ dataItem: temp });
    this.updateTaskCompletion(value, id);
  }

  updateTaskCompletion(value, id) {
    if (value) {
      axios
        .put("https://caretakerr.herokuapp.com/task/complete/" + id)
        .then(() => {
          // this.fetchData();
        })
        .catch((e) => console.log(e));
    } else {
      axios
        .put("https://caretakerr.herokuapp.com/task/incomplete/" + id)
        .then(() => {
          // this.fetchData();
        })
        .catch((e) => console.log(e));
    }
  }

  showDateTimePicker = (name) => {
    if(name=="startTime")
     this.setState({ isStartTimePickerVisible: true })
     else
      this.setState({ isEndTimePickerVisible: true })
    }

  hideDateTimePicker = (name) => {
     if(name=="startTime")
     this.setState({ isStartTimePickerVisible: false })
     else
      this.setState({ isEndTimePickerVisible: false })
  }

  handleStartTimePicked = (pickedTime) => {
    this.setState({ selectedStartTime: (pickedTime.getHours())+":"+pickedTime.getMinutes()+":"+"00"});
    this.hideDateTimePicker("startTime");
  };

  handleEndTimePicked = (pickedTime) => {
    this.setState({ selectedEndTime: (pickedTime.getHours())+":"+pickedTime.getMinutes()+":"+"00"});
    this.hideDateTimePicker("endTime");
  };

  renderBottomsheet = (dataItem) => (
    <BottomSheet
      isVisible={this.state.visible}
      containerStyle={{ marginBottom: 38 }}
    >
      <View style={styles.panel}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.panelTitle}>View Task</Text>
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
                this.setState({ title: value });
            }}
            value={this.state.title}
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
        />
        <TextInput
           onChangeText={(value) => {
                this.setState({ description: value });
            }}
            value={this.state.description}
          placeholder={"Task Description"}
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
            value={this.state.selectedStartTime}
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
            editable={false}
            value={this.state.selectedEndTime}
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
        <View
          style={{
            margin: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: 14,
              fontFamily: "montserrat",
              color: "black",
            }}
          >
            Task Completed :
          </Text>
          <Switch
            style={{ flex: 1, marginLeft: 5 }}
            onValueChange={(value) => this.setStatus(value, dataItem.id)}
            value={dataItem.status == 1 ? true : false}
          />
        </View>
        <Button 
        onPress={() => this.updateTask(dataItem.id)}
        buttonStyle={styles.panelButton} title={"Save Task"} />
        <Button
          onPress={() => this.deleteTask(dataItem.id)}
          buttonStyle={styles.panelButton}
          title={"Remove Task"}
        />
      </View>
    </BottomSheet>
  );

  renderItemComponent = (data) => (
    <TouchableHighlight
      onPress={() => {
        this.fetchDataById(data.item.id);
      }}
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
          <View style={{ justifyContent: "space-between" }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat",
                color: "black",
              }}
            >
              {data.item.title}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "montserrat",
                fontSize: 14,
                color: "grey",
              }}
            >
              {data.item.description}
            </Text>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <Text style={{ fontFamily: "montserrat-bold" }}>
              {data.item.startTime}
            </Text>
            {data.item.status == true ? (
              <Divider
                style={{
                  marginTop: 9,
                  backgroundColor: "green",
                  height: 5,
                  borderRadius: 8,
                }}
              ></Divider>
            ) : this.state.currentDate<=data.item.date?(
              <Divider
                style={{
                  marginTop: 9,
                  backgroundColor: "grey",
                  height: 5,
                  borderRadius: 8,
                }}
              ></Divider>): (<Divider
                style={{
                  marginTop: 9,
                  backgroundColor: "red",
                  height: 5,
                  borderRadius: 8,
                }}
              ></Divider>
            )}
          </View>
        </View>
      </Card>
    </TouchableHighlight>
  );

  render() {
    return (
      <HeaderBar title="Home" name="Home" add="true" func={this.fetchData()}>
        <Card containerStyle={{ borderRadius: 9, marginBottom: 25 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size={16}
              color={Colors.primaryColor}
            ></FontAwesomeIcon>
            <Text
              style={{
                textAlign: "left",
                fontSize: 16,
                fontFamily: "montserrat-semibold",
                color: Colors.primaryColor,
              }}
            >
              {" "}
              Request Caregiver
            </Text>
          </View>
        </Card>
        <FlatList
          data={this.state.data}
          renderItem={(item) => this.renderItemComponent(item)}
          keyExtractor={(item) => item.id.toString()}
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
        />
        {this.renderBottomsheet(this.state.dataItem)}
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
    marginTop: 7,
  },
  panelButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
  },
});
