import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Text, View } from "react-native";

export default function Report(){

    const [bills, setBills]  = useState(0);
    const [userData, setUserData] =  useState([]);
    const [todayDate, setTodayDate] = useState(0);

    const fetchBill= async()=>{

        const response  = await fetch('http://192.168.27.100:8000/bill');
        const json = await response.json();
        setUserData(json);
        //  setRefreshing(false);
        
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

    const filterBillsLastSevenDays = (bill) => {
        const today = new Date();
        const billDate = new Date(bill.date);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return billDate >= sevenDaysAgo && billDate <= today;


      };

      const billsLastSevenDays = userData.filter(filterBillsLastSevenDays);

      const getBill=async()=>{

      billsLastSevenDays.map((item)=>  setBills(bills+item.total) );
      console.log(bills);

      }

      let orderno = 0;
      let now = 0;
      const [noOfOrders, setNoOfOrders] = useState(0);
      
    
useEffect(()=>{
    
    fetchBill();
    let total = 0;
    orderno = 0;
    billsLastSevenDays.forEach((item) => {
      total += item.total;
      orderno += 1;
    });
    setBills(total);
    setNoOfOrders(orderno);
    now = Date();
    setTodayDate(now);
// console.log(bills)
},[billsLastSevenDays])

    return(
        <View>
            <Text style={{fontSize:20}}>{todayDate}</Text>    
            <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor:'grey', marginTop:20}}>
            <View style={{flexDirection:'column', marginLeft: 40}}>
            <Text style={{marginLeft:5, fontWeight:'bold', fontSize: 20}}>no. of orders</Text>
            <Text style={{marginLeft:40, fontWeight:'bold', fontSize: 20}}>{noOfOrders}</Text>
            </View>
            <View style={{flexDirection:'column', marginLeft:50}}>
            <Text style={{marginLeft:15, fontWeight:'bold', fontSize: 20}}>total sale</Text>
            <Text style={{marginLeft:30, fontWeight:'bold', fontSize: 20}}>{bills}</Text>
            </View>
        </View>
        </View>

    //     <FlatList
    //     data={billsLastSevenDays}
    //     keyExtractor={(item) => item._id}
    //     renderItem={({ item }) => (
    //       <View>
    //         <Text>Name: {item.name}</Text>
    //         <Text>Address: {item.address}</Text>
    //         {/* Include other bill details as needed */}
    //       </View>
    //     )}
    //   />
    )
}