import feedStyle from "../css/Feed.module.css";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";  
import { Link } from "react-router-dom";
import PostUpload from "../components/PostUpload";
import MainNavbar from "../components/MainNavbar";
import { FaHeart, FaRegHeart, FaRegEdit, FaRegCommentAlt, FaRegPaperPlane, FaRegTrashAlt, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { format } from "timeago.js";   

const Feed = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditField, setShowEditField] = useState(false);
    const [savePost, setSavePost] = useState(false);
    const [newComment, setNewComment] = useState([]);
    const [myPosts, setMyPosts] = useState([]);

    const { state, dispatch } = useContext(AuthContext)
    
    useEffect(()=> { 
        const getAllPosts = () => {
            if (state.following < 50) {
                setMyPosts(
                    state.posts?.sort((p1, p2)=> {
                    return new Date(p2.created) - new Date(p1.created);
                }))
            } 
            else {
                for(let i=0; i< state.currentUser?.following.length; i++) {
                    const allPosts = state.posts?.filter((post)=> post?.userId === state.currentUser?.following[i]?.userId || post?.userId === state.currentUser?._id)
                    setMyPosts(
                        allPosts.sort((p1, p2)=> {
                            return new Date(p2.created) - new Date(p1.created);
                    }))
                }
                // state.currentUser?.following?.map((item)=> {
                //     const allPosts = state.posts?.filter((post)=> post?.userId === item?.userId || post?.userId === state.currentUser?._id)
                //     setMyPosts(
                //         allPosts.sort((p1, p2)=> {
                //             return new Date(p2.created) - new Date(p1.created);
                //     }))
                // })
            }
        }
        getAllPosts()
    },[state.currentUser, state.posts, state.following])
    
    return( 
    <div className={feedStyle.firstFrame}>
            <MainNavbar/>
        <div className={feedStyle.mainFrame}>
        <div className={feedStyle.postsUpload}>
            <PostUpload/>
        </div>

        {myPosts ? myPosts?.map((post, i)=> {
            const user = state.users?.find((item)=> item._id === post.userId)
            const save = state.currentUser?.saved?.find((item)=> item === post._id)
            const like = post.likes?.find((item)=> item.userId === state.currentUser?._id)
        return(
        <>
        <div key={i} className={feedStyle.imgPostFrame}>
            <div className={feedStyle.thirdFrame}>
            <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: post.userId })}>
                <img src={user?.img} alt="" className={feedStyle.profileImg}/>
            </Link>
                <h3 className={feedStyle.imgUserName}>{user?.name}</h3>
                <p className={feedStyle.imgUserAdress}>{post?.location ? post?.location : <i>no-location</i> } </p>
            </div>


            {post.postTYP === "text" ? 
            <div className={feedStyle.txtFrame}>
                <p className={feedStyle.txtPost}>{post.text}</p>  
            </div>
            :
            <div className={feedStyle.imgFrame}>  
                {post.postTYP === "image" ? 
                <img className={feedStyle.imgPost} src={post.image} alt=""/>
                :""}

                {post.postTYP === "video" ?
                <video className={feedStyle.vidPost}
                src={post.video}
                controls
                />
                :""}
            </div>
            }

            <div className={feedStyle.linksFrame}>

                <button className={feedStyle.leftLinks} 
                onClick={()=> {
                    {isLiked ? setIsLiked(false) : setIsLiked(i)}                    
                    console.log(like);

                const newPostLike = {
                    userId: state.currentUser?._id,
                    created: new Date()
                }

                const userLike = post.likes?.find((item)=> item?.userId === state.currentUser?._id)
                    console.log(userLike);
                
                if(userLike === undefined && post?.userId !== state.currentUser?._id) {
                    console.log("not-found");
                    
                    axios
                    .patch(`/posts/like/${post._id}`,{newPostLike})
                    .then((res)=> console.log(res.data))
                    .catch((err)=> console.log(err))

                    axios 
                    .post("/alerts/like",{
                        alertType: "like",
                        postId: post?._id,
                        userId: post?.userId,
                        postTYP: post?.postTYP,
                        liked: state.currentUser?._id,
                    })
                    .then((res)=> console.log(res))
                    .catch((err)=> console.log(err))

                }else if(userLike !== undefined && post.userId !== state.currentUser?._id) {
                    console.log("found");
                    axios
                    .delete(`/posts/like/${post?._id}`,{
                        userId: state.currentUser?._id
                    })
                    .then((res)=> console.log(res.data))
                    .catch((err)=> console.log(err))

                    axios
                    .delete("/alerts/like",{
                    postId: post?._id,
                    liked: state.currentUser?._id,
                    })
                    .then((res)=> console.log(res.data))
                    .catch((err)=> console.log(err))  
                }
                }}>{isLiked === i || like !== undefined ? <FaHeart/> : <FaRegHeart/>}</button>
                
                <button className={feedStyle.leftLinksTxt} onClick={()=> {
                    showForm === i ? setShowForm(false) : setShowForm(i)                    
                }}><FaRegCommentAlt/></button>
            
                <button className={feedStyle.leftLinks}><FaRegPaperPlane/></button>


                <button className={feedStyle.rightLinks} 
                onClick={()=> {
                    {savePost ? setSavePost(false) : setSavePost(i)}

                    const userSave = state.currentUser?.saved?.find((item)=> item === post._id)
                    console.log(userSave);
                    if(userSave === undefined && post?._id !== state.currentUser?._id) {
                        const postID = post?._id;

                        axios
                        .patch(`/users/saved/new/${state.currentUser?._id}`,{postID})
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    } else {
                        const postID = post?._id;
                        axios
                        .patch(`/users/saved/delete/${state.currentUser?._id}`,{postID})
                        .then((res)=> console.log(res))
                        .catch((err)=> console.log(err))
                    }
                }}>{savePost === i || save !== undefined ? <FaBookmark/> : <FaRegBookmark/>}</button>


        </div>
          <p className={feedStyle.imgPostLikes}>{post.likes.length < 1 ? "": post.likes.length + " likes"}</p>
          <p className={feedStyle.imgPostUserName}>{user?.name}<span style={{marginLeft: "10px", fontWeight: "100"}}>{post.caption}</span></p>

        <div className={feedStyle.postComments}>
        {post.comments ? post?.comments?.map((item, i)=> {
        const commentUser = state.users?.find((it)=> it?._id === item?.userId)
           
            return(
            <div className={feedStyle.commentCard}>
                <div key={i} className={feedStyle.comment}>
                    <img className={feedStyle.userImg} src={commentUser?.img} alt=""/>
                    <p className={feedStyle.userName}>{commentUser?.name}</p>
                    <p className={feedStyle.userComment}>{item?.userComment}</p>
                </div><br/>

                <p className={feedStyle.updateTime}><i>Uploaded {format(item.created)}</i></p>

                {item?.userId === state.currentUser?._id  || post?._id ===  state.currentUser?._id ?
                <>
                    <button className={feedStyle.imgCommentEdit}
                        onClick={()=> { showEditField === false ? setShowEditField(i) : setShowEditField(false) }}
                    ><FaRegEdit/></button>

                    <button className={feedStyle.imgCommentDelete}
                        onClick={()=> {
                            axios
                            .patch(`/posts/comment/${post._id}`,{}, {
                                params: {
                                    date: item.created
                                }
                            })
                            .then((res)=> {
                                console.log(res)
                                // setTxtPosts(prev=> [...prev, res.data])
                            })
                            .catch((err)=> console.log(err))

                            axios 
                            .delete("/alerts/comment",{
                                postId: post?._id,
                                commented: state.currentUser?._id,
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
                            console.log(post);
                            const updatedComment = newComment;
                            axios
                            .patch(`/posts/comment/update/${post._id}`,
                            {updatedComment}, {params: {date: item.created}})
                            .then((res)=> {
                                console.log(res)
                                // setTxtPosts(prev=> [...prev, res.data])
                            })
                            .catch((err)=> console.log("comment" + JSON.stringify(err)))

                            axios 
                            .post("/alerts/comment",{
                                alertType: "updateComment",
                                postId: post?._id,
                                userId: post?.userId,
                                postTYP: post?.postTYP,
                                commented: state?.currentUser?._id,
                            })
                            .then((res)=> console.log(res))
                            .catch((err)=> console.log(err))

                        }}
                        >

                            <input className={feedStyle.updateInput} 
                            placeholder="add your changes.." 
                            onChange={(e)=> setNewComment(e.target.value)}/>
                            <button className={feedStyle.updateBtn} type="submit">save</button>
                        </form>
                    : ""}
                </>                        
                : ""}
            </div>
            )
        }): ""}
        </div>

        {showForm === i ? 
            <div className={feedStyle.addComment}>
                <form 
                onSubmit={(e)=> {
                    e.preventDefault();
                    
                    axios
                    .patch(`/posts/comment/new/${post._id}`, {
                        userId: state.currentUser?._id,
                        userComment: newComment
                    })
                    .then((res)=> {
                        console.log(res)
                        // setTxtPosts(prev=> [...prev, res.data])
                    })
                    .catch((err)=> console.log("comment" + JSON.stringify(err)))

                    axios 
                    .post("/alerts/comment",{
                        alertType: "newComment",
                        postId: post?._id,
                        userId: post?.userId,
                        postTYP: post?.postTYP,
                        commented: state.currentUser?._id,
                    })
                    .then((res)=> console.log(res))
                    .catch((err)=> console.log(err))
                }}
                >
                
                <textarea className={feedStyle.imgCommentEditForm} rows="5" cols="50" 
                    placeholder="add a comment..." onChange={(e)=> setNewComment(e.target.value)}></textarea><br/>
                    <button className={feedStyle.postBtn}>POST</button>
                </form>
            </div>
        : ""}

        <p className={feedStyle.imgPostCreated}>{format(post.created)}</p> 
        </div>
        </>
        )
        })
        :""}
        
        </div>
    </div>
    )
}

export default Feed;