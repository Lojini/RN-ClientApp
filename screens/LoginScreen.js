import React from 'react';
import {Keyboard,Text, Image, Dimensions,View, TextInput,SafeAreaView, TouchableWithoutFeedback, Alert, KeyboardAvoidingView,StyleSheet, ColorPropType} from 'react-native'
import Colors from '../constants/Colors';
import { Button,ListItem } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
var screenWidth = Dimensions.get('window').width; 

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.screen} behavior="padding">

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView>
        <View style={styles.screen}>
          <View>
          <Image source= {require("../assets/logo.png")} style={styles.image}/>
          </View>
          <View style={styles.fields}>
            <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true}/>
            <Button
              buttonStyle={styles.loginButton}
              title="Login"
              onPress={()=>this.props.navigation.replace('Home')}
            />
            <View style={{flexDirection:"row",justifyContent:"space-between",margin:30}}>
            <Text style={{color:Colors.primaryColor,fontFamily:'montserrat-semibold'}}>Create a New Account</Text>
            <FontAwesomeIcon icon={faArrowRight}  color={Colors.primaryColor}/>
            </View>    
          </View>
        </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    fields:{
        justifyContent:'center',
        width:screenWidth*0.67,
    },
    image:{
        resizeMode:'contain',
        width:screenWidth*0.5
    },
      loginFormTextInput: {
        height: 50,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        padding: 10,   
        marginTop: 20,
      },
      loginButton: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 5,
        height: 50,
        marginTop:20
      },
    screen:{
        fontFamily:'montserrat',
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        marginVertical: 20,
    }
});
