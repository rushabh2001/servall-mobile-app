import { combineReducers } from "redux";
import app from './app';
import login from './login';
import user from './user';
import garage from './garage';
import role from './role';

export default combineReducers({
    app,
    login,
    user,
    garage,
    role,
})