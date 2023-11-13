import {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, Button, Alert, RefreshControl, ScrollView} from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { getExpoPushTokenAsync } from 'expo-notifications';


const Api_Url = 'http://192.168.27.100:8000/students';


export default function BackendReg({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage]= useState('');
  const [userData, setUserData]= useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    getExpoPushToken();
  }, []);

  const generateOTP=()=>{
          const digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    }

    const  sendOTP=async(email)=>{   
      const OTP = generateOTP();
      MailComposer.composeAsync({
        recipients: [email],
        subject: 'Your OTP',
        body: `Your OTP is ${OTP}. Please enter this code in the app to proceed.`,
      });
      return OTP;
    };

    const getExpoPushToken = async () => {
      
      try {
        const { data: token } = await getExpoPushTokenAsync();
        setExpoPushToken(token);
      } catch (error) {
        console.log('Error getting Expo push token:', error);
      }
    };

    
  const fetchData = async()=>{

    getExpoPushToken();

    const pushToken = await getExpoPushTokenAsync();
    setExpoPushToken(pushToken);

    try{
  const response = await fetch(Api_Url);
  const json = await response.json();
  console.log('json:', json); 
  setUserData(json);
  }catch(error){
    console.log('error in fetching');
  }
  
}



  const handleSubmit= async(Alert)=> {
    if (!name || !email || !phone || !address) {
      setErrorMessage('Please fill out all fields');
      return;
    }
   
    await fetchData();

     const result = userData.find(item => item.email === email);
     const result1 = userData.find(item =>  item.phone === phone);
      
     if(result===true) { 
           Alert.alert('email already exist');
    return;
    }

    if(result1){
      Alert.alert('phone number is already exist');
       return;
      }
       const data = { name, email, phone, address, password, pushtoken: expoPushToken };
      await fetch(Api_Url, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .then(()=>Alert.alert('registered'))
    .then(()=> navigation.navigate('Login'))
    .catch(error => console.error(error))
    }

    const handleRefresh2=()=>{
      setRefreshing(true);
      fetchData().then(() => setRefreshing(false));
    }

    const handleRefresh = async () => {
      setRefreshing(true);
      await handleSubmit(Alert);
      setRefreshing(false);
    };
    

  //   const phoneCheck = async(phone)=>{
  //       const phoneExistsResponse = await fetch(`${Api_Url}?phone=${phone}`);
  //       const phoneExistsJson = await phoneExistsResponse.json();
  //       if(phoneExistsJson.length>0){
  //         Alert.alert('phone number already exist');
  //         return true;
  //       }
  //        return false;
  //     }


  //   const emailCheck = async(email)=>{
  //     const emailExistsResponse = await fetch(`${Api_Url}?email=${email}`);
  //     const emailExistsJson = await emailExistsResponse.json();
  //     if(emailExistsJson){
  //       Alert.alert('email already exist');
  //     return true;
  //     }
  //     return false;
  // }

  //    const handleSubmit2 = async() => { 
      
  //  const emailExists = await emailCheck(email);
  //const phoneExists = await phoneCheck(phone);
    //   if(emailExists){
    //  return true;
    //   }
    //   else{
    //     handleSubmit();
    //     Alert.alert('Registered');
    //   }
    // }   
  return(
    <ScrollView 
    contentContainerStyle={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh2} />
     }>
                <TextInput
      placeholder="Enter name"
      value={name}
      onChangeText={setName}
    />
     <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
    />
     <TextInput
      placeholder="Phone"
      value={phone}
      onChangeText={setPhone}
    />
     <TextInput
      placeholder="Address"
      value={address}
      onChangeText={setAddress}
    />
     <TextInput
      placeholder="password"
      secureTextEntry={true}
      value={password}
      onChangeText={setPassword}
    />
    {errorMessage? <Text>{errorMessage}</Text>:null}
    <Button title='submit' 
    onPress={handleRefresh}
    />
    </ScrollView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'magenta',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form:{
    height:20
  }
});



