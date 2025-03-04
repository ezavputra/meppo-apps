/**
 * @format
 */

import { AppRegistry, useEffect, Linking } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { LogLevel, OneSignal } from 'react-native-onesignal';
// import messaging from '@react-native-firebase/messaging';
// import DetailNonAc from './src/views/detail_order/DetailNonAc';

// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// OneSignal Initialization
OneSignal.initialize("38d5d534-9c34-433c-9e6e-71f8584dd769");

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', (event) => {
    console.warn('OneSignal: notification clicked:', event);
});

AppRegistry.registerComponent(appName, () => App);
