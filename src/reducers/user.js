import { USER } from '../actions/actionTypes';

const initialState = {
    user: null,
    userToken: null,
    userRole: "Customer",
}

export default function User(state = initialState, action) {
    switch(action.type) {
        case USER.SET_USER_TOKEN:
            return {
                ...state,
                user: action.data.user,
                userToken: action.data.user_token,
                userRole: action.data.user_role
            }
        default:
            return state;
    }
}