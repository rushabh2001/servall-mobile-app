import { ROLE } from './actionTypes';

export function setUserRole(data) {
    return {
        type: ROLE.SET_ROLE,
        data
    }
}
