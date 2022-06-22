import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../css/Conversation.css";
import AuthContext from "../Context/AuthContext";  

const Conversation = ({ convo }) => {
    const [chatFriend, setChatFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    
    const { state, dispatch } = useContext(AuthContext)

    useEffect(()=> {
        const getMessages = () => {
            axios
            .get(`/chat/convo/msgs/${convo?._id}`) 
            .then((res)=> {
                setMessages(res.data)
            })
            .catch((err)=> {
                console.log(err.message);
            })
        }
        getMessages();
    },[messages, convo])

    useEffect(()=> {
        const chatFriendId = convo?.members?.find((item)=> item !== state.currentUser?._id)
        setChatFriend(state.users?.find((user)=> user._id === chatFriendId))
        const onlineFriends = [];

        state.onlineUsers?.map((user)=> {
            if(user === chatFriendId?._id) onlineFriends.push(user)
        }) 
        dispatch({ type: "onlineFriends", value: onlineFriends })
        console.log(chatFriendId , "chatFriendId");
    },[state.onlineUsers])

    return(
        <>
        <div className="convo">
            {state.onlineFriends === chatFriend?._id ? <p style={{color: "green"}}>p</p> : ""} 
            <img className="convoImg" src={chatFriend?.img} alt=""/>
            <p className="convoName">{chatFriend?.name}</p>
            <p className="lastMsgSent">{messages[messages?.length - 1]?.text}</p>
        </div>
        </>
    )
}

export default Conversation;