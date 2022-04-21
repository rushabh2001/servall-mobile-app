import { USERS } from './actionTypes';

export function getUsers() {
    return {
        type: USERS.GET_USERS
    }
}

export function setUsers(data) {
    return {
        type: USERS.SET_USERS,
        data
    }
}

export function toggleUser(data) {
    return {
        type: USERS.TOGGLE_USER,
        data
    }
}

export function toggleUpdate() {
    return {
        type: USERS.TOGGLE_UPDATE
    }
}