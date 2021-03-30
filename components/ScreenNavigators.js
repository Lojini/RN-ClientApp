import * as React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer , getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faPills,faCalendarAlt,faBookmark,faCog, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PrescriptScreen from '../screens/PrescriptScreen';
import Color from '../constants/Colors';
import ReportsScreen from '../screens/ReportsScreen';
import OthersScreen from '../screens/OthersScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();
function TabNavigator() {
    return (
      <Tab.Navigator 
         screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                 iconName = faHome
            } else if (route.name === 'Calendar') {
                 iconName = faCalendarAlt
            }
            else if (route.name === 'Prescription') {
                 iconName = faPills
            }
            else if (route.name === 'Reports') {
                 iconName = faBookmark
            }else if (route.name === 'Other') {
                 iconName = faEllipsisH
            }
             
            // You can return any component that you like here!
            return <FontAwesomeIcon icon={iconName} size={size} color={color}/>;
          },
        })}
       
        tabBarOptions={{
          activeTintColor: Color.primaryColor,
          inactiveTintColor:Color.inactiveColor
          
        }}
        
        >
        <Tab.Screen name="Home" component={HomeScreen}  />
        <Tab.Screen name="Calendar" component={CalendarScreen}/>
        <Tab.Screen name="Prescription" component={PrescriptScreen} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
        <Tab.Screen name="Other" component={OtherStackNavigator} />
      </Tab.Navigator>
    );
}

function OtherStackNavigator(){
  return(
     <Stack.Navigator>
          <Stack.Screen name="Other" options={{headerShown: false}} component={OthersScreen} />
          <Stack.Screen name="Orders" options={{headerShown: false}} component={OrdersScreen} />
     </Stack.Navigator>
    );
}

export default function ScreenNavigator(){
    return(
    <NavigationContainer>
     <Stack.Navigator>
          <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="Home" component={TabNavigator} options={{headerShown:false}} />
     </Stack.Navigator>
    </NavigationContainer>
    );
}