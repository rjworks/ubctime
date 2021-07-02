const tempEventsReducer = (events = [], action) => {
    switch(action.type) {
        case "SET_TEMP_EVENTS":
            return action.payload;
        case "ADD_TEMP_EVENT":
            return [
                ...events,
                action.payload
            ];
        case "REMOVE_TEMP_EVENT":
            return events.filter(e => e.title !== action.payload);
        case "REMOVE_ALL_TEMP_EVENTS":
            return [];
        default:
            return events;
    }
}

export default tempEventsReducer;