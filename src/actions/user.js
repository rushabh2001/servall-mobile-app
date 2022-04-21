import { USER } from './actionTypes';

export function setUserToken(data) {
    return {
        type: USER.SET_USER_TOKEN,
        data
    }
}

export function updateUser(data) {
    return {
        type: USER.UPDATE_USER,
        data
    }
}

// export function updateUserNotification() {
//     return {
//         type: USER.UPDATE_USER_NOTIFICATION
//     }
// }