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
            console.log(res);
            yield all([
                put(setUserToken({
                    user: JSON.stringify(res.data.user_data),
                    user_token: res.data.access_token,
                })),
                put(loginSuccess()),
                put(setUserRole({
                    user_role: res.data.user_role,
                })),
                put(appStart({ root: ROOT_INSIDE }))
            ]);
            saveValue('USER', JSON.stringify(res.data.user_data));
            saveValue('USER_TOKEN', res.data.access_token);
            saveValue('USER_ROLE', res.data.user_role);
            if(res.data.user_role == "Super Admin") {
                saveValue('GARAGE', null);
                saveValue('GARAGE_ID', '0');
                yield all([
                    put(setGarage({ garage: null, garage_id: [0] })),
                    put(setSelectedGarage({ selected_garage: null, selected_garage_id: 0 }))
                ])
            } else if(res.data.user_role == "Admin"){
                if (res.data.user_data.garage.length == 1) {
                    saveValue('GARAGE', JSON.stringify(res.data.user_data.garage));
                    let garage_ids = res.data.user_data.garage.map((item) => item.id);
                    saveValue('GARAGE_ID',  JSON.stringify(garage_ids));
                    yield all([
                        put(setGarage({ garage: res.data.user_data.garage, garage_id: garage_ids })),
                        put(setSelectedGarage({ selected_garage: res.data.user_data.garage[0], selected_garage_id: parseInt(res.data.user_data.garage[0].id) }))
                    ])
            } else if (res.data.user_data.garage.length > 1) {
                    saveValue('GARAGE', JSON.stringify(res.data.user_data.garage));
                    let garage_ids = res.data.user_data.garage.map((item) => item.id);
                    saveValue('GARAGE_ID', JSON.stringify(garage_ids));
                    yield all([
                        put(setGarage({ garage: res.data.user_data.garage, garage_id: garage_ids })),
                        put(setSelectedGarage({ selected_garage: res.data.user_data.garage[0], selected_garage_id: parseInt(res.data.user_data.garage[0].id) }))
                    ])
                }
            } else {
                saveValue('GARAGE', JSON.stringify(res.data.user_data.garage_customers));
                saveValue('GARAGE_ID', JSON.stringify(res.data.user_data.garage_customers.id));
                yield all([
                    put(setGarage({ garage: res.data.user_data.garage_customers, garage_id: parseInt(res.data.user_data.garage_customers.id) })),
                    put(setSelectedGarage({ selected_garage: res.data.user_data.garage_customers, selected_garage_id: parseInt(res.data.user_data.garage_customers.id) }))
                ])
            }
        } else {
            yield put(loginError(res.data))
        }
    } catch (e) {
        console.log(e.message);
        yield put(loginError({ message: e.message }))
    }
}

const signOut = function* signOut() {
	let user = JSON.parse(yield call(getValue, 'USER'));
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