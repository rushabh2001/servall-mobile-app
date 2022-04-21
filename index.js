/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './src/index';
 import {name as appName} from './app.json';
 import { LogBox } from 'react-native';
 
 LogBox.ignoreLogs([
     '`new NativeEventEmitter()` was called with a non-null argument',
     'Found screens with the same name nested inside one another.',
     "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!"
 ]);
 
 AppRegistry.registerComponent(appName, () => App);
 