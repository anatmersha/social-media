import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../Context/AuthContext";  
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import alertStyle from "../css/Notifications.module.css";

const Notifications = () => {
    const [alerts, setAlerts] = useState(null)
    const [sortedAlerts, setSortedAlerts] = useState(null)
    const [isRead, setIsRead] = useState(false)

    const { state, dispatch } = useContext(AuthContext)

    useEffect(()=> {
        const getAllAlerts = () => {
            axios 
            .get(`/alerts/${state.currentUser?._id}`)
            .then((res)=> {
                setAlerts(res.data)
            })
            .catch((err)=> console.log(err))
        }
        getAllAlerts()
    },[state.currentUser])
    
    useEffect(()=>{
        setSortedAlerts(alerts?.sort((a1, a2)=> {
                return new Date(a2.created) - new Date(a1.created);
        }))
    },[alerts])
    
    
    return(
        <div>
        <div>
            <MainNavbar/>
        </div>

        <div className={alertStyle.allAlerts}>
        
        {sortedAlerts ? 
            sortedAlerts?.map((item, i)=> {
                const userLiked = state.users?.find((it)=> it._id === item.liked)
                const userCommented = state.users?.find((it)=> it._id === item.commented)
                const userFollower = state.users?.find((it)=> it._id === item.follower)
                const post = state.posts?.find((it)=> it._id === item.postId)
                
                return(
                <div key={i} style={{marginLeft: "1vw", width: "98%"}}>

                    {item?.alertType === "like" ? 
                    <div>
                    {item?.postTYP === "text" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                    <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.liked })}>
                    <img  className={alertStyle.alertImg} src={userLiked?.profileImg} alt=""/>
                    </Link> 
                    <span> {userLiked?.name}</span> liked your
                    <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                    <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}

                    {item.postTYP === "video" || "image" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.liked })}>
                            <img className={alertStyle.alertImg} src={userLiked?.img} alt=""/>
                        </Link> 
                        <span> {userLiked?.name}</span> liked your
                        <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}
                    </div>
                    : ""}

                    {item?.alertType === "newComment" ? 
                    <div>
                    {item?.postTYP === "text" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.commented })}>
                            <img className={alertStyle.alertImg} src={userCommented?.img} alt=""/>
                        </Link>
                        <span> {userCommented?.name}</span> commented on your
                        <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}

                    {item.postTYP === "video" || "image" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.commented })}>
                            <img className={alertStyle.alertImg} src={`/images/${userCommented?.profileImg}`} alt=""/>
                        </Link>
                        <span> {userCommented?.name}</span> commented on your
                        <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}
                    </div>
                    : ""}

                    {item?.alertType === "updateComment" ? 
                    <div>
                    {item.postTYP === "text" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.commented })}>
                            <img className={alertStyle.alertImg} src={userCommented?.img} alt=""/>
                        </Link>
                        <span> {userCommented?.name}</span> updated a comment on your                        
                        <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}

                    {item?.postTYP === "video" || "image" ?
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: item?.commented })}>
                            <img className={alertStyle.alertImg} src={userCommented?.img} alt=""/>
                        </Link>
                        <span> {userCommented?.name}</span> updated a comment on your                        
                        <Link to="/postDetails" className={alertStyle.postAlertLink} onClick={()=> dispatch({ type: "currentPost", value: post })}> <span>post</span></Link><br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}
                    </div>
                    : ""}

                    {item?.alertType === "follow" ? 
                    <div className={alertStyle.alertBox} style={{backgroundColor: isRead ? "#ee9c9c" : "#FCEFEF"}}>
                        <Link to="/Profile" style={{textDecoration: "none"}} onClick={()=> dispatch({ type: "userID", value: item?.follower })}>
                        <img className={alertStyle.alertImg} src={userFollower?.img} alt=""/>   
                        </Link>
                        <span> {userFollower?.name}</span> started following you<br/>
                        <span style={{float: "left"}}><i>{format(item?.created)} ago</i></span><br/>
                    </div>
                    : ""}

                </div>
                )
                
            })
        : "No notifications yet!"}

        </div>
        </div>
    )
}

export default Notifications;