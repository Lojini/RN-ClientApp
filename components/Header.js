import React from "react";
import {
  Platform,
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { Button, BottomSheet } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faTimes,
  faCloudUploadAlt,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../constants/Colors";
import ReportBottomsheet from "../components/ReportBottomsheet";
import TaskBottomsheet from "../components/TaskBottomsheet";
import CalendarBottomsheet from "../components/CalendarBottomsheet";
import PrescriptionBottomsheet from "../components/PrescriptionBottomsheet";
const window = Dimensions.get("window");

const PARALLAX_HEADER_HEIGHT = 150;
const STICKY_HEADER_HEIGHT = 70;

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
    };
  }
  
  handleVisibleChange=()=>{
    this.setState({addVisible:!this.state.addVisible});
  }
  renderBottomsheet = (name) =>
    name == "Report" ? (
      <ReportBottomsheet func={this.props.func} active={this.handleVisibleChange} />
    ) : name == "Prescription" ? (
      <PrescriptionBottomsheet func={this.props.func} active={this.handleVisibleChange} />
    ) : name == "Home" ? (
      <TaskBottomsheet func={this.props.func} active={this.handleVisibleChange}/>
    ) : name == "Calendar" ? (
      <CalendarBottomsheet func={this.props.func} active={this.handleVisibleChange}/>
    ) : null;

  renderAddIcon = () =>
    this.props.name == "Report" ||
    this.props.name == "Prescription" ||
    this.props.name == "Home" ||
    this.props.name == "Calendar" ? (
      <TouchableOpacity onPress={() => this.setState({ addVisible: true })}>
        <FontAwesomeIcon
          icon={faPlus}
          color="white"
          size={20}
        ></FontAwesomeIcon>
      </TouchableOpacity>
    ) : null;

  render() {
    return (
      <ParallaxScrollView
        headerBackgroundColor={Colors.primaryColor}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        renderBackground={() => (
          <KeyboardAvoidingView behavior="position" style={{flex:1}}>
          <View key="background">
            <View
              style={{
                position: "absolute",
                top: 0,
                width: window.width,
                backgroundColor: Colors.primaryColor,
                height: PARALLAX_HEADER_HEIGHT,
              }}
            />
          </View>
          </KeyboardAvoidingView>
        )}
        renderForeground={() => (
          <View key="parallax-header" style={styles.parallaxHeader}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.sectionSpeakerText}>{this.props.title}</Text>
              {this.renderAddIcon()}
            </View>
          </View>
        )}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickyHeader}>
            <Text style={styles.stickySectionText}>{this.props.title}</Text>
          </View>
        )}
      >
        {this.props.children}
        {this.state.addVisible == true
          ? this.renderBottomsheet(this.props.name)
          : null}
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  stickyHeader: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: "flex-end",
    backgroundColor: Colors.primaryColor,
  },
  stickySectionText: {
    color: "white",
    fontSize: 20,
    fontFamily: "montserrat-semibold",
    textAlign: "left",
    margin: 10,
  },

  parallaxHeader: {
    marginHorizontal: 20,
    justifyContent: "center",
    flex: 1,
    flexDirection: "column",
    paddingTop: 50,
    backgroundColor: Colors.primaryColor,
  },

  sectionSpeakerText: {
    color: "white",
    fontFamily: "montserrat-semibold",
    fontSize: 34,
  },
});
