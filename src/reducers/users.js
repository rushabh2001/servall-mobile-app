import { Types } from '../actions/actionTypes';

const initialState = {
  user: {
    email: '',
    otp: ''
  },
  formSubmitted: false
}

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN:
    console.log('login', action.payload.user)
      return {
        ...state,
        user: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Types.ADD_USER:
      return {
        ...state,
        user: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Types.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Types.UPDATE_PROFILE_PICTURE:
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: action.payload.image
        }
      }
    case Types.FORM_SUBMITION_STATUS:
      return {
        ...state,
        formSubmitted: action.payload.status
      }
    default:
      return state;
  }
}

export default loginReducer;