import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {View, Text, FlatList, Button, RefreshControl, Alert} from "react-native";

export default function Assign({route}){

    const customerEmail = route.params.customeremail;
    const customerToken = route.params.customertoken;
    const customerId = route.params.customerid;
    const customerName = route.params.customername;
    const customerAddress = route.params.customeraddress;

    const [userData, setUserData] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [customToken, setCustomToken] = useState('');

    const fetchDboy= async()=>{

        const response = await fetch('http://192.168.27.100:8000/dboy');
        const json = await response.json();
        setUserData(json);
        console.log('data:', json);
        setRefreshing(false);

    }

    const fetchToken=async(email)=>{
        try{ 
         const response = await fetch('http://192.168.27.100:8000/dboy');
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
                  'Authorization': 'key=AAAAcJqMecs:APA91bF9m92oQT3BvQUxBvwjkmOrQmIhxYBzOIlQNGEzwCqOeRWl0bOzUyr-NaAt7P20zZqYsJb71R_r9CcjUvcdSgI7-WPK1yamvxD3loqOpFN7btVO_pVpJfu9JO2ghn77eGQzAt2D',
            
                },
              body: `{
              "to": "${customToken}",
              "collapse_key": "type_a",
              "notification": {
                  "body": "${customerAddress}",
                  "title": "${customerName}",
              },
              "data": {
                  "body": "${customerEmail}",
                  "title": "Fiyer",
                  "key_1": "${customerId}",
                  "key_2": "${customerToken}"
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

          const submitNotification = async ()=>{
                    const data = { name: customerName, email: customerEmail, address: customerAddress, billid: customerId, pushtoken: customerToken, status: 'close' };
                    await fetch('http://192.168.27.100:8000/deliverynoti', {
                    method:'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                  })
                  .then(response => response.json())
                  .then(json => console.log(json))
                  .catch(error => console.error(error))
              
                  }
                          

    useEffect(()=>{
        setRefreshing(true);
        setName(customerName);
        fetchDboy();
        console.log('customerEmail', customerEmail);
        console.log('customerToken', customerToken);
        console.log('customerId', customerId);
        console.log('customerName', customerName);
        console.log('customerAddress', customerAddress);
    },[])

    const handleRefresh=()=>{
        setRefreshing(true);
        fetchDboy();
    }

    const handleAssign= async (email) =>{
        await fetchToken(email);
if(name !== '' && customToken !== '' ){
    await submitNotification();
await sendNotificationToServer();

        Alert.alert('Assigned...');
    }
    }
    
    return(
        <View style={{backgroundColor:'lightgrey', height:'100%'}}>
              {/* {data.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))} */}
<FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         data={userData}
         keyExtractor={(item) => item._id}
         refreshControl ={
         <RefreshControl
         refreshing = {refreshing}
         onRefresh={handleRefresh}/>
         }
         renderItem={({item}) => {
         return(
            <View style={{borderWidth:2, borderColor:'white', height:100, marginBottom:5, marginTop:10, borderRadius:20, backgroundColor:'white'}}>
            <Text style={{fontSize:20, fontWeight:'bold', paddingLeft:10,}}>Rider: {item.name}</Text>
            <Text style={{fontSize:20, fontWeight:'bold', paddingLeft:10}}>Phone: {item.phone}</Text>
            <View style={{width:100, marginLeft:200}}>
            <Button title="Assign" color={'green'} onPress={()=>handleAssign(item.email)}/>
            </View>
            </View>
         )

         }}
         
         />
        </View>
    )
}