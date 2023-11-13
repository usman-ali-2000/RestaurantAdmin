import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button } from "react-native";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notification2() {
  const [adminToken, setAdminToken] = useState('');

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      GetFCMToken();
    }
  }
  
  async function GetFCMToken() {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      console.log(fcmtoken, "oldtoken");
      if (!fcmtoken) {
        fcmtoken = await messaging().getToken();
        await AsyncStorage.setItem("fcmtoken", fcmtoken);
        console.log(fcmtoken, "newtoken");
      }
      setAdminToken(fcmtoken); // Set the adminToken state with the FCM token
    } catch (e) {
      console.log(e, "error fcmToken");
    }
  }
  
  const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // You can handle the notification here as needed, e.g., navigate to a specific screen
    });
  }

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
    
    NotificationListener();
    GetFCMToken();

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const sendNotificationToServer = async () => {
 
try{
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'key=AAAA8kQDGcI:APA91bG-nix_y94TgwLlMba2jsWURujKlrsq_DI21g8vNDsqyBwFbgnljWxNplVyjrfi2CwvMYVkDvnfOjTuMffHPKYXm5yZ0Ypj2BOx9tWwppS3aB_jNJKW94BsT2vkCghprs_rShMU',
      },
      body: `{
      "to": "ePmFwMr-TyqNJgCxsCN-Mw:APA91bFtf033PLFYK08Pz-U0bevK0rz5g-K-CZdwPt1idLIS2zYFK3n3bpIPFP1GFlNldAJ1NG6ADD5_uwAgwaZRDalh_e0l8PP8HCTlRQ0hkpWs5Eh6EbCWtj6xfextw41t045DnImj",
      "collapse_key": "type_a",
      "notification": {
          "body": " this is a notification from myApp",
          "title": "MY_APP",
      },
      "data": {
          "body": "Liked your post",
          "title": "Fiyer",
          "key_1": "Value for key_1",
          "key_2": "Value for key_2"
      }
  }`,
  });

  response.json().then(data => {
      console.log(data);
  });
}
catch(e) {
console.log("Error: sendNotificationForLike>>", e)
}
  }


  return (
    <View>
      <Text>notification page...</Text>
      <Button title='send' onPress={sendNotificationToServer} />
    </View>
  );
}
