import { GARAGE } from './actionTypes';

export function setGarage(data) {
    return {
        type: GARAGE.SET_GARAGE,
        data
    }
}

export function getGarage(data) {
    return {
        type: GARAGE.GET_GARAGE,
        data
    }
}