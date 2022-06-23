import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";  
import PostDetailsStyle from "../css/PostDetails.module.css";
import axios from "axios";
import { FaHeart, FaRegHeart, FaRegEdit, FaRegCommentAlt, FaRegPaperPlane, FaRegTrashAlt, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { format } from "timeago.js";

const PostDetails = () => {
    const [user, setUser] = useState(null);

    const [postComments, setPostComments] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditField, setShowEditField] = useState(false);
    const [newComment, setNewComment] = useState([]);
    const [isSaved, setIsSaved] = useState(null);
    const [deletePost, setDeletePost] = useState(null);

    const { state } = useContext(AuthContext)
    
    useEffect(()=>{
        setPostComments(state?.currentPost?.comments)
        setPostLikes(state?.currentPost?.likes) 
    }, [state.currentPost])

    useEffect(()=>{
        const userLike = postLikes?.find((item)=> item?.userId === state?.currentUser?._id)
        if(userLike !== undefined) setIsLiked(true)
    },[postLikes, state.currentUser])

    useEffect(()=>{
        const user = state?.users?.find((item)=> item?._id === state?.currentPost?.userId)
        setUser(user)
        const save = state?.currentUser?.saved?.find((item)=> item === state?.currentPost?._id)
        if(save !== undefined) setIsSaved(true)

    },[state.currentPost, state.users])

    return(
        <>
            {state?.currentPost !== "" ? 
            <div className={PostDetailsStyle.firstFrame}>
            <div className={PostDetailsStyle.secondFrame}>
            <h2 className={PostDetailsStyle.mainHeader}>TheCommunity</h2>
            <div className={PostDetailsStyle.mainFrame}>

            <div className={PostDetailsStyle.thirdFrame}>
                <img src={user?.img} alt="" className={PostDetailsStyle.profileImg}/>
                <h3 className={PostDetailsStyle.imgUserName}>{user?.name}</h3>
                <p className={PostDetailsStyle.imgLocation}>{state.currentPost?.location ? state.currentPost?.location : <i>no-location</i>}</p>
                {state?.currentPost?._id === state?.currentUser?._id ? <span className={PostDetailsStyle.imgPostDelete} onClick={()=> setDeletePost("maybe")}><i class='far fa-trash-alt'></i></span> : ""}
            </div>

                {deletePost === "maybe" ? 
                <div className={PostDetailsStyle.deleteConfirmation}>
                    <p style={{marginTop: "15vh", fontSize: "30px"}}>Are you sure?</p>
                    <button className={PostDetailsStyle.deleteConfirmationBtn} onClick={()=> setDeletePost("yes")}>yes</button>          
                    <button className={PostDetailsStyle.deleteConfirmationBtn} onClick={()=> setDeletePost(null)}>no</button>  
                </div>        
                : ""}   

                {deletePost === "yes" ? 
                    axios
                    .delete(`/posts/${state?.currentPost._id}`)
                    .then((res)=> console.log(res))
                    .catch((err)=> console.log(err))
                :""}

            {state?.currentPost?.postTYP === "text" ? 
            
                <div className={PostDetailsStyle.txtFrame}>   
                    <p className={PostDetailsStyle.txtPost}>{state?.currentPost?.text}</p>
                </div>
            :
                <div className={PostDetailsStyle.imgFrame}>   
                    {state?.currentPost?.postTYP === "image" ?  <img className={PostDetailsStyle.imgPost} src={state?.currentPost?.image} alt=""  onClick={()=> console.log(state?.currentPost)}/> : ""}
                
                    {state?.currentPost?.postTYP === "video" ?   
                        <video className={PostDetailsStyle.vidPost}
                        src={state?.currentPost?.video}
                        controls
                        />               
                    : ""}
                </div>
            }

            <div className={PostDetailsStyle.linksFrame}>
                <button className={PostDetailsStyle.leftLinks} 
                onClick={()=> {
                    setIsLiked(!isLiked);

                    const newPostLike = {
                        userId: state.currentUser?._id,
                        created: new Date()
                    }

                    const userLike = postLikes?.find((item)=> item?.userId === state?.currentUser?._id)

                    if(userLike === undefined && state?.currentPost?._id !== state?.currentUser?._id){
                        console.log("not found");
                        axios
                        .patch(`/posts/like/${state?.currentPost._id}`,{newPostLike})
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))

                        axios 
                        .post("/alerts/like",{
                            alertType: "like",
                            postId: state?.currentPost?._id,
                            userId: state?.currentPost?.userId,
                            postTYP: state?.currentPost?.postTYP,
                            liked: state?.currentUser?._id, 
                        })
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    }
                    else {
                        console.log("found");
                        axios
                        .delete(`/posts/like/${state.currentPost?._id}`,{
                            userId: state.currentUser?._id
                        })
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))

                        axios
                        .delete("/alerts/like",{
                            postId: state.currentPost?._id,
                            liked: state.currentUser?._id,
                        })
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    }

                }}
                >{isLiked ? <FaHeart/> : <FaRegHeart/>}</button>
                 
                <button className={PostDetailsStyle.leftLinks} onClick={()=> setShowForm(!showForm)}><FaRegCommentAlt/></button>
                <button className={PostDetailsStyle.leftLinks}><FaRegPaperPlane/></button>

                <button className={PostDetailsStyle.rightLinks} 
                onClick={()=> {
                    setIsSaved(!isSaved)

                    const userSave = user?.saved?.find((item)=> item === state?.currentPost._id)
                    
                    if(userSave === undefined && state?.currentPost?._id !== state?.currentUser?._id) {
                        const postID = state?.currentPost?._id;

                        axios
                        .patch(`/users/saved/new/${state?.currentUser?._id}`,{postID})
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    } else {
                        const postID = state?.currentPost?._id;
                        axios
                        .patch(`/users/saved/delete/${state?.currentUser?._id}`,{postID})
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    }
                }}
                >{isSaved ? <FaBookmark/> : <FaRegBookmark/>}</button>

                
            </div>

            <p className={PostDetailsStyle.imgLikes}>{state?.currentPost?.likes?.length < 1 ? "": state?.currentPost?.likes?.length + " likes"}</p>

            
            <div className={PostDetailsStyle.postComments}>
                {postComments ? postComments?.map((item, i)=> {
                const commentUser = state?.users?.find((it)=> it?._id === item?.userId)

                    return(
                        <div className={PostDetailsStyle.commentCard}>
                        <div key={i} className={PostDetailsStyle.comment}>
                            <img className={PostDetailsStyle.userImg} src={commentUser?.img} alt=""/>
                            <p className={PostDetailsStyle.userName}>{commentUser?.name}</p>
                            <p className={PostDetailsStyle.userComment}>{item.userComment}</p>
                        </div><br/>

                        <p className={PostDetailsStyle.updateTime}><i>Uploaded {format(item?.created)}</i></p>

                        {item?.userId === state?.currentUser?._id  || state?.currentPost?._id ===  state?.currentUser?._id ?
                        <>
                        <button className={PostDetailsStyle.imgCommentEditBtn}
                         onClick={()=> { showEditField === false ? setShowEditField(i) : setShowEditField(false) }}
                         ><FaRegEdit/></button>

                        <button className={PostDetailsStyle.imgCommentDeleteBtn}
                         onClick={()=> {
                        console.log(item.created, item);
                        axios
                        .delete(`/posts/comment/${state?.currentPost._id}`,{}, {
                            params: {
                                date: item.created
                            }
                        })
                        .then((res)=> {
                            console.log(res)
                            const updated = postComments.filter((it)=> it.created !== item.created)
                            setPostComments(updated)
                        })
                        .catch((err)=> console.log(err))

                        axios 
                        .delete("/alerts/comment",{
                            postId: state?.currentPost?._id,
                            commented: state?.currentUser?._id,
                        })
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                        
                        }}
                        ><FaRegTrashAlt/></button>

                        {showEditField === i ? 
                            <form 
                            onSubmit={(e)=> {
                            e.preventDefault();

                            setShowEditField(false)
                            console.log(state?.currentPost);
                            const updatedComment = newComment;

                            axios
                            .patch(`/posts/comment/update/${state?.currentPost._id}`,
                            {updatedComment}, {params: {date: item.created}})
                            .then((res)=> {
                                console.log(res)
                            })
                            .catch((err)=> console.log("comment" + JSON.stringify(err)))

                            axios 
                            .post("/alerts/comment",{
                                alertType: "updateComment",
                                postId: state?.currentPost?._id,
                                userId: state?.currentPost?.userId,
                                postTYP: state?.currentPost?.postTYP,
                                commented: state?.currentUser?._id,
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))
                        }}
                        >

                        <input className={PostDetailsStyle.updateInput} 
                        placeholder="add your changes.." 
                        onChange={(e)=> setNewComment(e.target.value)}/>
                        <button className={PostDetailsStyle.updateBtn} type="submit">save</button>
                        </form>
                            : ""}
                         </>                        
                         : ""}
                        </div>
                    )
                }): ""}
            </div>

                {showForm ? 
            <div className={PostDetailsStyle.addComment}>
                <form
                 onSubmit={(e)=> {
                    e.preventDefault();
                    
                    const newPostComment = {
                        userId: state?.currentUser?._id,

                        userComment: newComment,
                        created: new Date()
                    }
                    
                    axios
                    .patch(`/posts/comment/new/${state?.currentPost?._id}`, {newPostComment})
                    .then((res)=> {
                        console.log(res)
                    })
                    .catch((err)=> console.lo(err))

                    axios 
                    .post("/alerts/comment",{
                        alertType: "newComment",
                        postId: state?.currentPost?._id,
                        userId: state?.currentPost?.userId,
                        postTYP: state?.currentPost?.postTYP,
                        commented: state?.currentUser?._id,
                    })
                    .then((res)=> console.log(res))
                    .catch((err)=> console.log(err))
                }}
                >

                <textarea className={PostDetailsStyle.addImgComment} rows="8" cols="78" 
                    placeholder="add a comment..." onChange={(e)=> setNewComment(e.target.value)}></textarea><br/>
                    <button className={PostDetailsStyle.postBtn}>POST</button>
                </form>

            </div>
                : ""}

            <p className={PostDetailsStyle.imgCreated}>{format(state?.currentPost?.created)}</p> 
            </div>
            </div> 
            </div> 
            : ""}
            </>
    )
}

export default PostDetails;
