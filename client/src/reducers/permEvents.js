const permEventsReducer = (events = [], action) => {
    switch(action.type) {
        case "SET_PERM_EVENTS":
            return action.payload;
        case "ADD_PERM_EVENT":
            return [
                ...events,
                action.payload
            ];
        case "REMOVE_PERM_EVENT":
            return events.filter(e => e.title !== action.payload);
        case "REMOVE_ALL_PERM_EVENTS":
            return [];
        default:
            return events;
    }
}

export default permEventsReducer;