import React, { useState, useContext } from "react";
import MainNavbarStyle from "../css/MainNavbar.module.css";
import AuthContext from "../Context/AuthContext";  
import { Link } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = () => {
    const [filteredUsers, setFilteredUsers] = useState([])
    const { state, dispatch } = useContext(AuthContext)

    const handleSearch = (e) => {
        const searched = e.target.value;
        const newFilter = state.users?.filter((user)=> {
            return user?.name.toLowerCase().includes(searched.toLowerCase())
        });
        searched === "" ? setFilteredUsers([]) : setFilteredUsers(newFilter)
    }

    return(
        <div className={MainNavbarStyle.search}>
        <div className={MainNavbarStyle.searchBox}>
            <input className={MainNavbarStyle.searchInput} placeholder="Search.." onChange={handleSearch}/>
            <span className={MainNavbarStyle.searchIcon}><BiSearchAlt2/></span>
        </div>
        {filteredUsers.length !== 0 ? 
            <div className={MainNavbarStyle.result}>
                {filteredUsers.slice(0, 10).map((user, i)=> {

                return(
                <>
                <div key={i} className={MainNavbarStyle.searchResultList}> 
                    <Link to="/Profile" onClick={()=> dispatch({ type: "userID", value: user._id })}>
                    <img className={MainNavbarStyle.searchUserImg} src={user.img} alt=""/>
                    </Link>
                    <span className={MainNavbarStyle.searchUserName}>{user.name}</span>
                    <span className={MainNavbarStyle.searchUserAdress}>{user.adress}</span>
                </div>
                </>
                )
                })}
            </div>
        : ""}        
        </div>
    )
}

export default SearchBar;