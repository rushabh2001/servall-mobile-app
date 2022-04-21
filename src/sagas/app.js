import { APP } from '../actions/actionTypes';
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { ROOT_OUTSIDE, ROOT_INSIDE, INTRO, appStart, setupIntro } from '../actions/app';
import { setUserToken, updateUserNotification } from '../actions/user';
import { setGarage, getGarage } from '../actions/garage';
import { getValue, saveValue } from '../lib/storage';
import { apiGet } from '../network/apiFetch';
import { signOut } from '../actions/login';

const init = function* init() {
    // console.log("only init");
    let user_token = yield call(getValue, 'USER_TOKEN');
    // console.log(user_token);
    let user = yield call(getValue, 'USER');
    // console.log(user);
    let garage_id = JSON.stringify(yield call(getValue, 'GARAGE_ID'));
    let garage = yield call(getValue, 'GARAGE');
    // console.log(garage);
    // console.log(garage_id);
    let first_time = yield call(getValue, 'FIRST_TIME');

    if (!first_time) yield call(saveValue, 'FIRST_TIME', '1');
    if (user_token) {
        try {
            const res = yield call(apiGet, 'get_user', { 'Authorization': 'Bearer ' + user_token });
            if (res.status == 200) {
                // console.log(res.data.user_role);
                yield all([
                    put(setUserToken({ user: res.data, user_token: user_token })),
                    put(appStart({ root: ROOT_INSIDE })),
                    put(setupIntro({ isFirstTime: first_time ? false : true })),
                    // put({ type: "FETCH_CONTINUOUSLY" }),
                ])
                saveValue('USER', JSON.stringify(res.data));

                if(res.data.user_role == "Super Admin") {
                    saveValue('GARAGE', null);
                    saveValue('GARAGE_ID', '0');
                    yield put(setGarage({ garage: null, garage_id: 0 }))
                    // console.log("Working");
                } else if(res.data.user_role == "Admin"){
                    saveValue('GARAGE', JSON.stringify(res.data.user_data.garage));
                    saveValue('GARAGE_ID', JSON.stringify(res.data.user_data.garage.id));
                    // console.log(parseInt(res.data.user_data.garage.id));
                    yield put(setGarage({ garage: res.data.user_data.garage, garage_id: parseInt(res.data.user_data.garage.id) }))
                } else {
                    saveValue('GARAGE', JSON.stringify(res.data.user_data.garage_customer));
                    saveValue('GARAGE_ID', JSON.stringify(res.data.user_data.garage_customer.id));
                    // console.log([res.data.user_data.garage_customer.id, res.data.user_data.garage_customer ]);
                    yield put(setGarage({ garage: res.data.user_data.garage_customer, garage_id:  parseInt(res.data.user_data.garage_customer.id) }))
                }
            } else {
                yield put(signOut())
            }
        } catch (e) {
            yield all([
                put(setUserToken({ user: JSON.parse(user), user_token: user_token })),
                put(setGarage({ garage: JSON.parse(garage), garage_id: parseInt(garage_id) })),
                put(appStart({ root: ROOT_INSIDE })),
                // put({ type: "FETCH_CONTINUOUSLY" }),
            ]);
        }
    } else {
        yield all([
            put(appStart({ root: ROOT_OUTSIDE })),
            put(setupIntro({ isFirstTime: first_time ? false : true }))
        ])
    }
}

const root = function* root() {
    yield takeLatest(APP.INIT, init);
}

export default root;