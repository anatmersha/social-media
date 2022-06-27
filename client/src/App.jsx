import React, { useReducer, useEffect } from 'react';
import { Reducer, initialState } from "./Reducer/Reducer.js";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';
import axios from "axios";
import AuthContext from "./Context/AuthContext";  
import Register from './pages/Register';
import Login from './pages/Login';
import MainNavbar from './components/MainNavbar';
import PageNotFound from './pages/PageNotFound';
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import PostDetails from "./components/PostDetails";
import Conversation from "./components/Conversation";
import Message from "./components/Message";
import SearchBar from "./components/SearchBar";
import PostUpload from "./components/PostUpload";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";    
import Chat from "./pages/Chat";

function App() {
  const [state, dispatch] = useReducer(Reducer, initialState);

  useEffect(()=> {
    axios
    .get("/users") 
    .then((res)=> {
      const Data = res.data;
      const user = Data?.find((item)=> item?.auth.email === state.auth.email);
      dispatch({ type: "users", value: Data })
      dispatch({ type: "currentUser", value: user })
      dispatch({ type: "following", value: user?.following })
      dispatch({ type: "followers", value: user?.followers })
    })
    .catch((err)=> console.log(err.message))
  },[state.auth])

  useEffect(()=> {
        axios
        .get("/posts")
        .then((res)=> {
            dispatch({ type: "posts", value: res.data })
            console.log(res);
        })
        .catch((err)=> {
            console.log(err);
        })
  },[])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
      <div className="App">
      <Routes>
      {!state.auth ? <Route path="/" element={<Register/>}/> : ""}
      {!state.auth ? <Route path="/Register" element={<Register/>}/> : ""}
      {!state.auth ? <Route path="/Login" element={<Login/>}></Route> : ""}
      
      {state.auth ? <Route path="/" element={<Explore/>}/> : ""}   
      {state.auth ? <Route path="/Profile" element={<Profile/>}/> : ""}
      {state.auth ? <Route path="/Explore" element={<Explore/>}/> : ""}
      {state.auth ? <Route path="/Chat" element={<Chat/>}/> : ""}
      {state.auth ? <Route path="/Feed" element={<Feed/>}/> : ""}
      {state.auth ? <Route path="/Notifications" element={<Notifications/>}/> : ""}
      
      <Route path="/Notifications" element={<Notifications/>}/>
      <Route path="/Message" element={<Message/>}/>
      <Route path="/SearchBar" element={<SearchBar/>}/>
      <Route path="/PostUpload" element={<PostUpload/>}/>
      <Route path="/PostDetails" element={<PostDetails/>}/>
      <Route path="/Conversation" element={<Conversation/>}/>
      <Route path="/MainNavbar" element={<MainNavbar/>}/>
      <Route path="*" element={<PageNotFound/>}/>   
      </Routes>
      </div>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;