import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, FlatList, Image, TouchableOpacity, Modal, RefreshControl, Vibration } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    Vibration.vibrate([200, 100, 200]);
   console.log('vibrate successfully!');
  } catch (error) {
    console.log('Error while attempting to vibrate:', error);
  }  
  console.log('Message handled in the background!', remoteMessage);


});

const actions = [
  {
    text: 'Add',
    name: 'add',
    icon: require("../assets/plus-round-icon.png"),
    position: 1,
  },
]


const Api_Url = 'http://192.168.27.100:8000/categoryForm';
const Api_Url1 = 'http://192.168.27.100:8000/bill';

export default function Main() {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Main',
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={()=>navigation.navigate('Bills')}><Text>Bills</Text></TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  const NotificationListener = () => {
   
    messaging().onNotificationOpenedApp(remoteMessage => {  
      try {
        Vibration.vibrate([200, 100, 200]);
       console.log('vibrate successfully!');
      
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // You can handle the notification here as needed, e.g., navigate to a specific screen
      navigation.navigate(remoteMessage.data.key_3)

    } catch (error) {
      console.log('Error while attempting to vibrate:', error);
    }
    });
  }
  
  const [status, setStatus] = useState('');
  const [customToken, setCustomToken] = useState('');

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
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        Vibration.vibrate([200, 100, 200]);
       console.log('vibrate successfully!');
      console.log('Message handled in the background!', remoteMessage);

    } catch (error) {
      console.log('Error while attempting to vibrate:', error);
    }  
   
    });
  

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      
    try {
      Vibration.vibrate([200, 100, 200]);
     console.log('vibrate successfully!');
    
      const message = JSON.stringify(remoteMessage);
      const title = remoteMessage.notification.title;
      const title2 = remoteMessage.notification.body;
      const title3 = remoteMessage.data.key_1;
      const notification1 = remoteMessage.data.title;
      const  email = remoteMessage.data.body;
     
      setEmail(email);
      
      // if(notification && remoteMessage.data.includes('cancelOrder')){

      if(notification1 === 'cancelOrder'){  

      const customerId =  remoteMessage.data.key_1;  
      
    Alert.alert(
  'Confirm Deletion',
  'Are you sure you want to delete this?',
  [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: async () => {
        if(customToken !== ''){
        await fetchData(email);
        await fetchToken(email);
        setStatus('cannot delete this order');
        await sendNotificationToServer();
        }
      },
    },
    {
      text: 'Confirm',
      onPress: async () => {
        if(customToken !== ''){
        await deleteBill(customerId);
        await fetchData(email);
        await fetchToken(email);
        setStatus('deleted');
        await sendNotificationToServer();
        }
      },
    },
  ],
  { cancelable: true }
);
  }
      else
      {
      Alert.alert('A new FCM message arrived!', title +'\n'+title3);
     }  
    } catch (error) {
      console.log('Error while attempting to vibrate:', error);
    }
    });
  
    return unsubscribe;
  
  },[fetchToken]);
  
  const deleteBill= async(id)=>{
    try{
      await fetch(`http://192.168.27.100:8000/bill/${id}`,{
        method: 'DELETE',
      })

  setModalVisible(false);
  Alert.alert('order deleted successfully...');
    
}catch(e){

      console.log('error while deleting bill...', e);
    
    }
  }

  const fetchToken=async(email)=>{
   try{
     
    const response = await fetch('http://192.168.27.100:8000/customer');
    const json = await response.json();
    const selectedData = await json.filter(item => item.email === email );
    // console.log(selectedData);
    const item = selectedData[0];
    const customerToken = item.pushtoken;
    setCustomToken(customerToken);
    console.log('token:',customToken);
  }
  catch(e){
    console.log('error...', e);
  }
  }


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
          "to": "${customToken}",
          "collapse_key": "type_a",
          "notification": {
              "body": "Cooking...",
              "title": "Admin",
          },
          "data": {
              "body": "Liked your post",
              "title": "Fiyer",
              "key_1": "Bill",
              "key_2": "${status}"
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

  const [modalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState('');

  const navigation = useNavigation();
 
  const handleButton = () => {
 
    navigation.navigate("CategaryForm");
 
  };

  const [myUserData, setMyUserData] = useState('');
  // const [billIndex, setBillIndex]  = useState('');

  const fetchData = async()=>{
    try{
      const response = await fetch(Api_Url);
      const json = await response.json();
      console.log('json:', json);
      setMyUserData(json);
      setRefreshing(false);

      // const response2 = await fetch(Api_Url1);
      // const json2 = await response2.json();
      // const limitedData = json2.slice(0,10);
      // console.log(limitedData.length-1);
      // setBillIndex(limitedData.length-1);
        }catch(error){
        console.log('error in fetching');
      }
      
    }
    const handleRefresh=()=>{
      setRefreshing(true);
      fetchData();
    }
  
    React.useEffect(()=>{
      const unsubscribe = navigation.addListener('focus', ()=>{
        setRefreshing(true);
        fetchData();
        setTimeout(()=>
        setRefreshing(false), 2000);
      });
      return unsubscribe;     
    }, []);
    
   
    const handleDelete= async()=>{
      if(!itemId){
        return;
      }
      try{const response = await fetch(`http://192.168.27.100:8000/categoryForm/${itemId}`,{
        method:'DELETE',
      });
      if(response.status===200){
        Alert.alert('successfully deleted');
        fetchData();
      }else{
        console.log('error in while deleting data');
      }
    }catch(e){
    console.log('Error:'+e);
  }
}

const showAlert =() => {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete this?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => handleDelete() },
    ],
    { cancelable: true },
  );
  setModalVisible(false);
};

const handleModal = (id2)=>{
  setModalVisible(true);
  setItemId(id2);
  }

  useEffect(()=>{
    fetchData();
  }, []);


  const handleActionPress =(name)=>{
    
    switch(name){
      case 'add':
        handleButton();
        break;
    }
  }

  return (
    <View style={{paddingBottom:0, paddingTop:2, flexDirection:'column', marginVertical:0, backgroundColor:'lightgrey'}}>
        <View style={{flexDirection:'column', marginVertical:0, paddingBottom:0, height:'100%'}} >
         <FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         data={myUserData}
         keyExtractor={(item) => item._id}
         refreshControl ={
         <RefreshControl
         refreshing = {refreshing}
         onRefresh={handleRefresh}/>
         }
         renderItem={({item}) => {
         return(
          <View key={item._id} style={{paddingTop:0, paddingBottom:5, width:'100%', marginVertical:10, borderRadius:30, backgroundColor:'white'  }}>
            <View style={{ paddingLeft:300, width:30}}>
            <TouchableOpacity style={{paddingBottom:5, width:30, paddingRight:0}} onPress={()=>handleModal(item._id)}><Text style={{fontWeight:'bold', fontSize:30, paddingTop:0, paddingLeft:0}}>...</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('Items', {text: item.text})}>
            <Image style={{ width: '100%', height: 200, alignContent: 'center' }} source={{ uri:item.image }} />
            <Text style={{fontWeight:'normal', fontSize:30, paddingLeft:10, flexWrap:'wrap'}}>{item.text}</Text>
            </TouchableOpacity>
            </View>
         )

         }}
         
         />
          <View style={{flexDirection:'column', flex:1, marginVertical:5, justifyContent:'space-between'}}>
           <Modal 
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={()=>{
            setModalVisible(!modalVisible);
          }}
          supportedOrientations={['portrait', 'landscape']}
          useNativeDriver={true}>
            <View style={{alignItems:'center', width:'100%', justifyContent:'space-between'}}>
              <TouchableOpacity onPress={()=>showAlert()} style={{width:'100%', paddingBottom:5}} ><Text style={{fontWeight:'bold', borderWidth:1, height:30, width:'100%', textAlign:'center'}} >Delete</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setModalVisible(false)} style={{width:'100%', paddingTop:5}} ><Text style={{fontWeight:'bold', borderWidth:1, height:30, width:'100%', textAlign:'center'}}>Close</Text></TouchableOpacity>
            </View>
          </Modal>
          </View>
          </View>
          <View style={{paddingBottom:10}}>
          <FloatingAction
        actions={actions}
        onPressItem={handleActionPress}
      />
      </View>
          </View> 
  );
};
