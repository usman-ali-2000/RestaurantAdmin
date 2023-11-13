import React, { useState, useEffect } from "react";
import {Text, View, Image, Button, TextInput, Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";

const Api_Url = 'http://192.168.27.100:8000/item';

export default function ItemCategory({route}){

    const category = route.params.category;

    // const navigation = useNavigation();

    const [text, setText]= useState('');
    const [uploading, setUploading] = useState('');
    const [price, setPrice] = useState();
    let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddimtjtbm/upload";
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    useEffect(() => {
      const requestGalleryPermission = async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted');
      };
    
      requestGalleryPermission();
    }, []);

    const pickImage = async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEditing: true,
            aspect: [4,3],
            base64:false,
            quality:1
        });
    if(!result.canceled){
        setImage(result.assets[0].uri);
        
      }
    
    }

    if(hasGalleryPermission === false){
        return(<Text>no access to gallery...</Text>);
    }

    
    const handlePost = async () => {
        try {
          if (!image) {
            return;
          }
            
            setUploading('uploading...');
          let formData = new FormData();
          formData.append('file', { uri: image, name: 'image.jpg', type: 'image/jpeg' });
          formData.append('upload_preset', 'restaurantApp');
      
          fetch(CLOUDINARY_URL, {
            body: formData,
            headers: {
              'content-type': 'multipart/form-data'
            },
            method: 'POST',
          }).then(async r => {
            let data = await r.json();
            console.log(data);
            if (data.secure_url) {
              // Use the secure URL in your REST API
              console.log(data.secure_url);              
            // setRestUrl(data.secure_url);
            handleSubmit(data.secure_url);
              Alert.alert('uploaded successfully...');
            }
            setUploading('');
          }).catch(err => console.log(err));
        } catch (err) {
          console.log(err);
        }

      };

     const handleSubmit = async (imageUrl)=>{
      const data = { category, image: imageUrl, price, text };
      await fetch(Api_Url, {
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
   
  


    return(<View style={{justifyContent:'center'}}>
           <Button title='pick Image' onPress={()=> pickImage()} />
            {image && <Image source={{uri: image}} style={{height:200, width:200}}/>}
            <TextInput
        placeholder="text"
        value={text}
        onChangeText={setText}
        />
            <TextInput
        placeholder="price"
        value={price}
        onChangeText={setPrice}
        />
          
        <Text>{uploading}</Text>
        <Button title={String('Upload')} onPress={handlePost} />
           </View>);
    }