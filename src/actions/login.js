import { AUTH } from './actionTypes';

export function loginRequest(data) {
    return {
        type: AUTH.LOGIN,
        data
    }
}

export function resetLogin() {
    return {
        type: AUTH.RESET_LOGIN
    }
}

export function loginSuccess() {
    return {
        type: AUTH.LOGIN_SUCCESS
    }
}

export function loginError(data) {
    return {
        type: AUTH.LOGIN_ERROR,
        data
    }
}

export function signOut() {
    return {
        type: AUTH.SIGN_OUT
    }
}

export function deleteAccount() {
    return {
        type: AUTH.DELETE_ACCOUNT
    }
}