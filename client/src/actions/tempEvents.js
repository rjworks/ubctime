export const setTempEvents = (events) => {
    return {
        type: "SET_TEMP_EVENTS",
        payload: events
    };
};

export const addTempEvent = (event) => {
    return {
        type: "ADD_TEMP_EVENT",
        payload: event
    };
};

export const removeTempEvent = (title) => {
    return {
        type: "REMOVE_TEMP_EVENT",
        payload: title
    };
};

export const removeAllTempEvents = () => {
    return {
        type: "REMOVE_ALL_TEMP_EVENTS"
    };
};