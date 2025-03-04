import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import {
    prev, next, skip, done
} from "../../config/strings";
import AppIntroSlider from 'react-native-app-intro-slider';
import { setSettings } from "../../store/actionCreators";
import PropTypes from "prop-types";
import { Box, Image, Text, View } from "@gluestack-ui/themed";
// import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class IntroPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlideIndex: 0,
            maxSlideIndex: 2,
            isModalPaymentSuccessVisible: true,
            slide: [],
        };
    }

    // Mount User Method
    async componentDidMount() {
        const { navigation, me, accessToken, saveSettings } = this.props;

        // this.listenNotification();

        // if (me) {
        //     axios.defaults.headers.common[
        //         "Authorization"
        //     ] = `Bearer ${accessToken}`;
        //     console.warn(me);
        //     const versi_now = "1.4";
        //     let routeName = "Main";

        //     try {
        //         console.warn(me);
        //         const responseSetting = await axios.get("/settings/" + me.id);
        //         const { data: settings } = responseSetting.data;
        //         const { user: user } = responseSetting.data;
        //         saveSettings(settings);
        //         console.warn(settings);
        //         // console.warn(user.customer);
        //         if (me.phone === "" && me.customer.birthday == null && me.customer.address == "") {
        //             routeName = "UbahProfile";
        //         } else {
        //             routeName = "Main";
        //         }

        //         if (user.phone == "") {
        //             routeName = "UbahProfile";
        //         }

        //         const resetAction = CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 {
        //                     name: routeName,
        //                     params: { isFirst: true, user: user }
        //                 },
        //             ]
        //         });
        //         navigation.dispatch(resetAction);
        //     } catch (error) {
        //         console.warn(error);
        //         const resetAction = CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 {
        //                     name: "Login",
        //                     params: { isFirst: true }
        //                 },
        //             ]
        //         });
        //         navigation.dispatch(resetAction);
        //     }
        // }

        this.fetchData();
    }

    // componentWillUnmount() {
    //     source.cancel('Operation canceled by the user.');
    // }

    async fetchData() {
        try {
            const slide_array = [];
            const response = await axios.post("/slide", {
                type: ['intro'],
            }, {
                cancelToken: source.token
            });
            const { data: slide } = response.data;
            console.warn(slide);
            this.setState({
                slide: slide,
                maxSlideIndex: slide.length - 1
            });
        } catch (error) {
            // console.warn(this.state.slide);
            console.error(error);
        }
    }

    async listenNotification() {
        const {
            saveAccessToken,
            saveSession,
            accessToken,
            navigation,
            saveSettings,
            saveOrderPaymentSurveyCount,
        } = this.props;

        try {
            const { me } = this.props;
            await messaging().requestPermission();
            const fcmToken = await messaging().getToken();
            console.warn(fcmToken);
            const notificationOpen = await messaging().getInitialNotification();
        } catch (error) {
            console.error(error);
        }
    }

    toLogin() {
        const { navigation } = this.props;
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [
                { name: 'HomeBegin' },
            ]
        });
        navigation.dispatch(resetAction);
    }

    _renderItem = ({ item, dimensions }) => (
        <Box justifyContent="center" alignItems="center" h="80%">
            <Box sx={glueAndroid.Intro_ImageIntroBox}>
                <Image 
                    alt='1'
                    source={item.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='contain'
                />
            </Box>
            <View style={{
                gap: 10,
                marginTop: 30,
                alignItems: 'center'
            }}>
                <Text
                    sx={glueAndroid.Global_textGrandTitle}>
                    {item.title}
                </Text>
                <Text
                    sx={glueAndroid.Global_textSub}>
                    {item.text}
                </Text>
            </View>
        </Box>
    );

    _renderSkipButton = () => {
        return (
            <View sx={glueAndroid.Global_baseButton}
                style={{
                    backgroundColor: 'white',
                    borderColor: '#009BD4',
                    borderWidth: 2,
                    elevation: 0
                }}>
                <Text sx={glueAndroid.Global_baseButtonText}
                    style={{
                        color: 'black'
                    }}>
                    {skip}
                </Text>
            </View>
        );
    };

    _renderNextButton = () => {
        return (
            <View sx={glueAndroid.Global_baseButton}>
                <Text sx={glueAndroid.Global_baseButtonText}>
                    {next}
                </Text>
            </View>
        );
    };

    _renderPrevButton = () => {
        return (
            <View sx={glueAndroid.Global_baseButton}
                style={{
                    backgroundColor: 'white',
                    borderColor: '#009BD4',
                    borderWidth: 2,
                    elevation: 0
                }}>
                <Text sx={glueAndroid.Global_baseButtonText}
                    style={{
                        color: 'black'
                    }}>
                    {prev}
                </Text>
            </View>
        );
    };

    _renderDoneButton = () => {
        return (
            <View sx={glueAndroid.Global_baseButton}>
                <Text sx={glueAndroid.Global_baseButtonText}>
                    {done}
                </Text>
            </View>
        );
    };

    render() {
        const { navigation } = this.props;

        // If data finish load
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />
                <AppIntroSlider
                    data={this.state.slide}
                    renderItem={this._renderItem}
                    bottomButton
                    showPrevButton
                    showSkipButton
                    hideNextButton
                    dotStyle={{ backgroundColor: '#a7a7a8', width: 20 }}
                    activeDotStyle={{ backgroundColor: '#009BD4', width: 40 }}
                    renderDoneButton={this._renderDoneButton}
                    renderPrevButton={this._renderPrevButton}
                    renderNextButton={this._renderNextButton}
                    renderSkipButton={this._renderSkipButton}
                    // hideDoneButton
                    onSkip={() => this.toLogin()}
                    onDone={() => this.toLogin()}
                />
            </View>
        );
    }
}

IntroPage.propTypes = {
    saveSettings: PropTypes.func,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(IntroPage);