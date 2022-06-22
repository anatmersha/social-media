import React,{ useState, useContext } from "react";
import { Link, Navigate } from 'react-router-dom';
import axios from "axios";
import Styles from "../css/Spinner.module.css";
import AuthContext from "../Context/AuthContext";  
import "../css/Register.css";

const Register = () => {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPass, setConfirmedPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [field, setField] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const { dispatch } = useContext(AuthContext)

    function setUserAuth() {
        const API_KEY = "AIzaSyBWgSmGJ0x9QW2HCRx3PGxYx2jtEj3NFBk";
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

        setIsLoading(true);

        axios
        .post(url, {
            email,
            password,
            confirmedPass,
        })
        .then((res)=> {
            const userAuth = res.data;
            // localStorage.setItem(userAuth, JSON.stringify(userAuth))
            saveUser(userAuth)
            dispatch({ type: "auth", value: res.data })
            console.log(res.data);
            setIsLoading(false);
            setIsLogged(true)
        })
        .catch((err)=> {
            console.log(err?.response?.data?.error?.message);
            setIsLoading(false)
            setErr(true);
            setErrMsg(err?.response?.data?.error?.message)
        });
    }

    function saveUser(userAuth) {
        console.log("save");
        axios
        .post("/users/user", {
            auth: userAuth,
            name: userName,
            email: email,
            password: password
        })
        .then((res)=> {
            console.log(res.data);
        })
        .catch((err)=> {
            console.log(`register err:${err}`);
        })
    }

    if(isLogged) {
        return <Navigate to="/"/>
    }

    return(
    <div className="firstFrame">
        <h1 className="mainHeader">TheCommunity</h1>
        <div className="secondFrame">
        
        <div className="formCard">

        <h2 className="secondHeader">Register</h2>

            <form 
            onSubmit={(e)=> {
                e.preventDefault();
                if (userName !== "" &&
                    email !== "" &&
                    password !== "" &&
                    confirmedPass !== "" && 
                    password === confirmedPass 
                    && errMsg === ""){
                        setUserAuth();    
                    }else if (password !== confirmedPass){
                        setErrMsg("Sorry it seems like your passwords don't match. Please try again!")
                    }   else{
                            setField(true);
                        }
            }}
            >            
                <input className="loginInput" value={userName} required
                placeholder="Insert user name" type="text" 
                onChange={(e)=> setUserName(e.target.value)}/><br/>

                <input className="loginInput" value={email} required 
                placeholder="Insert email" type="email" 
                onChange={(e)=> setEmail(e.target.value)}/><br/>

                <input className="loginInput" value={password} required 
                placeholder="Insert password" type="password" 
                onChange={(e)=> setPassword(e.target.value)}/><br/>

                <input className="loginInput" value={confirmedPass} required 
                placeholder="Insert password again" type="password" 
                onChange={(e)=> setConfirmedPass(e.target.value)}/><br/>

                <button className="loginButton" type="submit">register</button>
            </form>  

            {isLoading ? <div className={Styles.spinner} style={{width: "40px", height: "40px"}}></div> : ""} 

            <p className="errMsg">{errMsg}</p>
            {field ? <p className="errMsg">Please fill all field !</p> : ""}
            {err ? <p className="errMsg">{errMsg}. Please try again!</p> : ""}

            <p className="loginBtn">Already have an a account? <Link style={{color: "#cb5b5b"}} to="/Login">Login</Link></p>
        </div>

        </div>
    </div>
    )
}


export default Register;