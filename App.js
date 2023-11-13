import BackendReg from "./components/BackendReg";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login";
import Main from "./components/Main";
import { useState, useEffect } from "react";
import CategaryForm from "./components/CategaryForm";
import { AppRegistry } from "react-native";
import ImagePick from "./components/ImagePick";
import Items from "./components/Items";
import ItemCategory from "./components/ItemCategory";
import Notification1 from "./components/Notification1";
import 'expo-dev-client';
import Notification2 from "./components/Notification2";
import Bills from "./components/Bills";
import messaging from '@react-native-firebase/messaging';
import Assign from "./components/Assign";
import Report from "./components/Report";
const Stack = createNativeStackNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    Vibration.vibrate([200, 100, 200]);
   console.log('vibrate successfully!');
  } catch (error) {
    console.log('Error while attempting to vibrate:', error);
  }  
  console.log('Message handled in the background!', remoteMessage);


});

AppRegistry.registerComponent('MyApp', ()=>App);

export default function App(props) {
const [isLogin, setLogin] = useState(props.isState);
 



  return(
    <NavigationContainer>
      <Stack.Navigator>
      {isLogin ? <Stack.Screen name="Home" component={Main}/> : <Stack.Screen name="Login" component={Login}/>}
      <Stack.Screen name="Register" component={BackendReg}/>
      <Stack.Screen name="Main" component={Main}/>
      <Stack.Screen name="CategaryForm" component={CategaryForm}/>
      <Stack.Screen name="ImagePick" component={ImagePick}/>
      <Stack.Screen name="Items" component={Items}/>
      <Stack.Screen name="ItemCategory" component={ItemCategory}/>
      <Stack.Screen name="Notification1" component={Notification1}/>
      <Stack.Screen name="Notification2" component={Notification2}/>
      <Stack.Screen name="Bills" component={Bills}/>
      <Stack.Screen name="Assign" component={Assign}/>
      <Stack.Screen name="Report" component={Report}/>
      </Stack.Navigator>
    </NavigationContainer>
  )};

