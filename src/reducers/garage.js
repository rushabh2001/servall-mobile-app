import { GARAGE, AUTH } from '../actions/actionTypes';

const initialState = {
    garage: null,
    garage_id: null,
    selected_garage: null,
    selected_garage_id: null,
}

export default function Garage(state = initialState, action) {
    switch(action.type) {
        case GARAGE.SET_GARAGE:
            return {
                ...state,
                garage: action.data.garage,
                garage_id: action.data.garage_id
              
            }
        case GARAGE.SET_SELECTED_GARAGE:
            return {
                ...state,
                selected_garage: action.data.selected_garage,
                selected_garage_id: action.data.selected_garage_id
            }
        case AUTH.SIGN_OUT:
            return {
                ...state,
                garage: null,
                garage_id: null,
                selected_garage: null,
                selected_garage_id: null,
            }
        default:
            return state;
    }
}