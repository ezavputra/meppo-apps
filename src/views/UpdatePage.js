import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, BackHandler , Linking } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../config/style-android";
import {
  updatePageText, updatePageButton
} from "../config/strings";
import PropTypes from "prop-types";
import {
  Box, Text, Image, View, Pressable,
} from "@gluestack-ui/themed";
import {
  ArrowLeft, XCircle
} from "lucide-react-native";
import {
  setSettings, setLoading
} from "../store/actionCreators";

const { width, height } = Dimensions.get("window");

class UpdatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelect: false,
      date: new Date(),
      datePick: null,
      modalStart: false,
      city: null,
      cityPick: null,
      citySelect: null,
      actionHeight: 0,
    };
  }

  // Mount User Method
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    return true;
  }

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { params = {} } = this.props.route;
    const { data } = params;

    // If data finish load
    return (
      <Box flex={1}>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#009BD4' }}>
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />
          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}></View>
          <View height={height - StatusBar.currentHeight - this.state.actionHeight}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24
            }}>
            <Text sx={glueAndroid.Global_baseButtonText}
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: 10,
                fontSize: 24,
                lineHeight: 30
              }}>
              {updatePageText}
            </Text>
            <Text sx={glueAndroid.Global_textLight}
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: 30,
                fontSize: 18,
              }}>
              {data.note_user}
            </Text>
            <Image
              alt='Update'
              source={require("./../assets/img/update-icon.png")}
              width={width / 1.5}
              height={width / 1.5 - 20}
            />
          </View>
        </View>
        <View
          alignContent="center"
          position="absolute"
          bottom={0}
          w="100%"
          flexDirection="row"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            // backgroundColor: 'white'
          }}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            this.setState({ actionHeight: height });
          }}
        >
          <Pressable
            style={{
              elevation: 1,
              width: '100%'
            }}
            onPress={() => {
              Linking.openURL(data.url)
            }}>
            {({ pressed }) => {
              return (
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  padding: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: pressed ? '#ae860f' : '#f9c016',
                  borderRadius: 30,
                }}>
                  <Text sx={glueAndroid.Global_textBaseBold}
                    color='black'>
                    {updatePageButton}
                  </Text>
                </View>
              )
            }}
          </Pressable>
        </View>
      </Box>
    );
  }
}

UpdatePage.propTypes = {
  navigation: PropTypes.object,
  showLoading: PropTypes.func,
  saveSettings: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken }) => ({
  accessToken,
});

const mapDispatchToProps = (dispatch) => ({
  saveSettings: (user) => dispatch(setSettings(user)),
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage);