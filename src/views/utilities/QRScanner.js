import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import PropTypes from "prop-types";
import {
    Box, Text, Image, View, Pressable, ScrollView, FlatList,
    FormControl, Textarea, TextareaInput, Input, InputField,
} from "@gluestack-ui/themed";
import {
    ArrowLeft, FlashlightIcon, Send
} from "lucide-react-native";
import {
    setAccessToken,
    setAlert,
    setLoading,
    setUserSession,
    setSettings,
    setOrderPaymentSurveyCount,
} from "../../store/actionCreators";
import { Formik } from "formik";
import FormField from "../../new-components/FormControlContainer";
import Toast from 'react-native-toast-message';
import Scanner from "../../components/Scanner";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

class QRScanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            counter: 0,
            backHeight: 0,
            actionHeight: 0,
            headHeight: 0,
            count: 0,
            flash: RNCamera.Constants.FlashMode.off
        };
        this.ws = null;
    }

    // Mount User Method
    async componentDidMount() {
        const { showLoading, me } = this.props;

        // showLoading(true);
        // console.warn(me);

        // this.connectWebsocket();
        // this.fetchData();
    }

    onSuccess = async e => {
        const { navigation, showLoading, me, settings, route } = this.props;
        const { params = {} } = this.props.route;

        if (e.type === 'QR_CODE') {
            try {
                // const response = await axios.get("/test-qr/" + value);
                const response = await axios.get("/test-qr/" + e.data);
                if (params.mode) {
                    console.warn("route");

                    const resetAction = CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'Home',
                                params: {
                                    menu: params.menu
                                }
                            },
                            {
                                name: "QRProduct",
                                params: {
                                    menu: params.menu,
                                    old_data: params.product,
                                    data: response.data
                                }
                            }
                        ],
                    });
                    navigation.dispatch(resetAction);
                } else {
                    console.warn("common");
                    const resetAction = CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'Home',
                                params: {
                                    menu: params.menu
                                }
                            },
                            {
                                name: "QRProduct",
                                params: {
                                    menu: params.menu,
                                    data: response.data
                                }
                            }
                        ],
                    });
                    navigation.dispatch(resetAction);
                }
            } catch (error) {
                //showLoading(false);
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                    visibilityTime: 2000,
                    // autoHide: false,
                    onPress: () => {
                        Toast.hide();
                    }
                });
            }
        }
    }

    render() {
        const { navigation, showLoading, me, settings, route } = this.props;
        const { params = {} } = this.props.route;
        const { user } = params;

        // If data finish load
        return (
            <>
                <Box>
                    <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />
                    <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
                        style={{
                            backgroundColor: '#013597'
                        }} />
                </Box>
                <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    reactivate={true}
                    reactivateTimeout={2000}
                    onRead={this.onSuccess}
                    flashMode={this.state.flash}
                    topContent={
                        <Text style={styles.centerText}>
                            <Text style={styles.textBold}>Scan QR Code untuk adjustment stock</Text>
                        </Text>
                    }
                    bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}
                            onPress={() => {
                                if (this.state.flash == 0) {
                                    this.setState({ flash: RNCamera.Constants.FlashMode.torch });
                                } else {
                                    this.setState({ flash: RNCamera.Constants.FlashMode.off });
                                }
                            }}>
                            <View>
                                <FlashlightIcon color={'#000'} size={30}></FlashlightIcon>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </>
            // <Scanner
            //     route={route}
            //     navigation={navigation}
            //     params={params} />
        );
    }
}

QRScanner.propTypes = {
    navigation: PropTypes.object,
    // accessToken: PropTypes.string,
    saveSession: PropTypes.func,
    saveAccessToken: PropTypes.func,
    showLoading: PropTypes.func,
    showAlert: PropTypes.func,
    saveSettings: PropTypes.func,
    saveOrderPaymentSurveyCount: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken }) => ({
    accessToken,
    me: userSession,
});

const mapDispatchToProps = (dispatch) => ({
    saveSession: (user) => dispatch(setUserSession(user)),
    saveAccessToken: (token) => dispatch(setAccessToken(token)),
    saveSettings: (user) => dispatch(setSettings(user)),
    showLoading: (isOpen) => dispatch(setLoading(isOpen)),
    saveOrderPaymentSurveyCount: (count) =>
        dispatch(setOrderPaymentSurveyCount(count)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QRScanner);