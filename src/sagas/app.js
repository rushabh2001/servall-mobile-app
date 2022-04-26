import { APP } from '../actions/actionTypes';
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { ROOT_OUTSIDE, ROOT_INSIDE, INTRO, appStart, setupIntro } from '../actions/app';
import { setUserToken, updateUserNotification } from '../actions/user';
import { setGarage, setSelectedGarage } from '../actions/garage';
import { getValue, saveValue } from '../lib/storage';
import { apiGet } from '../network/apiFetch';
import { signOut } from '../actions/login';
import { setUserRole } from '../actions/role';

const init = function* init() {
    // console.log("only init");
    let user_token = yield call(getValue, 'USER_TOKEN');
    // console.log(user_token);
    let user = yield call(getValue, 'USER');
    // console.log(user);
    let garage_id = JSON.stringify(yield call(getValue, 'GARAGE_ID'));
    let garage = yield call(getValue, 'GARAGE');
    let user_role = yield call(getValue, 'USER_ROLE');
    // console.log('garage only:', garage);
    // console.log('garage id:',garage_id);
    let first_time = yield call(getValue, 'FIRST_TIME');

    if (!first_time) yield call(saveValue, 'FIRST_TIME', '1');
    if (user_token) {
        try {
            const res = yield call(apiGet, 'get_user', { 'Authorization': 'Bearer ' + user_token });
            if (res.status == 200) {
                // console.log('Garages:', res.data.user_data.garage[0]);
                yield all([
                    put(setUserToken({ user: res.data, user_token: user_token })),
                    put(appStart({ root: ROOT_INSIDE })),
                    put(setupIntro({ isFirstTime: first_time ? false : true })),
                    put(setUserRole({ user_role: res.data.user_role }))
                    // put({ type: "FETCH_CONTINUOUSLY" }),
                ])
                saveValue('USER', JSON.stringify(res.data));

                if(res.data.user_role == "Super Admin") {
                    saveValue('GARAGE', null);
                    saveValue('GARAGE_ID', '0');
                    yield all([
                        put(setGarage({ garage: null, garage_id: 0 })),
                        put(setSelectedGarage({ selected_garage: null, selected_garage_id: 0 }))
                    ]) 
                    // console.log("Working");
                } else if(res.data.user_role == "Admin"){
                    if (res.data.user_data.garage.length == 1) {
                        saveValue('GARAGE', JSON.stringify(res.data.user_data.garage));
                        saveValue('GARAGE_ID', JSON.stringify(res.data.user_data.garage.id));
                        // console.log(parseInt(res.data.user_data.garage.id));
                        yield all([
                            put(setGarage({ garage: res.data.user_data.garage[0], garage_id: parseInt(res.data.user_data.garage[0].id)})),
                            put(setSelectedGarage({ selected_garage: res.data.user_data.garage[0], selected_garage_id: parseInt(res.data.user_data.garage[0].id) }))
                        ]) 
                    } else if (res.data.user_data.garage.length > 1) {
                        saveValue('GARAGE', JSON.stringify(res.data.user_data.garage));
                        let garage_ids = res.data.user_data.garage.map((item) => item.id);
                        saveValue('GARAGE_ID', JSON.stringify(garage_ids));
                        console.log('ids', garage_ids);
                        yield all([
                            put(setGarage({ garage: res.data.user_data.garage, garage_id: garage_ids, })),
                            put(setSelectedGarage({ selected_garage: res.data.user_data.garage[0], selected_garage_id: parseInt(res.data.user_data.garage[0].id) }))
                        ]) 
                    }
                } else {
                    saveValue('GARAGE', JSON.stringify(res.data.user_data.garage_customer));
                    saveValue('GARAGE_ID', JSON.stringify(res.data.user_data.garage_customer.id));
                    // console.log([res.data.user_data.garage_customer.id, res.data.user_data.garage_customer ]);
                    yield all([
                        put(setGarage({ garage: res.data.user_data.garage_customer, garage_id: parseInt(res.data.user_data.garage_customer.id) })),
                        put(setSelectedGarage({ selected_garage: res.data.user_data.garage_customer, selected_garage_id: parseInt(res.data.user_data.garage_customer.id) }))
                    ]) 
                }
            } else {
                yield put(signOut())
            }
        } catch (e) {
            yield all([
                put(setUserToken({ user: JSON.parse(user), user_token: user_token })),
                put(appStart({ root: ROOT_INSIDE })),
                put(appStart({ user_role: user_role })),
                put(setGarage({ garage: JSON.parse(garage), garage_id: JSON.parse(garage_id) })),
                put(setSelectedGarage({ selected_garage: parseInt(garage[0]), selected_garage_id: parseInt(garage_id[0]) })),
                // put({ type: "FETCH_CONTINUOUSLY" }),
            ]);
            // if (garage.length == 1) {
            // yield put(setGarage({ garage: JSON.parse(garage), garage_id: garage_id, selected_garage: parseInt(garage_id[0]), selected_garage_id: parseInt(garage_id[0]) }))
            // } else if (garage.length > 1) {
            //     yield put(setGarage({ garage: JSON.parse(garage), garage_id: garage_id, selected_garage: parseInt(garage_id[0]), selected_garage_id: parseInt(garage_id[0]) }))
            // }
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