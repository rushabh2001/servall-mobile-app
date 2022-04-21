import { GARAGE } from '../actions/actionTypes';

const initialState = {
    garage: null,
    garage_id: null,
}

export default function Garage(state = initialState, action) {
    switch(action.type) {
        case GARAGE.SET_GARAGE:
            return {
                ...state,
                garage: action.data.garage,
                garage_id: action.data.garage_id
            }
        case GARAGE.GET_GARAGE:
            return {
                ...state,
                garage: action.data.garage,
                garage_id: action.data.garage_id
            }
        default:
            return state;
    }
}