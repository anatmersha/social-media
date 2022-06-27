import React, { useEffect, useState, useContext, useRef } from "react";
import chatStyle from "../css/Chat.module.css";
import MainNavbar from "../components/MainNavbar";
import Message from "../components/Message";
import Conversation from "../components/Conversation";
import AuthContext from "../Context/AuthContext";  
import axios from "axios";
import {io} from "socket.io-client";
import { AiOutlineCloseSquare } from "react-icons/ai";

const Chat = () => {
    const [convos, setConvos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMsg, setArrivalMsg] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const { state, dispatch } = useContext(AuthContext)
    const socket = useRef()
    const scrollRef = useRef();

    
    useEffect(()=> {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            setArrivalMsg({
                senderID: data.senderID,
                text: data.text,
                created: new Date()
            })
        })
    },[])

    useEffect(()=> {
        if(arrivalMsg){
           if(state.currentChat?.members?.includes(arrivalMsg.senderID)) {
            setMessages([...messages, arrivalMsg])
           }
        }
    },[messages, arrivalMsg, state.currentChat])

    useEffect(()=> {
        socket.current.emit("addUser", state.currentUser?._id)   
        socket.current.on("getUsers", users=>{
            const online = [];

            for(let i=0; i < users?.length; i++) {
                return (users[i]?.userId) ? online?.push(users[i]?.userId) : ""
            }

            // const ss = () => users?.map((user)=> {
            //     return (user.userId) ? online?.push(user.userId) : ""
            // }) 
            // ss()
            dispatch({ type: "onlineUsers", value: online })
            console.log(online, "online");
        })
    },[state.currentUser])

    useEffect(()=> {
        const getAllConvos = () => {
            axios
            .get(`/chat/user/${state.currentUser?._id}`)
            .then((res)=> {
                console.log(res.data);
                setConvos(res.data)
            })
            .catch((err)=> {
                console.log(err.message);
            })
        }
        // if(state.currentUser) 
        getAllConvos();
    },[state.currentUser])
 
    useEffect(()=> {
        const getMessages = () => {
            axios
            .get(`/chat/convo/msgs/${state.currentChat?._id}`) 
            .then((res)=> {
                setMessages(res.data)
            })
            .catch((err)=> {
                console.log(err.message);
            })  
        }   
        getMessages();
    },[state.currentChat])

    useEffect(()=>{
        return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    },[scrollRef])

    useEffect(()=>{
        const friend = state.currentChat?.members?.find((item)=> item !== state.currentUser?._id)
        const currentChatFriend = state.users?.find((item)=> item?._id === friend)
        dispatch({ type: "chatFriend", value: currentChatFriend })

    },[state.currentChat, state.currentUser, state.chatFriend])

    useEffect(()=>{
        const friends = state.following?.filter((friend)=> onlineUsers?.includes(friend?.userId))
        dispatch({ type: "onlineFriends", value: friends }) 
    },[state.onlineUsers])
    
    return(
        <div>
            <MainNavbar/>
        <div className={chatStyle.firstFrame}>

        <div className={chatStyle.chatMenu}>
        <div className={chatStyle.mainChatHeadline}>CHAT BOX</div>
            <div className={chatStyle.mainChatMenu}>  

            {convos?.map((con, i)=> (
                <div key={i} onClick={()=> {
                    dispatch({ type: "currentChat", value: con })
                }}>
                    <Conversation convo={con}/>
                </div>
            ))}
            </div>
            
        </div>

        <div className={chatStyle.chatBox}>
            <div className={chatStyle.mainChatBox}>
                {state.chatFriend ? <div className={chatStyle.chatHeader}>You & {state.chatFriend?.name}
                <span style={{position: "absolute", top: "-6.2vh", right: "-10vw", fontSize: "30px"}} onClick={()=>  dispatch({ type: "currentChat", value: null })}><AiOutlineCloseSquare/></span></div> : ""} 
                {state.currentChat ? 
                <>
                <div className={chatStyle.chatBoxTop}>
                    {messages?.map((msg, i)=> (
                        <div key={i} ref={scrollRef} > 
                            <Message message={msg} own={msg.senderID === state.currentUser._id}/>
                        </div>
                    ))}
                </div>

                <div className={chatStyle.chatBoxBottom}>
                    <form className={chatStyle.chatBoxForm} 
                    onSubmit={(e)=> {
                        e.preventDefault();
                        setNewMessage("");
                        const receiverID = state.currentChat.members?.find((it)=> it !== state.currentUser._id)
                        
                        socket.current.emit("sendMessage", {
                            senderID: state.currentUser._id,
                            receiverID,
                            text: newMessage
                        })
                        
                        axios
                        .post("/chat/message",{
                            convoID: state.currentChat?._id,
                            senderID: state.currentUser?._id,
                            text: newMessage,
                            created: new Date()
                        })
                        .then((res)=> {
                            console.log(res.data)
                            setMessages([...messages, res.data])
                        })
                        .catch((err)=> console.log(err))

                        
                    }}
                    >
                    <textarea className={chatStyle.msgInput} value={newMessage} cols="70" placeholder="send a message..."
                    onChange={(e)=> setNewMessage(e.target.value)}></textarea>

                    <button className={chatStyle.msgSubmitBtn} type="submit">send</button>
                    </form>
                </div>
                </>
                :
                <div>
                    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fglyph%2F227%2FTalk-hi-512.png&f=1&nofb=1" style={{width: "12vw", marginTop: "12vh"}} alt=""/>
                </div>
                }

            </div>
        </div>

        </div>
        </div>
    )
}

export default Chat;