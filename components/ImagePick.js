import React from 'react';
import {useState, useEffect} from 'react';
import {Text, View, Image, Button} from "react-native";
import * as ImagePicker from "expo-image-picker";


export default function ImagePick(){
    
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(()=>{
        (async ()=>{
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

        })();
    },[]);

    const pickImage = async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowEditing: true,
            aspect: [4,3],
            quality:1,
        });
    if(!result.canceled){
        setImage(result.assets[0].uri);
    }
    };
    if(hasGalleryPermission === false){
        return(<Text>no access to gallery...</Text>);
    }
    


    return(<View style={{justifyContent:'center'}}>
           <Button title='pick Image' onPress={()=> pickImage()} style={{marginTop:30}}/>
            {image && <Image source={{uri: image}} style={{height:200, width:200}}/>}
           </View>);
}