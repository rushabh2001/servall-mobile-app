import { AUTH } from '../actions/actionTypes';
import { takeLatest, call, put, all, select } from "@redux-saga/core/effects";
import { appStart, ROOT_INSIDE, ROOT_OUTSIDE, setupIntro } from '../actions/app';
import { loginSuccess, loginError } from '../actions/login';
import { setUserToken, updateUserNotification } from '../actions/user';
import { getValue, saveValue, removeValue } from '../lib/storage';
import { apiPost } from '../network/apiFetch';
import { setGarage, setSelectedGarage } from '../actions/garage';
import { setUserRole } from '../actions/role';

const login = function* login({ data }) {
    try {
        const res = yield call(apiPost, 'login', data);
        if (res.status == 200) {
            // console.log(res);
            yield all([
                put(setUserToken({
                    user: res.data.user,
                    user_token: res.data.access_token,
                })),
                put(loginSuccess()),
                put(appStart({ root: ROOT_INSIDE })),
                put(setUserRole({
                    user_role: res.data.user_role,
                }))
                // put(setGarage({
                //     garage: res.data.user,
                //     garage_id: res.data.access_token
                // })),
                // put(updateUserNotification())
            ]);
            saveValue('USER', JSON.stringify(res.data.user));
            saveValue('USER_TOKEN', res.data.access_token);
            saveValue('USER_ROLE', res.data.user_role);
            if(res.data.user_role == "Super Admin") {
                saveValue('GARAGE', null);
                saveValue('GARAGE_ID', '0');
                yield all([
                    put(setGarage({ garage: null, garage_id: 0 })),
                    put(setSelectedGarage({ selected_garage: null, selected_garage_id: 0 }))
                ])
                // if(res.data.user.garage != null) {} else if (res.data.user.garage == null) {}
            } else if(res.data.user_role == "Admin"){
                if (res.data.user.garage.length == 1) {
                    saveValue('GARAGE', JSON.stringify(res.data.user.garage));
                    saveValue('GARAGE_ID', JSON.stringify(res.data.user.garage.id));
                    yield all([
                        put(setGarage({ garage: res.data.user.garage[0], garage_id: parseInt(res.data.user.garage[0].id) })),
                        put(setSelectedGarage({ selected_garage: res.data.user.garage[0], selected_garage_id: parseInt(res.data.user.garage[0].id) }))
                    ])
                } else if (res.data.user.garage.length > 1) {
                    saveValue('GARAGE', JSON.stringify(res.data.user.garage));
                    saveValue('GARAGE_ID', JSON.stringify(res.data.user.garage.id));
                    let garage_ids = res.data.user.garage.map((item) => item.id);
                    // console.log('ids', garage_ids);
                    yield all([
                        put(setGarage({ garage: res.data.user.garage, garage_id: garage_ids })),
                        put(setSelectedGarage({ selected_garage: res.data.user.garage[0], selected_garage_id: parseInt(res.data.user.garage[0].id), selected_garage: res.data.user.garage_customer, selected_garage_id: parseInt(res.data.user.garage_customer.id) }))
                    ])
                }
            } else {
                saveValue('GARAGE', JSON.stringify(res.data.user.garage_customer));
                saveValue('GARAGE_ID', JSON.stringify(res.data.user.garage_customer.id));
                yield all([
                    put(setGarage({ garage: res.data.user.garage_customer, garage_id: parseInt(res.data.user.garage_customer.id) })),
                    put(setSelectedGarage({ selected_garage: res.data.user.garage_customer, selected_garage_id: parseInt(res.data.user.garage_customer.id) }))
                ])
            }
        } else {
            // console.log(res.data);
            yield put(loginError(res.data))
        }
    } catch (e) {
        console.log(e.message);
        yield put(loginError({ message: e.message }))
    }
}

const signOut = function* signOut() {
	let user = JSON.parse(yield call(getValue, 'USER'));
	// saveValue('last_login_id', user.email.trim());
    removeValue('USER');
    removeValue('USER_TOKEN');
    removeValue('GARAGE');
    removeValue('GARAGE_ID');
    removeValue('USER_ROLE');
    yield all([
        put(setupIntro({ isFirstTime: false })),
        put(appStart({ root: ROOT_OUTSIDE }))
    ]);
}

const deleteAccount = function* deleteAccount() {
    try {
        // const userToken = yield select(state => state.user.userToken);
        const res = yield call(apiPost, 'delete_user', {}, { 'Authorization': 'Bearer ' + userToken });
        if (res.status === 200) {
            yield call(signOut);
        }
    } catch (e) {
        console.log(e);
    }
}

const root = function* root() {
    yield takeLatest(AUTH.LOGIN, login);
    yield takeLatest(AUTH.SIGN_OUT, signOut);
    // yield takeLatest(AUTH.DELETE_ACCOUNT, deleteAccount);
}

export default root;