import React,{useEffect, useState} from 'react';
import api from '../../services/api';
import io from 'socket.io-client'
import './style.css';

import More from '../../assets/more.svg'
import Like from '../../assets/like.svg'
import Comment from '../../assets/comment.svg'
import Send from '../../assets/send.svg'


function Feed(){
    
    const [feed, setfeed] = useState([]);

    useEffect(() => {
        async function getFeed(){
            const response = await api.get('posts');
            console.log(response.data);
            setfeed(response.data);
        }
        getFeed();
    }, [])
    

    registerToStocket();
    
    async function registerToStocket(){
        const socket= io('http://localhost:3333');
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
        <section id="post-list">

            {feed.map(post=>(
               <article key={post._id} >
                <header>
                    <div className="user-info">
                       <span>{post.author}</span>
                        <span className="place">
                            {post.place}
                        </span>
                    </div>
                    <img src={More} alt="Mais"/>
                </header>

                <img src={`http://localhost:3333/files/${post.image}`} alt="" />

                <footer>
                    <div className="actions">
                        <button type="button" onClick
                        ={()=> handleLike(post._id)} >
                            <img src={Like} alt="Like"/>
                        </button>
                        <img src={Comment} alt="Comment"/>
                        <img src={Send} alt="Send"/>
                    </div>

                    <strong>{post.likes} curtidas</strong>

                    <p>
                        {post.description}
                        <span>{post.hashtags}</span>
                    </p>

                </footer>
            </article>
            ))}

        </section>
    )
}

export default Feed;