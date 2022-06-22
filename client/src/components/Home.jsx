import React, { useState } from 'react'
import axios from "axios";

const Home = () => {
    const [fileInput, setFileInput] = useState(null)
    // const { state, dispatch } = useContext(AuthContext)

    return(
       <form 
       onSubmit={(e)=> {
        e.preventDefault();

        const Data = new FormData();
        Data.append("file", fileInput)
        Data.append("upload_preset", "socialMediaPosts")

        axios
        .post("https://api.cloudinary.com/v1_1/socialmediapp/image/upload", Data)
        .then((res) => {
            console.log(res.data.url);
        })
        .catch((err)=> console.log(err.message))
       }}
       >

        <input type="file" id="img" accept=".png, .jpeg, .jpg"
        onChange={(e)=> setFileInput(e.target.files[0])}/>    
        <button type='submit'>send</button>
        </form>
    )
}
export default Home;