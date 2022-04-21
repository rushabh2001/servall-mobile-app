import {AUTH} from '../actions/actionTypes';

const initialState={
    loginError: false,
    error: undefined,
    authenticating: false
}

export default function Login(state = initialState, action) {
    switch(action.type) {
        case AUTH.RESET_LOGIN:
            return initialState;
        case AUTH.LOGIN:
            return {
                ...state,
                authenticating: true,
                loginError: false,
                error: undefined,
            }
        case AUTH.LOGIN_SUCCESS:
            return {
                ...state,
                authenticating: true,
                loginError: false,
                error: undefined,
            }
        case AUTH.LOGIN_ERROR:
            return {
                ...state,
                authenticating: false,
                loginError: true,
                error: action.data.message
            }
        default:
            return state;
    }
}