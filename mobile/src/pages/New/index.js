import React,{useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import api from '../../services/api'


export default function Feed({navigation}){
    navigation.setOptions({
        headerTitle: 'Nova Publicação'
    })


    const [author, setauthor] = useState('');
    const [place, setplace] = useState('');
    const [description, setdescription] = useState('');
    const [hashtags, sethashtags] = useState('');
    const [image, setImage] = useState({
        preview: null,
        image: null
    })




    useEffect(() => {   
        getPermissionAsync = async() =>{
            if(Constants.platform.ios){
                const { status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                if(status !=='granted'){
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        };
        getPermissionAsync();
    }, [])


    handleSelectImage = async () =>{
        // let result =  await ImagePicker.launchImageLibraryAsync({base64:true});
        
        // if(!result.cancelled){


        //     let prefix;
        //     let ext; 

        //     if(result.fileName){
        //         [prefix, ext] = result.uri.split('.')
        //         ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
        //     } else{
        //         prefix = new Date().getTime();
        //         ext = 'jpg';   
        //     }
        //         const image = {
        //             uri: result.uri,
        //             type: result.type,
        //             name: `${prefix}.${ext}`
        //         }


        //     setImage({preview: result.uri}, {image: image})
        // }

        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
                exif: true,
                base64: true
        });

        let prefix;
        let ext;
        
        if (pickerResult.uri) {
            let filename = pickerResult.uri.split('.')
            let auxPrefix = filename[2].split('/');
            prefix = auxPrefix[5];
            ext = filename[3];
            ext = ext === 'heic' ? 'jpg' : ext;
        } else {
            prefix = new Date.getTime();
            ext = 'jpg';
        }
        const img = {
        name: `${prefix}.${ext}`,
        type: pickerResult.type,
        uri: pickerResult.uri,
        }

        if (!pickerResult.cancelled) {
            // setImage({ preview: `data:image/jpeg;base64,${pickerResult.base64}` });
            // setImage({ image: img });
            setImage({preview: `data:image/jpeg;base64,${pickerResult.base64}`}, {image: img})
        }
        console.log(image);
    }






        
    //     async function getPhotoCamera(){
    //     let permissionsCamera = Permissions.CAMERA;

    //             let {status} = await Permissions.askAsync(permissionsCamera)
    //             console.log(permissionsCamera, status);
    //                 if(status === 'granted') {
    //                 let image = await ImagePicker.launchCameraAsync({
    //                 mediaTypes: 'Images',
    //                 }).catch(error => console.log(permissionsCamera, { error }));
    //                 console.log(permissionsCamera, 'SUCCESS', image);
    //                 }
        
        
    //             let pickerResult = await ImagePicker.launchImageLibraryAsync({
    //                 base64: true,
    //             });
    //             console.log(pickerResult);
        
    //                 if(pickerResult.cancelled === true){
    //                     return;
    //                 }
                    

                    // let formData = new formData();

                    // formData.append('image',{
                    //     uri: `data:image/jpeg;base64, ${pickerResult.data}` ,
                    //     name: `image.${fileType}`,
                    //     typ: `image/${fileType}`
                    // });



    //                 setImage(pickerResult.result)


    //                 // let pickerResult = await ImagePicker.launchImageLibraryAsync();
    //                 // console.log(pickerResult);
                
    //                 //     if(pickerResult.cancelled === true){
    //                 //         return;
    //                 //     }
                    
                        



                         
                        
    //                     // let fileName = fileName.split('.');
    //                     // const image ={
    //                     //     uri: pickerResult.uri,
    //                     //     type: "image/jpeg",
    //                     //     name: fileName
    //                     // }
                
    //                     // const formData = new FormData();
    //                     // formData.appeend("image", image);
                
                
                      
    // }
 



   async function handleSubmit(e){

        const data = new FormData();
        data.append('image', image);
        data.append('author', author);
        data.append('place', place);
        data.append('description', description);
        data.append('hashtags', hashtags);


        await api.post('posts',data)
        
        navigation.navigate('feed')
    }




    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.selectButton} onPress={ handleSelectImage }>
                    <Text style={styles.selectButtonText}>Selecionar imagem</Text>
                </TouchableOpacity>
                        { image && <Image style={styles.preview} source={{uri: image.preview}}/>  }
                        {/* {state.selectedImage && <Image style={styles.preview} source={{uri: state.selectedImage.localUri}} /> } */}

                        {/* {
                            stateImage.selectedImage && <Image style={styles.preview} source={{uri: stateImage.selectedImage.localUri}}/> 
                        } */}


                <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Nome do autor"
                    placeholderTextColor="#999"
                    value={author}
                    onChangeText={ setauthor}
                />

                <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Local da foto"
                    placeholderTextColor="#999"
                    value={place}
                    onChangeText={ setplace}
                />

                <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Descrição"
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={ setdescription}
                />

                <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Hashtags"
                    placeholderTextColor="#999"
                    value={hashtags}
                    onChangeText={  sethashtags}
                />

                <TouchableOpacity style={styles.shareButton} onPress={handleSubmit}>
                    <Text style={styles.shareButtonText}>compartilhar</Text>
                </TouchableOpacity>

            </View>        
        </>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30
    },

    selectButton:{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#CCC',
        borderStyle: 'dashed',
        height: 42,

        justifyContent: 'center',
        alignItems: 'center'
    },

    selectButtonText:{
        fontSize: 16,
        color: '#666',
    },

    preview:{
        width:100,
        height: 100,
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 4,
    },

    input:{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginTop: 10,
        fontSize: 16
    },

    shareButton:{
        backgroundColor: '#7159c1',
        borderRadius: 4,
        height: 42,
        marginTop: 15,

        justifyContent: 'center',
        alignItems: 'center',

    },

    shareButtonText:{
        fontWeight:'bold',
        fontSize: 16,
        color: '#FFF'
    }

});