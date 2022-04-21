import { USERS, USER } from '../actions/actionTypes';
import { takeLatest, put, call, select, delay } from '@redux-saga/core/effects';
import { setUsers, toggleUpdate } from '../actions/users';
import { setUserToken } from '../actions/user';
import { signOut } from '../actions/login';
import { apiGet, apiPost } from '../network/apiFetch';
import { getValue, saveValue } from '../lib/storage';
// import OneSignal from 'react-native-onesignal';
// import DeviceInfo from 'react-native-device-info';
import { BASE_URL } from '../constants/config';
import { Platform } from 'react-native';

// const getUsers = function* getUsers() {
//     try {
//         const res = yield call(apiGet, 'users');
//         if (res.status === 200) {
//             yield put(setUsers(res.data.users))
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

// const toggleUser = function* toggleUser({ data }) {
//     try {
//         const res = yield call(apiPost, `delete_user/${data}`);

//         if (res.status === 200) {
//             const users = yield select(state => state.users.users);
//             users.map(u => { if (u.id == data) u.isActive = !u.isActive });
//             yield put(toggleUpdate())
//         }

//         yield put(toggleUpdate())
//     } catch (e) {
//         console.log(e);
//         yield put(toggleUpdate())
//     }
// }

// const updateUser = function* updateUser(flag) {
//     try {
//         const user_token = yield select(state => state.user.userToken);
//         const res = yield call(apiGet, 'get_user', { 'Authorization': 'Bearer ' + user_token });

//         if (res.status == 200) {
//             yield put(setUserToken({ user: res.data, user_token: user_token }));
//             if (flag.data)
//                 // yield call(updateUserNotification);
//             saveValue('USER', JSON.stringify(res.data));
//         } else {
//             yield put(signOut())
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

// const fetchContinuously = function* fetchContinuously() {
//     try {
//         const user_token = yield select(state => state.user.userToken);
//         // const user_verified = yield select(state => state.user.user.verified);
//         if (!user_token) {
//             const res = yield call(apiGet, 'get_user', { 'Authorization': 'Bearer ' + user_token });

//             if (res.status == 200) {
//                 yield put(setUserToken({ user: res.data, user_token: user_token }));
//                 yield put(setUserToken({ user: res.data, user_token: user_token }));

//                 saveValue('USER', JSON.stringify(res.data));
//             } else {
//                 yield put(signOut())
//             }
//         }
//     } catch (e) {
//         console.log(e);
//     }
//     yield delay(60000);
//     yield put({ type: "FETCH_CONTINUOUSLY" })
// }

// const updateUserNotification = function* updateUserNotification() {
//     try {
//         const app_alert = yield select(state => state.user.user.app_alert);
//         OneSignal.setAppId(ONE_SIGNAL_APP_ID);
//         //Prompt for push on iOS
//         if (Platform.OS == 'ios') {
//             OneSignal.promptForPushNotificationsWithUserResponse(response => {
//                 console.log("Prompt response:", response);
//                 updatePermission(response);
//                 OneSignal.disablePush(!response);
//             });
//         }
//         else {
//             OneSignal.disablePush(app_alert ? false : true);
//         }

//         //Method for handling notifications received while app in foreground
//         OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//             let notification = notificationReceivedEvent.getNotification();
//             const data = notification.additionalData
//             // Complete with null means don't show a notification.
//             notificationReceivedEvent.complete(notification);
//         });

//         //Method for handling notifications opened
//         OneSignal.setNotificationOpenedHandler(notification => {
//             console.log("OneSignal: notification opened:", notification);
//         });

//         OneSignal.addSubscriptionObserver(async (event) => {
//             //     if (event.to.isSubscribed) {
//             const { userId } = await OneSignal.getDeviceState();
//             if (userId)
//                 addUserSignal(userId);
//             //     }
//         });
//     } catch (e) {
//         console.log(e);
//     }
// }

// const updatePermission = async (val) => {
//     const user_token = await getValue('USER_TOKEN');
//     const data = {
//         "app_alert": val
//     }

//     try {
//         const res = await fetch(`${BASE_URL}update_app_alert`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + user_token
//             },
//             body: JSON.stringify(data)
//         });

//         const json = await res.json();

//         if (json !== undefined) {
//             updateUser();
//             // OneSignal.disablePush(val ? false : true);
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

// const addUserSignal = async (pid) => {
//     const user_token = await getValue('USER_TOKEN');
//     let url = BASE_URL + 'user_players';
//     let fields = {
//         "device_id": DeviceInfo.getUniqueId(),
//         "player_id": pid
//     }
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + user_token
//         },
//         body: JSON.stringify(fields)
//     }).then(response => {
//         const statusCode = response.status;
//         let data;
//         return response.json().then(obj => {
//             data = obj;
//             return { statusCode, data };
//         });
//     }).then(result => {
//         if (result.statusCode === 200) {
//             console.log(result);
//         }
//         else {
//             console.log(result);
//         }
//     })
// }

const root = function* root() {
    // yield takeLatest(USERS.GET_USERS, getUsers);
    // yield takeLatest(USERS.TOGGLE_USER, toggleUser);
    // yield takeLatest(USER.UPDATE_USER, updateUser);
    // yield takeLatest(USER.UPDATE_USER_NOTIFICATION, updateUserNotification)
    // yield takeLatest('FETCH_CONTINUOUSLY', fetchContinuously);
}

export default root;