import React from 'react';
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import ScreenNavigators from './components/ScreenNavigators';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';

const loadFonts=()=>{
  return Font.loadAsync({
    "montserrat":require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-semibold":require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "montserrat-bold":require("./assets/fonts/Montserrat-Bold.ttf")
  });
}
export default function App() {
  const [fontLoaded,setFontLoaded] = useState(false);

  if(!fontLoaded){
    return(
      <AppLoading
       startAsync={loadFonts}
       onFinish={()=>setFontLoaded(true)}
       onError={(err)=>console.error(err)}
       />
    );
  }
  return <SafeAreaProvider><ScreenNavigators/></SafeAreaProvider>;
}

