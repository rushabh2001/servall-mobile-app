import { APP } from './actionTypes';

export const ROOT_OUTSIDE='outside';
export const ROOT_INSIDE='inside';
export const ROOT_LOADING='loading';
export const INTRO='intro';

export function appInit() {
    return {
        type: APP.INIT
    }
}

export function appStart(data) {
    return {
        type: APP.START,
        data
    }
}

export function error(data) {
    return {
        type: APP.ERROR,
        data
    }
}

export function setupIntro(data) {
    return {
        type: APP.SET_UP_INTRO,
        data
    }
}