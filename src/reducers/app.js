import {APP} from '../actions/actionTypes';

const initialState={
    root: 'loading',
    error: undefined,
    isFirstTime: false,
    showThankYou: false
}

export default function App(state = initialState, action) {
    switch(action.type) {
        case APP.START:
            return {
                ...state,
                root: action.data.root,
                showThankYou: action.data.showThankYou
            }
        case APP.ERROR:
            return {
                ...state,
                error: action.data
            }
        case APP.SET_UP_INTRO:
            return {
                ...state,
                isFirstTime: action.data.isFirstTime
            }
        default:
            return state;
    }
}