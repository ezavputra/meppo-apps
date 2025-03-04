import { store } from "./src/store/store";
import {
  Platform
} from 'react-native';
import { setUserSession, setAccessToken } from "./src/store/actionCreators";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';

let _navigator;

// function setTopLevelNavigator(navigatorRef) {
//   _navigator = navigatorRef;
// }

// function navigate(routeName, params) {
//   _navigator.dispatch(
//     NavigationActions.navigate({
//       routeName,
//       params
//     })
//   );
// }
/**
 * Make user to logout
 *
 * @param {object} navigation Screen navigation
 */
const logout = async navigation => {
  try {
    if (Platform.OS == "android") {
      const userInfo = await GoogleSignin.signInSilently();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remove the user from your app's state as well
      // await LoginManager.logOut();
    } else {
      this.setState({ userInfo: null });
    }
  } catch (error) {
    console.error(error);
  } finally {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        }
      ],
      key: null
    });
    navigation.dispatch(resetAction);

    store.dispatch(setUserSession(null));
    store.dispatch(setAccessToken(null));
  }
};

// function maintenance() {
//   const resetAction = StackActions.reset({
//     index: 0,
//     actions: [NavigationActions.navigate({ routeName: "Maintenance" })],
//     key: null
//   });
//   _navigator.dispatch(resetAction);
// }

// add other navigation functions that you need and export them
export default {
  // navigate,
  // setTopLevelNavigator,
  logout,
  // maintenance
};
