import React, { useState, useContext } from "react";
import { Link, Navigate } from 'react-router-dom';
import axios from "axios";
import Styles from "../css/Spinner.module.css";
import AuthContext from "../Context/AuthContext";  

import {useLocation} from "react-router-dom"


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [field, setField] = useState(false);
    const [login, setLogin] = useState(false);
    const [resetPass, setResetPass] = useState(false);
    const [resetMsg, setResetMsg] = useState(false);
    const location = useLocation(); 

    const { dispatch } = useContext(AuthContext)

    if(login) {
     return <Navigate to="/"/>
    }

    function loginUser() {
        const API_KEY = "AIzaSyBWgSmGJ0x9QW2HCRx3PGxYx2jtEj3NFBk";
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    
        setIsLoading(true);

            axios
            .post(url, {
                email,
                password,
            })
            .then((res)=> {
                console.log(res);
                dispatch({ type: "auth", value: res.data })
                setIsLoading(false)
            })
            .catch((err)=> {
                console.log(err.response.data.error?.message);
                setIsLoading(false)
                setErr(true);
                setErrMsg(err.response.data.error.message)
            });
    }

    function resetUserPassword() {
        const API_KEY = "AIzaSyBWgSmGJ0x9QW2HCRx3PGxYx2jtEj3NFBk";
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

        setIsLoading(true);

            axios
            .post(url, {
                "requestType": "PASSWORD_RESET",
                email
            })
            .then((res)=> {
                console.log(res);
                setResetMsg(true);
            })
            .catch((err)=> {
                console.log(err.response.data.error?.message);
            });
    }
    
    return(
        <div className="firstFrame">
        <h1 className="mainHeader">TheComunity</h1>
        <div className="secondFrame">
        <div className="formCard">
        {!resetPass ? <h2  className="secondHeader">Login</h2> : ""} 
        {resetPass ? <h2  className="secondHeader">Reset Password</h2> : ""} 

            <form 
            onSubmit={(e)=> {
                e.preventDefault();
                if (email !== "" &&
                password !== "" && 
                errMsg === ""){
                    if(!resetPass){
                        loginUser();
                        setLogin(true);
                    }else{
                        resetUserPassword();
                    }
                }else{
                    setField(true);
                }
            }}
            >
                <input className="loginInput" value={email} required 
                placeholder="Insert email" autoComplete="off" type="email" 
                onChange={(e)=> setEmail(e.target.value)}/><br/>

                <input className="loginInput" value={password} required 
                placeholder="Insert password" autoComplete="off" type="password" 
                onChange={(e)=> setPassword(e.target.value)}/><br/>

                {!resetPass ? <button className="loginButton" type="submit">login</button> : ""} 
                {resetPass ? <button className="loginButton" type="submit">reset</button> : ""} 
            </form>

            <p onClick={()=> setResetPass(true)}>Forgot your password ?</p>
            {resetMsg ? <p>Check your email, a reset email was sent to you</p> : ""}
            {isLoading ? <div className={Styles.spinner} style={{width: "40px", height: "40px"}}></div> : ""} 

            <p className="errMsg">{errMsg}</p>
            {field ? <p className="errMsg">Please fill all field !</p> : ""}
            {err ? <p  className="errMsg">{errMsg}. Please try again!</p> : ""}

            <p className="registerBtn">Don't have an a account yet? <Link style={{color: "#cb5b5b"}} to="/Register">Register</Link></p>
        </div>
        </div>
        </div>
    )
}


export default Login;