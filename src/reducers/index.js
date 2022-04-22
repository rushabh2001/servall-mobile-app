import { combineReducers } from "redux";
import app from './app';
import login from './login';
import user from './user';
import garage from './garage';
import role from './role';
// import users from './users';

export default combineReducers({
    app,
    login,
    user,
    // users,
    garage,
    role,
})