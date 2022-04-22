import { ROLE } from '../actions/actionTypes';

const initialState = {
    user_role: "Customer",
}

export default function UserRole(state = initialState, action) {
    switch(action.type) {
        case ROLE.SET_ROLE:
            return {
                ...state,
                user_role: action.data.user_role,
            }
        default:
            return state;
    }
}