import React, {useState} from 'react';
import { useHistory } from "react-router-dom"
import api from '../../services/api';
import './style.css';

function New(){
    const [state, setState] = useState([{
        image: null,
        author:'',
        place:'',
        description:'',
        hashtags:''
    }])
    
    
    // const[author, setAuthor] = useState('')
    // const[place, setPlace] = useState('')
    // const[description, setDescription] = useState('')
    // const[hashtags, setHashtags] = useState('')
    
    let history = useHistory();
  
    async function handleSubmit(e){
        e.preventDefault();
        console.log(state);
        

        const data = new FormData();
        data.append('image', state.image);
        data.append('author', state.author);
        data.append('place', state.place);
        data.append('description', state.description);
        data.append('hashtags', state.hashtags);
        
        await api.post('posts',data)
        
        history.push('/')
        
    }



    function handleChange(e){
        setState({...state,[e.target.name]: e.target.value})
        // setAuthor(e.target.value);
        // setPlace(e.target.value);
        // setDescription(e.target.value);
        // setHashtags(e.target.value);
    }
    
    function handleImageChange(e){
        setState({image: e.target.files[0]});
    }


    return(
        <form id="new-post" onSubmit={handleSubmit}>
            
            <input type="file" onChange={handleImageChange}/>

            <input type="text" name="author" placeholder="Autor do post" onChange={handleChange} value={state.author} />
            <input type="text" name="place" placeholder="Local do post" onChange={handleChange}
            value={state.place}/>
            <input type="text" name="description" placeholder="Descrição do post" onChange={handleChange} value={state.description} />
            <input type="text" name="hashtags" placeholder="Hashtags do post" onChange={handleChange} value={state.hashtags}/>
            <button type="submit">Enviar</button>
        </form>

    );
}
export default New; 