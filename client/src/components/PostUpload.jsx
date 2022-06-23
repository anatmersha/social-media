import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";  
import postUploadStyle from "../css/PostUpload.module.css";
import { MdVideoLibrary, MdLocationOn } from "react-icons/md";  
import { FaImages } from "react-icons/fa";  

const PostUpload = () => {  
    const [fileInput, setFileInput] = useState(null)
    const [postCaption, setPostCaption] = useState(false)
    const [fileType, setFileType] = useState("");
    const [fileLink, setFileLink] = useState(null) 
    const [coordinate, setCoordinate] = useState([])
    const [location, setLocation] = useState("") 

    const { state } = useContext(AuthContext)

    const isLocationGetCoords = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
            (position)=> {
                console.log(position);
                setCoordinate(position.coords)
            },(err)=> {
                console.error(err.message)
                })
        } else {
                console.log("Not Available..your location cant be accessed.Please turn your location on");
        }
    }

    useEffect(()=>{
        const getUserCityAndWeather = () => {
            const lon = coordinate.longitude;  
            const lat = coordinate.latitude; 
            const API_key = "c255b4157bff8cac3122182b59d9ee44";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`
            
            axios
            .get(url)
            .then((res)=> {
                console.log(res.data);
                let city = res.data.name;
                let country = res.data.sys.country;
                setLocation(city.concat(", ", country))
            })
            .catch((err)=> console.log(err))
    
        }
        if(coordinate) getUserCityAndWeather()
    },[coordinate, location])

    function submitFileHandler(e) {
        e.preventDefault();

            const data = new FormData();
            data.append("file", fileInput)
            data.append("upload_preset", "socialMediaPosts")

            if(fileType === "") {
                axios
                .post("/posts/text", {
                    userId: state?.currentUser?._id,
                    text: postCaption,
                    location: location
                })
                .then((res)=> {
                    console.log(res)
                    window.location.reload()
                })
                .catch((err)=> console.log(err))
            }

            if(fileType === "img") {
                axios
                .post(
                  "https://api.cloudinary.com/v1_1/socialmediapp/image/upload",
                  data
                )
                .then((res) => setFileLink(res.data.url));

                if(fileLink){
                    axios
                    .post("/posts/image", {
                        userId: state.currentUser?._id,
                        image: fileLink,
                        caption: postCaption,
                        location: location
                    })
                    .then((res)=> {
                        console.log(res)
                        window.location.reload()
                    })
                    .catch((err)=> console.log(err))
                }
            }
            
            if(fileType === "vid") {
                axios
                .post(
                  "https://api.cloudinary.com/v1_1/socialmediapp/video/upload",
                  data
                )
                .then((res) => setFileLink(res.data.url));

                if(fileLink){
                    axios
                    .post("/posts/video", {
                        userId: state.currentUser?._id,
                        video: fileLink,
                        caption: postCaption,
                        location: location
                    })
                    .then((res)=> {
                        console.log(res)
                        window.location.reload()
                    })
                    .catch((err)=> console.log(err))
                }
            }
    } 

    return(
        <div className={postUploadStyle.shareFrame}>
        <div>
            {/* text */}
            <img className={postUploadStyle.shareProfileImg} src={state?.currentUser?.img} alt=""/>
            <textarea className={postUploadStyle.shareCaptionImput} 
            rows="3" cols="49" maxLength="300"
            type="text" placeholder="Share with the comunity..."
            onChange={(e)=> setPostCaption(e.target.value)}/>
        </div>
        <br/>
        <hr style={{marginTop: "75px", width: "95%"}}/>
            {location ? 
            <p style={{textAlign: "left", marginLeft: "20px", marginTop: "0"}}>{location}</p>
            : ""}

            {fileInput ? 
            <div style={{width: "100%", height: "55vh", position: "relative"}}>

                {fileType === "img" ? 
                <img className={postUploadStyle.sharedImg} 
                src={URL.createObjectURL(fileInput)} alt=""
                />: ""}

               {fileType === "vid" ?  
                <video className={postUploadStyle.sharedImg} controls>
                <source src={URL.createObjectURL(fileInput)} type="video/ogg"/>
                </video>
               : ""}
                

                <span style={{position: "absolute", fontSize: "25px", right: "140px"}}
                onClick={()=> {
                    setFileInput(null)
                }}><i class="fa fa-close"></i></span>
            </div>
            : ""}

        <form className={postUploadStyle.shareForm} onSubmit={submitFileHandler}>

            {/* image */}
            <label htmlFor="img" className={postUploadStyle.shareLabel}
            onClick={()=> setFileType("img")}>
                <FaImages/>
                {/* <i class='far fa-image'></i> */}
                <input style={{display: "none"}} type="file" id="img" accept=".png, .jpeg, .jpg"
                onChange={(e)=> setFileInput(e.target.files[0])}/>
            </label>

            {/* video */}
            <label htmlFor="file" className={postUploadStyle.shareLabel}
            onClick={()=> setFileType("vid")}>
                {/* <i class='fas fa-film'></i> */}
                <MdVideoLibrary/>
                <input style={{display: "none"}} type="file" id="file" accept=".mp4"
                onChange={(e)=> setFileInput(e.target.files[0])}/>
            </label>

            {/* location */}
            <span className={postUploadStyle.shareLocation}
                onClick={isLocationGetCoords}>
                    <MdLocationOn/>
                {/* <i class='fas fa-map-marker-alt'></i> */}
            </span>

            <button className={postUploadStyle.shareBtn} type="submit">submit</button>
                {/* tag ?? <i class='fas fa-tag'></i> /tags*/}
        </form>
        </div>  
    )
}

export default PostUpload;