import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import PropTypes from "prop-types";
import { Box, Image, Text, View } from "@gluestack-ui/themed";
// import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window");

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

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

  render() {
    const { navigation } = this.props;

    // If data finish load
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

      </View>
    );
  }
}

Notification.propTypes = {
  saveSettings: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken }) => ({
  accessToken,
  me: userSession,
});

const mapDispatchToProps = (dispatch) => ({
  saveSession: (user) => dispatch(setUserSession(user)),
  saveAccessToken: (token) => dispatch(setAccessToken(token)),
  saveSettings: (user) => dispatch(setSettings(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);