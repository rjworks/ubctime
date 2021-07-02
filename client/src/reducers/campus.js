const campusReducer = (campus = "UBC Okanagan", action) => {
    switch(action.type){
        case "SET_CAMPUS":
            return action.payload;
        default:
            return campus;
    }
}

export default campusReducer;