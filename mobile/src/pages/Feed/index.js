import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client'
import api from '../../services/api';


import Camera from '../../../assets/camera.png';
import More from '../../../assets/more.png';
import Like from '../../../assets/like.png';
import Comment from '../../../assets/comment.png';
import Send from '../../../assets/send.png';

export default function Feed({navigation}){
    navigation.setOptions({
       headerRight:() =>(
           <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate('New')}>
               <Image source={Camera}/>
           </TouchableOpacity>
       )
    })
    
    const [feed, setfeed] = useState([]);
   
   
    
    useEffect(()=>{
        async function getFeed(){
            const response = await api.get('posts');
            console.log(response.data)
            setfeed(response.data);
            
        }
        getFeed();
        
    }, [feed]);
    
    registerToStocket();
    async function registerToStocket(){
        const socket= io('http://192.168.1.2:3333');
        socket.on('post', newPost=>{
            setfeed([newPost, ...feed]);
        })
        
        socket.on('like', likedPost=>{
            setfeed( feed.map(post =>
                post._id === likedPost._id ? likedPost : post)
                );
            })
        }
        
        function handleLike(id){
            api.post(`/posts/${id}/like`);
        }

        
    return(    
        <View>
            <FlatList 
                data={feed}
                keyExtractor={post => post._id}
                renderItem={({item})=>(
                    <View style={styles.feedItem} >
                        <View style={styles.feedItemHeader}>
                            <View style={styles.userInfo}>
                                <Text style={styles.name}>{item.author}</Text>    
                                <Text style={styles.place}>{item.place}</Text>
                            </View>

                            <Image source={More} />
                        </View>
                        
                        <Image style={styles.feedImage} source={{uri: `http://192.168.1.2:3333/files/${item.image}`}} />

                    <View style={styles.feedItemFooter}>
                        <View style={styles.actions}> 
                            <TouchableOpacity  style={styles.action} onPress={()=> handleLike(item._id)}>
                                <Image source={Like} />
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.action} onPress={()=>{}}>
                                <Image  style={styles.action} source={Comment} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.action} onPress={()=>{}}>
                                <Image source={Send} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.likes}> {item.likes} curtidas </Text>
                        <Text style={styles.description}> {item.description}</Text>
                        <Text style={styles.hashtags}> {item.hashtags}</Text>
                    </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },

    feedItem:{
        marginTop: 20
    },

    feedItemHeader:{
        paddingHorizontal: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    name: {
        fontSize: 14,
        color: '#000'
    },


    place: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },

    feedImage:{
        width: '100%',
        height: 400,
        marginVertical: 15,
    },

    feedItemFooter:{
        paddingHorizontal: 15,

    },

    actions:{
        flexDirection:'row',
    },

    action:{
        marginRight: 8,
    },

    likes:{
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000'
    },

    description: {
        lineHeight: 18,
        color: '#000',
    },

    hashtags: {
        color:'#00376b'
    }
})