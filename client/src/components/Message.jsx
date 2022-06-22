import React, { useContext } from "react";
import "../css/Message.css";
import { format } from "timeago.js";
import AuthContext from "../Context/AuthContext";  

const Message = ({message,own}) => {
    const { state } = useContext(AuthContext)

    return(
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={own ? state.currentUser?.img : state.chatFriend?.img} alt=""/>
                <p className="messageTxt">{message?.text}</p>
            </div>
            <div className="messageBottom">{format(message.created)}</div>
        </div>
    )
}

export default Message;