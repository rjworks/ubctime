import {combineReducers} from "redux";
import tempEventsReducer from "./tempEvents";
import permEventsReducer from "./permEvents";
import campus from "./campus";
import session from './session';

const rootReducer = combineReducers({
    "tempEvents": tempEventsReducer,
    "permEvents": permEventsReducer,
    campus,
    session
});

export default rootReducer;