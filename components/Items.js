import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { FloatingAction } from "react-native-floating-action";

const actions = [
    {
      text: 'Add',
      name: 'add',
      icon: require("../assets/plus-round-icon.png"),
      position: 1,
    },
  ]
  
export default function Items({route}){

  const txt = route.params.text;


  const navigation = useNavigation();


  const Api_Url = 'http://192.168.27.100:8000/item';

const [userData, setMyUserData] = useState('');
const [selectedUserData, setSelectedUserData] = useState('');
const [refreshing, setRefreshing] = useState(false);

const fetchData = async()=>{

  try{
      
    const response = await fetch(Api_Url);
      const json = await response.json();
      console.log('json:', json);
      setMyUserData(json);
    //   setRefreshing(false);

    const selectedData = json.filter(item => item.category === txt);
     setSelectedUserData(selectedData);
     console.log('selected:', selectedUserData);
     setRefreshing(false);    
    
    }
    catch(error)
    {
        console.log('error in fetching');
      } 
    }
    useEffect(()=>{
        fetchData();
      }, []);

      const handleRefresh=()=>{
        setRefreshing(true);
        fetchData();
      }

      const handleDelete= async(itemId)=>{
        // if(!itemId){
        //   return;
        // }
        try{const response = await fetch(`http://192.168.27.100:8000/item/${itemId}`,{
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
      
      const handleButton=()=>{
        navigation.navigate('ItemCategory', {category: txt});
      }

      const handleActionPress = (name) => {
    
        switch(name){
          case 'add':
            handleButton();
            break;
        }
      }

      return(
        <View>
            <View style={{height: '100%'}}>
            <Text style={{fontSize:30, fontWeight:'bold'}}>{txt}</Text>
            <FlatList
            data={selectedUserData}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
              refreshing = {refreshing}
              onRefresh={handleRefresh}/>
            }
            renderItem={({item}) => {
            return(
             <View key={item._id} style={{paddingTop:0, paddingBottom:5, borderWidth:1, width:'100%', flexDirection:'row', height:140, marginBottom:10  }}>
               <Image style={{ width: '30%', height: '100%', alignContent: 'center' }} source={{ uri:item.image }} />
               <View style={{flexDirection:'column'}}>
               <Text style={{fontWeight:'normal', fontSize:30, paddingLeft:10, flexWrap:'wrap'}}>{item.text}</Text>
               <Text style={{fontWeight:'normal', fontSize:20, paddingLeft:140, flexWrap:'wrap', paddingTop:70}}>Rs:{item.price}</Text>
               </View>
               <TouchableOpacity style={{paddingBottom:5, width:60, paddingRight:0}} onPress={()=>handleDelete(item._id)}><Text style={{ fontSize:15, paddingTop:0, paddingLeft:0, color:'blue'}}>Delete</Text></TouchableOpacity>
               </View>
            )
   
            }}
            
            />
            </View>
            <View style={{paddingBottom:10}}>
            <FloatingAction
        actions={actions}
        onPressItem={handleActionPress}
      />
      </View>
      </View>
    );
}