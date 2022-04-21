import { all } from 'redux-saga/effects';
import app from './app';
import login from './login';
// import users from './users';
import garage from './garage';

const root = function* root() {
    yield all([
        app(),
        login(),
        // garage(),
        // users(),
    ])
}

export default root;