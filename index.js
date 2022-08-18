/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './src/index';
 import {name as appName} from './app.json';
 import { LogBox } from 'react-native';
 
 LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
    '`new NativeEventEmitter()` was called with a non-null argument',
    'Found screens with the same name nested inside one another.',
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
    "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.",
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead."
     
 ]);
 
 AppRegistry.registerComponent(appName, () => App);
 