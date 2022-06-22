import MainNavbar from "../components/MainNavbar";
import profileStyle from "../css/Profile.module.css";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";  
import { Link } from "react-router-dom";
import Select from 'react-select';
import { AiOutlinePlusSquare, AiOutlineCloseSquare } from "react-icons/ai";

const Profile = () => {
    const [user, setUser] = useState([])
    
    const [categoryClicked, setCategoryClicked] = useState(null)
    const [savedCategoryClicked, setSavedCategoryClicked] = useState("image")
    const [myPosts, setMyPosts] = useState([])
    const [savedPosts, setSavedPosts] = useState([])
    const [followers, setFollowers] = useState(null)
    const [profileEdit, setProfileEdit] = useState(false)
    const [createConvo, setCreateConvo] = useState(false)
    const [nameInput, setNameInput] = useState("")
    const [cityInput, setCityInput] = useState("")
    const [ageInput, setAgeInput] = useState("")
    const [genderInput, setGenderInput] = useState("")
    const [bioInput, setBioInput] = useState("")
    const [fileInput, setFileInput] = useState(null)
    const [fileLink, setFileLink] = useState(null) 
    const [isFollowing, setIsFollowing] = useState(false);
    const [userOptions, setUserOptions] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [texts, setTexts] = useState([])
    const [images, setImages] = useState([])  

    const options = [
        {value: "male", label: "male"}, 
        {value: "female", label: "female"}, 
        {value: "other", label: "other"}
    ]
    const { state, dispatch } = useContext(AuthContext)

    useEffect(()=> {
        axios
        .get(`/users/user/${state.userID}`)
        .then((res)=> {
            setUser(res.data);
            console.log(state.userID);
        })
        .catch((err)=> {
            console.log(err.message);
        })
    },[state.userID])
    
    useEffect(()=> {
        setMyPosts(state.posts?.filter((post)=> post?.userId === state.userID))
    },[state.userID, state.posts]) 
    
    useEffect(()=>{
        const txt = myPosts?.filter((post)=> post.postTYP === "text")
        const img = myPosts?.filter((post)=> post.postTYP !== "text")
        setTexts(txt)
        setImages(img)
    },[myPosts])

    useEffect(()=> {
        // if(state.followers) {
            state.followers?.map((follower)=> {
                if(follower.userId === state.currentUser._id) {
                    console.log("is following");
                    setIsFollowing(true)
                }
            })
        // }
    },[followers, state.currentUser])

    useEffect(()=> {
        const saved = [];
        // if(user) {
          if(user?._id === state.currentUser?._id) {
            user.saved?.map((item)=> {
              state.posts?.map((post)=> {
                if(post._id === item) saved.push(post)
              })
            })
          }
        // }
      },[state.posts, state.currentUser, user])

      function deleteUserAuth() {
        const API_KEY = "AIzaSyD24t8rsYHvjCoJ9t4mI6IO4tcFzrWM7Vs";
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`;
        const idToken = state.auth.idToken;

            axios
            .post(url, {
                idToken
            })
            .then((res)=> {
                console.log(res);
            })
            .catch((err)=> {
                console.log(err.response.data.error?.message);
            });
    }

    return(
        <>
        
        <div className={profileStyle.firstFrame}>
                <MainNavbar/>
            <div className={profileStyle.secondFrame}>
                <> 


                <div className={profileStyle.firstCard}>
                    <button className={profileStyle.followBtn} 
                    onClick={()=> {
                        setIsFollowing(!isFollowing)
                        
                        const follower = {
                            userId: state?.currentUser._id,
                            created: new Date()
                        }

                        const following = {
                            userId: user._id,
                            created: new Date()
                        }

                        const userFollow = user?.followers?.find((it)=> it?.userId === state?.currentUser?._id)
                        console.log(userFollow);
                        
                        if(userFollow === undefined && user?._id !== state?.currentUser?._id) {
                            axios
                            .patch(`/users/followers/new/${user?._id}`,{follower})
                            .then((res)=> {
                                console.log(res)
                                // setFollowers(prev=> [...prev, res.data])
                            })
                            .catch((err)=> console.log(err)) 
                            
                            axios
                            .patch(`/users/following/new/${state?.currentUser?._id}`,{following})
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err)) 
                            
                            axios
                            .post("/chat/convo",{
                                senderID: state?.currentUser?._id,
                                receiverID: user?._id
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))

                            axios 
                            .post("/alerts/follower",{
                                alertType: "follow",
                                follower: state?.currentUser?._id,
                                userId: user?._id
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))

                        }
                        else{
                            const followerUserId = state?.currentUser?._id;
                            axios
                            .patch(`/users/followers/delete/${user?._id}`,{followerUserId})
                            .then((res)=> {
                                console.log(res)
                                // setFollowers(prev=> [...prev, res.data])
                            })
                            .catch((err)=> console.log(err))

                            const followerUser = user._id;
                            axios
                            .patch(`/users/following/delete/${state?.currentUser?._id}`,{followerUser})
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))

                            axios
                            .delete("/chat/convo", {
                                senderID: state?.currentUser?._id,
                                receiverID: user?._id
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))

                            axios 
                            .delete("/alerts/follower",{
                                follower: state?.currentUser?._id,
                                userId: user?._id
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))
                        }
                    }}
                    >{isFollowing ? "NOFOLLOW" : "FOLLOW"}</button>

                    <button className={profileStyle.msgBtn}><Link className={profileStyle.msgBtnLink} to="/Chat" 
                    onClick={()=> {

                        axios
                        .get("/chat/convo", {
                            senderID: state.currentUser?._id,
                            receiverID: user?._id
                        })
                        .then((res)=> {
                            console.log(res)
                            res.data !== 0 ?
                            res.data.map((it)=> {
                                console.log(it._id);
                                dispatch({ type: "currentChat", value: it?._id })
                            })
                            : setCreateConvo(!createConvo)
                        })
                        .catch((err)=> console.log(err))

                        if (createConvo && user?._id !== state.currentUser?._id) {
                            axios
                            .post("/chat/convo",{
                                senderID: state.currentUser?._id,
                                receiverID: user._id
                            })
                            .then((res)=> {
                                console.log(res)
                                const Data = res.data;
                                dispatch({ type: "currentChat", value: Data?.insertedId })
                            })
                            .catch((err)=> console.log(err))
                        }

                    }}
                    >MESSAGE</Link></button>

                    <img className={profileStyle.profileImg} src={user?.img} alt=""/>

                    {user?._id === state?.currentUser?._id ? 
                    <span className={profileStyle.editProfileBtn}
                    onClick={()=> setUserOptions(!userOptions)}><AiOutlinePlusSquare/></span>
                    : ""}

                {userOptions ? 
                <div>
                    <button onClick={()=> setProfileEdit(true)}>Edit Profile</button>
                    <button onClick={()=> setDeleteUser(true)}>Delete Account</button>
                </div>
                : ""}


                {profileEdit ? 
                <div className={profileStyle.profileEditFormBg}>
                <span className={profileStyle.profileEditClose} onClick={()=> setProfileEdit(!profileEdit)}><AiOutlineCloseSquare/></span>
                <form className={profileStyle.profileEditForm}
                onSubmit={(e)=> {
                    e.preventDefault();

                    const data = new FormData();
                    data.append("file", fileInput)
                    data.append("upload_preset", "socialMediaPosts")
            
                    axios
                    .post("https://api.cloudinary.com/v1_1/socialmediapp/image/upload", data)
                    .then((res) => setFileLink(res.data.url));

                    if(genderInput === "male" && !fileInput && state?.currentUser.img === "") setFileInput("/images/AvatarMen.png")
                    if(genderInput === "female" && !fileInput && state?.currentUser.img === "") setFileInput("/images/AvatarWomen.png")
                    if(genderInput === "other" && !fileInput && state?.currentUser.img === "") setFileInput("/images/unicorn.png")

                    if(fileLink){
                        axios
                        .patch(`/users/userInfo/${state?.currentUser._id}`, {
                            name: nameInput,
                            age: ageInput,
                            bio: bioInput,
                            img: fileLink,
                            address: cityInput,
                            gender: genderInput
                        })
                        .then((res)=> {
                            console.log(res)
                            // setUser(prev=> [...prev, res.data])
                        })
                        .catch((err)=> console.log(err))
                    }
                }}
                >
                <h3 className={profileStyle.profileEditFormHead}>Edit your profile</h3>

                    <input className={profileStyle.profileInput} 
                    onChange={(e)=> setNameInput(e.target.value)} placeholder="Insert your name"/>

                    <input className={profileStyle.profileInput} type="number"
                    onChange={(e)=> setAgeInput(e.target.value)} placeholder="Insert your age"/>

                    <input className={profileStyle.profileInput} 
                    onChange={(e)=> setCityInput(e.target.value)} placeholder="Insert your city name"/>

                    <Select
                        onChange={setGenderInput}
                         options={options}
                         placeholder="Choose gender"
                        styles={{width: "18.3vw"}}
                    />

                    <label htmlFor="file" className={profileStyle.profileImgInput}> 
                    Choose an img
                    <input style={{display: "none"}} type="file" id="file"
                    onChange={(e)=> setFileInput(e.target.files[0])}/>
                    </label>

                    <textarea cols={45} rows={5} maxLength="20" style={{resize: "none"}} onChange={(e)=> setBioInput(e.target.value)}></textarea>
                    <button type="submit" className={profileStyle.profileEditBtn}>submit</button>
                </form>
                </div>
                : ""}

                {deleteUser ? 
                <div>
                    <p>Are you sure you want to delete your account ?</p>
                    <button onClick={deleteUserAuth}>yes</button>
                    <button onClick={()=> setDeleteUser(false)}>no</button>
                </div>
                : ""}

                </div>
              
                <div className={profileStyle.userCard}>
                    <h1>{user?.name}</h1>
                    <p>{user?.age}, {user?.adress}<br/>
                    {user?.bio}</p>
                    <span className={profileStyle.followers}>{user.followers?.length} Followers</span>                 
                    <span className={profileStyle.following}>{user.following?.length} Following</span>      
                </div>

                <div className={profileStyle.showOptions}>
                    <button className={profileStyle.imgsTag} style={{backgroundColor: categoryClicked === "image" ? "#EDDDDD" : "#F4EAEA"}} onClick={()=> setCategoryClicked("image")}>IMAGES</button>
                    <button className={profileStyle.postextTag} style={{backgroundColor: categoryClicked === "text" ? "#EDDDDD" : "#F4EAEA"}} onClick={()=> setCategoryClicked("text")}>TEXT</button>
                    <button className={profileStyle.savedTag} style={{backgroundColor: categoryClicked === "saved" ? "#EDDDDD" : "#F4EAEA"}} onClick={()=> setCategoryClicked("saved")}>SAVED</button>
                </div>

                
                <div className={profileStyle.imgPostGallary}>  
                    {categoryClicked === "image"  ?
                    images?.map((post, i)=> {
                        return(
                            <>
                    <div key={i} className={profileStyle.imgCard}>
                    <Link to="/PostDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>
                    {post.postTYP === "image" ? <img className={profileStyle.imgPost} src={post.image} alt=""/> : ""}
                    
                    {post.postTYP === "video" ?   
                    <video className={profileStyle.vidPost}
                    src={post.video}
                    controls
                    />: ""}
                   </Link>
                    </div>                            
                            </>
                        )
                    })

                    : "" }  
                    </div>

                    <div className={profileStyle.textPostGallary}>  
                    {categoryClicked === "text"  ? 

                        texts?.map((post, i)=> {
                            const user = state.users?.find((item)=> item?._id === post?.userId)

                            return(
                                <>
                        <div key={i} className={profileStyle.txtCard}>
                        <div>
                            <img className={profileStyle.txtImg} src={user?.img} alt=""/>
                            <span className={profileStyle.txtpostName}>{user?.name}</span>
                        </div>
                        <p className={profileStyle.txtPost}>{post.text}</p>
                        <p className={profileStyle.txtDetailsLink}>
                        <Link to="/PostDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>see full post..</Link></p>
                        </div>                                
                                </>
                            )
                        })

                        : "" }
                    </div>
  


                   

                <div className={profileStyle.savedPostsGallary}>

                {categoryClicked === "saved" ?  
                <>
                <div style={{width: "100%"}}>
                    <button className={profileStyle.savedOption} style={{backgroundColor: savedCategoryClicked === "image" ? "#EDDDDD" : "#F4EAEA"}} onClick={()=> setSavedCategoryClicked("image")}>IMAGES</button>
                    <button className={profileStyle.savedOption} style={{backgroundColor: savedCategoryClicked === "text" ? "#EDDDDD" : "#F4EAEA"}} onClick={()=> setSavedCategoryClicked("text")}>TEXT</button>
                </div>

                {savedPosts?.map((post)=> {
                    const user = state.users?.find((user)=> user._id === post.userId)

                    return(
                    <>

                    {savedCategoryClicked === "image" ? 
                    <div className={profileStyle.savedImgPostsGallary}>
                        <Link to="/PostDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>
                           {post.postTYP === "image" ? <img className={profileStyle.imgPost} src={post.image} alt=""/> : ""}
                            
                            {post.postTYP === "video" ? 
                              <video className={profileStyle.vidPost}
                              src={post.video}
                              controls
                              />: ""}
                        </Link>  
                    </div>
                    :""}
                    

                    {post.postTYP === "text" && savedCategoryClicked === "text" ? 
                    <div className={profileStyle.savedTxtPostsGallary}>
                        <div>
                        <img className={profileStyle.txtImg} src={user.img} alt=""/>
                        <span className={profileStyle.savedTxtUserName}>{user.name}</span>
                    </div>
                        <p className={profileStyle.txtPost}>{post.text}</p>
                        <p className={profileStyle.txtDetailsLink}>
                        <Link to="/PostDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>see full post..</Link></p>       
                    </div>
                    :""}
                    </>
                )})}
                </>
                :""}
                </div>
                </>
            </div>
            </div>
        
        </>
    )
}

export default Profile;