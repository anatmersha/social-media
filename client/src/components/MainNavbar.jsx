import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";  
import MainNavbarStyle from "../css/MainNavbar.module.css";
import SearchBar from "../components/SearchBar";

const MainNavbar = () => {
    const [logOut, setLogOut] = useState(false)

    const { state, dispatch } = useContext(AuthContext)

    return(
        <>
    <ul className={MainNavbarStyle.navList}>
        <li className={MainNavbarStyle.navListHeadline}>TheCommunity</li>
        <li className={MainNavbarStyle.listItem}><Link className={MainNavbarStyle.listLink} to="/Feed">FEED</Link></li>
        <li className={MainNavbarStyle.listItem}><Link className={MainNavbarStyle.listLink} to="/Profile" onClick={()=> dispatch({ type: "userID", value: state.currentUser?._id })}>PROFILE</Link></li>
        <li className={MainNavbarStyle.listItem}><Link className={MainNavbarStyle.listLink} to="/Notifications">NOTIFICATIONS</Link></li>
        <li className={MainNavbarStyle.listItem}><Link className={MainNavbarStyle.listLink} to="/Explore">EXPLORE</Link></li>
        <li className={MainNavbarStyle.listItem}><Link className={MainNavbarStyle.listLink} to="/Chat">CHAT</Link></li>
        <li><SearchBar/></li>
        <li className={MainNavbarStyle.logOutBtn} onClick={()=> setLogOut(true)}>LOG OUT</li>
        <li className={MainNavbarStyle.listItem}><img className={MainNavbarStyle.navProfileImg} src={state?.currUser?.img} alt=""/></li>
        {logOut ? 
        <div className={MainNavbarStyle.logout}>
            Are you sure?
            <button className={MainNavbarStyle.yesLogoutBtn} onClick={()=> dispatch({ type: "auth", value: null })}>yes</button>
            <button className={MainNavbarStyle.noLogoutBtn} onClick={()=> setLogOut(false)}>no</button>
        </div>
        : ""}
    </ul>
    </>
    )
}
export default MainNavbar; 