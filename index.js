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
   "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
   "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
   "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.",
   "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
   "Looks like you're passing an inline function for 'component' prop for the screen 'CustomerNotifications' (e.g. component={() => <SomeComponent />}). Passing an inline function will cause the component state to be lost on re-render and cause perf issues since it's re-created every render. You can pass the function as children to 'Screen' instead to achieve the desired behaviour.",
   "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.",
   "Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
   'Warning: Each child in a list should have a unique "key" prop.'
]);

AppRegistry.registerComponent(appName, () => App);
 