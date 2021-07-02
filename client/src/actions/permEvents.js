export const setPermEvents = (events) => {
    return {
        type: "SET_PERM_EVENTS",
        payload: events
    };
};

export const addPermEvent = (event) => {
    return {
        type: "ADD_PERM_EVENT",
        payload: event
    };
};

export const removePermEvent = (title) => {
    return {
        type: "REMOVE_PERM_EVENT",
        payload: title
    };
};

export const removeAllPermEvents = () => {
    return {
        type: "REMOVE_ALL_PERM_EVENTS"
    };
};