const sessionReducer = (session = "2021 Winter", action) => {
    switch(action.type){
        case "SET_SESSION":
            return action.payload;
        default:
            return session;
    }
}

export default sessionReducer;