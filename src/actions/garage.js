import { GARAGE } from './actionTypes';

export function setGarage(data) {
    return {
        type: GARAGE.SET_GARAGE,
        data
    }
}

export function setSelectedGarage(data) {
    return {
        type: GARAGE.SET_SELECTED_GARAGE,
        data
    }
}