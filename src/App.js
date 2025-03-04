import React, { Component } from "react";
// import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Routes from "./Routes";
import axios from "axios";
import { store, persistor } from "./store/store";
import { apiURL } from "./config/app";
import ModalLoading from "./components/ModalLoading";
import Toast, { BaseToast, SuccessToast, ErrorToast } from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Image, Text, View, Pressable
} from "@gluestack-ui/themed";
import { glueAndroid } from "./config/style-android";

axios.defaults.baseURL = apiURL;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  base: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#009BD4', borderLeftWidth: 12 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        fontWeight: '400'
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
      }}
    />
  ),
  success: (props) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: '#5d974e', borderLeftWidth: 12 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        fontWeight: '400'
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#D42b1b', borderLeftWidth: 12 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        fontWeight: '400'
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
      }}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#f9c016', borderLeftWidth: 12 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        fontWeight: '400'
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  actionToast:
    ({
      text1,
      text2,
      props
    }) => (
      <View style={{
        width: '100%',
        paddingHorizontal: 16,
      }}>
        <View
          sx={{
            "@base": {
              paddingHorizontal: 8,
              paddingVertical: 8
            },
            "@sm": {
              paddingHorizontal: 12,
              paddingVertical: 12
            },
            "@md": {
              paddingHorizontal: 12,
              paddingVertical: 8
            },
          }}
          style={{
            backgroundColor: 'white',
            elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10,
            overflow: 'hidden'
          }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%'
          }}>
            {props.iconHead}
            <View
              sx={{
                "@base": {
                  paddingHorizontal: 12,
                },
                "@sm": {
                  paddingHorizontal: 16,
                },
                "@md": {
                  paddingHorizontal: 24,
                },
              }}
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ flexWrap: 'wrap' }}>
                {text1}
              </Text>
              <Text sx={glueAndroid.Global_textBase}
                style={{ flexWrap: 'wrap' }}>
                {text2}
              </Text>
            </View>
          </View>
          {props.rightButton}
        </View>
      </View>
    )
};

export default class App extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <>
        {/* top SafeAreaView */}
        <SafeAreaView
          style={{
            // backgroundColor: colorMode === "light" ? "#E5E5E5" : "#262626",
          }}
        />
        {/* bottom SafeAreaView */}
        <SafeAreaView
          style={{
            ...styles.container,
            // backgroundColor: colorMode === "light" ? "white" : "#171717",
          }}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <GluestackUIProvider config={config}
                // colorMode={colorMode}
                >
                  <Routes />
                  <ModalLoading />
                  <Toast config={toastConfig} />
                </GluestackUIProvider>
              </PersistGate>
            </Provider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </>
    );
  }
}