import ExploreStyle from "../css/Explore.module.css";
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../Context/AuthContext";  
import { Link } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

const Explore = () => {
    const [categoryClicked, setCategoryClicked] = useState(false)
    const [texts, setTexts] = useState([])
    const [images, setImages] = useState([])

    const { state, dispatch } = useContext(AuthContext)
    
    useEffect(()=>{
        const txt = state.posts?.filter((post)=> post.postTYP === "text")
        const img = state.posts?.filter((post)=> post.postTYP !== "text")
        setTexts(txt)
        setImages(img)
    },[state.posts])

    return(
        <>   
        <div>
            <MainNavbar/>
            <div className={ExploreStyle.firstFrame}>
            <div className={ExploreStyle.secondFrame}>

                <div className={ExploreStyle.mainHeadline}>
                    <h3>Explore</h3>
                    <p>All the latest posts</p>
                </div>

            <div className={ExploreStyle.thirdFrame}>

                <div>
                    <button className={ExploreStyle.imgsTag} onClick={()=> setCategoryClicked(false)}>IMAGES/VIDEOS</button>
                    <button className={ExploreStyle.postextTag} onClick={()=> setCategoryClicked(true)}>TEXT</button>
                </div>
                    
                    {categoryClicked ?  
                    <div className={ExploreStyle.textPostGallary}> 
                        {texts?.map((post, i)=> {
                            const user = state.users?.find((item)=> item?._id === post?.userId)

                            return(
                                <>
                        <div className={ExploreStyle.txtCard}>
                        <div>
                            <img className={ExploreStyle.txtImg} src={user?.img} alt=""/>
                            <span className={ExploreStyle.txtUserName}>{user?.name}</span>
                        </div>
                            <p className={ExploreStyle.txtPost}>{post?.text}</p>
                            <p className={ExploreStyle.txtDetailsLink}>
                            <Link to="/postDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>see full post..</Link></p>
                        </div>                                
                                </>
                            )
                        })}
                    </div>
                    : 
                    <div className={ExploreStyle.imgPostGallary}>   
                        {images?.map((post, i)=> {
                            return(
                                <>
                        {post.postTYP === "image" ? 
                        <div key={i} className={ExploreStyle?.imgCard}>
                            <Link to="/postDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>
                                <img className={ExploreStyle?.imgPost} src={post?.image} alt=""/>
                            </Link>
                        </div>
                        :""}

                        {post.postTYP === "video" ? 
                        <div key={i} className={ExploreStyle?.vidCard}>
                            <Link to="/postDetails" onClick={()=> dispatch({ type: "currentPost", value: post })}>
                            <video className={ExploreStyle.vidPost}
                                src={post.video}
                                controls
                            />
                            </Link>
                        </div>
                        :""}
                                </>
                            )
                        })}
                    </div>                      
                    
                    }



                    

                   

                    

            </div>
            </div>
            </div>
        </div>                
          
        

        </>
    )
                    }

export default Explore;