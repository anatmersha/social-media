export const Reducer = (state, action) => {
    const { type, value } = action;
    return { ...state, [type]: value };
};

export const initialState = {
    auth: null,
    // auth: "1@gmail.com",
    currentUser: null,
    currentPost: null,
    currentChat: null,
    userID: "",
    clickedUser: "",
    clickedUserPosts: "",
    clickedUserFollowers: "",
    following: null, 
    followers: null, 
    users: null,
    posts: null,
    chatFriend: null,
    onlineUsers: [],
    onlineFriends: []
}