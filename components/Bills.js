import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { View, Text, FlatList, Button, RefreshControl, TouchableOpacity } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from "@react-navigation/native";


export default function Bills(){

  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Bills',
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={()=>navigation.navigate('Report')}><Text>Report</Text></TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  //  const index = route.params.index;

    const [userData, setUserData]= useState([]);
    const [customToken, setCustomToken] = useState('');
    // const [initialItemId, setInitialItemId] = useState(index);
    // const [indexLength, setIndexLength] = useState(index);
    const [refreshing, setRefreshing] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    // const [n, setN] = useState(index);    

    const navigation = useNavigation();

    const ref = useRef();

    const n =10;

    const fetchBill= async()=>{
        const response  = await fetch('http://192.168.27.100:8000/bill');
        const json = await response.json();
        setUserData(json);
         setRefreshing(false);
        
            for(let i=0; i<json.length; i++){
            const item = json[i];
            const name =item.name;
            const address = item.address;
            const email = item.email;
            // console.log(name);
            // console.log(email);
            // console.log(address);
            const cat = item.category;
            const text = item.text;
            const price = item.price;
            const qty = item.quantity;
            // for(let j=0; j<cat.length; j++){
            //     console.log(cat[j]);
            //     console.log(text[j]);
            //     console.log(price[j]);
            //     console.log(qty[j]);
            // }
        }
    }

    const fetchToken=async(email)=>{
        const response = await fetch('http://192.168.27.100:8000/customer');
        const json = await response.json();
        const selectedData = json.filter(item => item.email === email );
        // console.log(selectedData);
        const customerToken = selectedData[0].pushtoken;
        setCustomToken(customerToken);
        console.log(customToken);
      }

      const checkStatus=()=>{
        if(item.status === 'Accept'){
        return true;
        }else{
          return false;
        }
      }

const orderAccept=async(email, adminId)=>{
try{
await fetchToken(email);

if(customToken !== ''){
const patchContent = await fetch(`http://192.168.27.100:8000/bill/${adminId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Accept' }),
        });
        // setOrderStatus(true);
await fetchBill();
await sendNotificationToServer();
      }
}catch(e){
  console.log('error fetching token...',e);
}
}

const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // ref.current.scrollToIndex({index: userData.length-1});
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // You can handle the notification here as needed, e.g., navigate to a specific screen
      
    });
  }

  useEffect(() => {

    fetchBill();

    // handleRefresh();

    // handleScroll();

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
      // ref.current.scrollToIndex({index: remoteMessage.data.key_2});
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // ref.current.scrollToIndex({index: remoteMessage.data.key_2});
      
    });

    return unsubscribe;
  }, [fetchBill]);

    
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
                  "key_2": "20...30 mins"
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


  const getItemLayout=(data, index)=> {
    return { length: 500, offset:  500* index, index };
}

const handleLimitedData=()=>{
 const limitedN = n+10;
 setN(limitedN);
  // setIndexLength(n);
  fetchBill();
}

  // setTimeout(() => scrollToIndex(indexLength), 2000);

  // const scrollToIndex = index => {
  //   ref?.current?.scrollToIndex({
  //       animated: true,
  //       index: index,
  //   });
  // }

  const handleRefresh=()=>{
    setRefreshing(true);
    fetchBill();
  }

  const handleAssign= async ( email, id,  name, address )=>{
   await fetchToken(email);

   if(customToken!==''){
   navigation.navigate('Assign', {customeremail: email, customertoken: customToken, customerid:id, customername: name, customeraddress: address})
   } 
  }

  return(
        <View style={{height:'98%', backgroundColor:'lightgrey'}}>
        <FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         ref={ref}
         data={userData}
        //  getItemLayout={getItemLayout}
        //  initialScrollIndex={indexLength}
         keyExtractor={(item) => item._id}
         refreshControl ={
         <RefreshControl
         refreshing = {refreshing}
         onRefresh={handleRefresh}/>
         }
         renderItem={({item}) => {
         return(
          <View style={{borderColor:'grey',backgroundColor:'white', borderRadius:10, marginVertical:5}}>
            <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>name: {item.name}</Text>
            </View>
            <Text style={{fontSize:20, fontWeight:'bold'}}>address: {item.address}</Text>
            <Text style={{fontSize:20, fontWeight:'bold'}}>email: {item.email}</Text>
            <Text style={{fontSize:20, fontWeight:'bold'}}>phone: {item.phone}</Text>
            <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>status:</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginLeft:10, color: checkStatus?'green':'red'}}>{item.status}</Text>
            </View>
            <View style={{flexDirection:'row', borderBottomColor:'grey', borderBottomWidth:1}}>
                <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Category</Text>
                    {
                        item.category.map((categoryItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, width:80, height:50}}>{categoryItem}</Text>
                            </View>
                            ))
                    }
                    <Text style={{fontSize:20, width:80, height:50}}>delivery charges</Text>
                    <Text style={{fontSize:20, height:50}}>tax</Text>
                    <Text style={{fontSize:20, borderTopColor:'grey', borderTopWidth:2, height:50}}>total</Text>
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Items</Text>
                    {
                        item.text.map((textItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, width:130, height:50}}>{textItem}</Text>
                            </View>
                            ))
                    }
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Price</Text>
                    {
                        item.price.map((priceItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, height:50}}>{priceItem}</Text>
                            </View>
                            ))
                    }
                    <Text style={{fontSize:20, height:50}}>{item.delivery}</Text>
                    <Text style={{fontSize:20, height:50}}>{item.tax}</Text>
                    <Text style={{fontSize:20, borderTopColor:'grey', borderTopWidth:2, height:50}}>{item.total}</Text>
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Qty</Text>
                    {
                        item.quantity.map((quantityItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, height:50}}>{quantityItem}</Text>
                            </View>
                            ))
                    }
                </View>
            </View>
                <Text style={{marginLeft:0,fontSize:20, fontWeight:'bold'}}>date: {item.date}</Text>
            <View style={{flexDirection:'row'}}>
                <View style={{padding:10, width:150, marginLeft:20}}>
            <Button title='Accept' onPress={()=>orderAccept(item.email, item._id)} color={'brown'} />
            </View>
            <View style={{padding:10, width:150}}>      
            <Button title='Assign' onPress={()=>handleAssign(item.email, item._id, item.name, item.address )} />
            </View>
            </View>
            </View>
         )

         }}
        //  inverted={true}
        //  ListFooterComponent={listFootercomp}
 />
   {/* <Button title="next" onPress={handleLimitedData}/> */}
             </View>
    );
}