import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, Dimensions, Image, Text, ActivityIndicator, Platform } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { versi } from "../config/app";
import { stylesIos } from "../config/style-ios";
import { styles } from "../config/style-android";
import { setSettings, setStrings, setUserSession } from "../store/actionCreators";
import PropTypes from "prop-types";
import _ from "lodash";
import messaging from '@react-native-firebase/messaging';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import Toast from 'react-native-toast-message';
import { OneSignal } from 'react-native-onesignal';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlideIndex: 0,
        };
    }

    // Mount User Method
    async componentDidMount() {
        const { navigation, me, accessToken, saveSettings, saveStrings, saveSession } = this.props;
        let update = false;

        if (me) {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;
            // console.warn(me);

            try {
                let formData = {
                    "login_field": me.email,
                    "password": me.password
                }

                console.warn(formData);

                const response = await axios.post("/login", formData);
                const status = response.data.status;

                if (status) {
                    response.data.results.email = me.email;
                    response.data.results.password = me.password;
                    saveSession(response.data.results);

                    OneSignal.login(String("meppo-" + me.user.id));
                    OneSignal.User.addEmail(String(response.data.results.user.email));
                    OneSignal.User.addTag("role", String(response.data.results.role.name));
                    // OneSignal.User.addTag("user_location_id", String(response.data.results.user.user_location_id));
                    OneSignal.User.addTag("department_id", String(response.data.results.user.department_id));
                    // OneSignal.User.addTag("division_id", String(response.data.results.user.division_id));

                    const resetAction = CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Home',
                                params: {
                                    menu: response.data.results.menu,
                                }
                            }
                        ],
                    });
                    navigation.dispatch(resetAction);
                }
            } catch (error) {
                console.error(error.response);
                const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Login',
                        }
                    ],
                });
                navigation.dispatch(resetAction);
            }
        }
        else {
            const resetAction = CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "Login"
                    },
                ]
            });
            navigation.dispatch(resetAction);
        }
    }

    componentWillUnmount() {
        source.cancel('Operation canceled by the user.');
    }

    render() {
        const { navigation } = this.props;

        // If data finish load
        return (
            <GluestackUIProvider>
                <View style={[styles_custom.container, styles_custom.horizontal]}>
                    <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />
                    {/* <Image
                        source={require("../assets/img/logo-01.png")}
                        resizeMode='stretch'
                        style={{
                            width: 280,
                            height: 90,
                            marginTop: 100,
                            alignSelf: 'center'
                        }} /> */}
                    <ActivityIndicator size="large" color="#000" />
                </View>
            </GluestackUIProvider>
        );
    }
}

const styles_custom = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#013597"
    },
    horizontal: {
        flexDirection: "column",
        justifyContent: "space-around",
        padding: 10
    }
});

SplashScreen.propTypes = {
    saveSettings: PropTypes.func,
    saveSession: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken, stringSet }) => ({
    accessToken,
    me: userSession,
    stringSet
});

const mapDispatchToProps = (dispatch) => ({
    saveSession: (user) => dispatch(setUserSession(user)),
    saveAccessToken: (token) => dispatch(setAccessToken(token)),
    saveSettings: (user) => dispatch(setSettings(user)),
    saveStrings: (strings) => dispatch(setStrings(strings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);