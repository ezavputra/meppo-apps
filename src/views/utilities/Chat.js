import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, KeyboardAvoidingView, ImageBackground } from "react-native";
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
  ArrowLeft, Send
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

const { width, height } = Dimensions.get("window");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: [],
      counter: 0,
      backHeight: 0,
      actionHeight: 0,
      headHeight: 0,
      count: 0
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

  async connectWebsocket() {
    const { showLoading, me } = this.props;
    this.ws = new WebSocket('ws://147.139.172.135/websocket');

    this.ws.onopen = () => {
      // connection opened
      showLoading(false);
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success connect to server',
        visibilityTime: 1000,
        bottomOffset: 100,
        position: 'bottom'
      });
      this.ws.send(JSON.stringify({
        type: 'register',
        user_id: me.customer.user_id,
      }));
    };

    this.ws.onmessage = e => {
      // a message was received
      const message = JSON.parse(e.data);

      if (message.type === 'direct') {
        if (message.sender_user_id == 99) {
          this.setState(prevState => ({
            chat: [{
              type: "recipient",
              text: message.content
            }, ...prevState.chat]
          }));
        }
      }
    };

    this.ws.onerror = e => {
      // an error occurred
      showLoading(false);
      console.warn(e.message);
      Toast.show({
        type: 'warning',
        text1: 'Reconnecting',
        text2: 'Reconnecting to server',
        // visibilityTime: 3000,
        autoHide: false,
        bottomOffset: 100,
        position: 'bottom'
      });
      ws.onclose(e);
    };

    this.ws.onclose = e => {
      // connection closed
      showLoading(false);
      console.warn(e);
      console.log('Socket is closed. Reconnect will be attempted in 5 second.', e.reason);
      Toast.show({
        type: 'warning',
        text1: 'Reconnecting',
        text2: 'Reconnecting to server',
        // visibilityTime: 3000,
        autoHide: false,
        bottomOffset: 100,
        position: 'bottom'
      });
      let timeout = setTimeout(() => {
        this.connectWebsocket();
        clearTimeout(timeout);
      }, 5000);
    };
  }

  // async fetchData() {
  //   const { showLoading } = this.props;
  //   try {
  //     showLoading(true);
  //     const response = await axios.get("/listcity_available");
  //     const { data: city } = response.data;

  //     showLoading(false);
  //     this.setState({
  //       city
  //     });
  //   } catch (error) {
  //     showLoading(false);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: error.message,
  //       visibilityTime: 3000,
  //       // autoHide: false,
  //       onPress: () => {
  //         Toast.hide();
  //       }
  //     });
  //   }
  // }

  validate({
    content,
  }) {
    const errors = {};

    if (!content) {
      errors.content = "Chat tidak boleh kosong";
    } else if (!/^(?:[A-Za-z/\s/g]+|\d+)$/.test(content)) {
      errors.content = 'Tidak boleh mengandung karakter selain alphabet';
    }

    return errors;
  }

  submit = async (values, customParams) => {
    customParams.ws.send(JSON.stringify({
      type: 'privateMessage',
      sender_user_id: 91,
      recipient_user_id: 99,
      content: values.content
    }));
    this.setState(prevState => ({
      chat: [{
        type: "sender",
        text: values.content
      }, ...prevState.chat],
    }));
    this.formik.resetForm();
  }

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { params = {} } = this.props.route;
    const { user } = params;

    // If data finish load
    return (
      <Box flex={1}>
        <ImageBackground
          source={require("../../assets/img/bg-chat.jpg")}
          style={{ flex: 1, flexDirection: 'column' }}>
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />
          <View
            h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
            backgroundColor='#fff'></View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
            }}
            sx={{
              "@base": {
                height: 60
              },
              "@sm": {
                height: 80
              },
              "@md": {
                height: 80
              },
            }}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              this.setState({ backHeight: height });
            }}>
            <Pressable
              style={{
                alignItems: 'center'
              }}
              sx={{
                "@base": {
                  width: 60
                },
                "@sm": {
                  width: 80
                },
                "@md": {
                  width: 80
                },
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              {({ pressed }) => {
                return (
                  <ArrowLeft size={24} color={pressed ? '#fff' : '#000'} />
                )
              }}
            </Pressable>
            <View style={{ flexDirection: 'column' }}>
              <Text sx={glueAndroid.Global_textBaseBold}>Nama Tukang</Text>
              <Text sx={glueAndroid.Global_textLightItalic}>P-SUB</Text>
            </View>
          </View>

          <FlatList
            data={this.state.chat}
            style={{
              height: height - StatusBar.currentHeight - this.state.actionHeight
                - this.state.actionHeight - this.state.backHeight,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item, index }) => (
              <View
                style={{
                  paddingVertical: 8,
                  alignItems: item.type == "recipient" ? 'flex-start' : 'flex-end',
                  paddingBottom: index == 0 ? this.state.actionHeight + 10 : 8,
                  paddingTop: index == this.state.chat.length - 1 ? 16 : 8,
                }}>
                <View style={{
                  width: width / 1.5,
                  backgroundColor: item.type == 'sender' ? 'white' : '#fef2d0',
                  elevation: 2,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  borderBottomLeftRadius: item.type == "recipient" ? 0 : 8,
                  borderBottomRightRadius: item.type == "recipient" ? 8 : 0
                }}>
                  <Text sx={glueAndroid.Global_textBase}>{item.text}</Text>
                </View>
              </View>
            )}>
          </FlatList>
        </ImageBackground>

        <View
          alignContent="center"
          position="absolute"
          bottom={0}
          w="100%"
          flexDirection="row"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            // backgroundColor: 'white'
          }}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            this.setState({ actionHeight: height });
          }}
        >
          <FormControl
            size="md"
            // isInvalid={
            //   isError != null ?
            //     isError(fieldName) ? true : false
            //     : false
            // }
            style={{ flex: 0.85, marginRight: 10 }}
          >
            <Input
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
              // w="$full"
              h={'100%'}
              style={{
                borderRadius: 30,
                backgroundColor: 'white'
                // borderColor: isError("content") ? 'red' : '#bfc2c2'
              }}
            >
              <InputField
                sx={glueAndroid.Global_textBase}
                placeholder="Pesan..."
                onChangeText={() => {

                }}
              />
            </Input>
          </FormControl >
          <Pressable
            style={{
              elevation: 1,
              flex: 0.15,
            }}
            sx={{
              "@base": {
                width: 40,
                height: 40,
              },
              "@sm": {
                width: 60,
                height: 60,
              },
              "@md": {
                width: 60,
                height: 60,
              },
            }}
            onPress={() => {
              // handleSubmit();
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
                  <Send color='black' size={18} />
                </View>
              )
            }}
          </Pressable>
          {/* <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  content: ""
                }}
                validate={this.validate}
                onSubmit={values => this.submit(values, this)}
              >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit, resetForm }) => {
                  const isError = field => touched[field] && errors[field];
                  return (
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <FormField
                        defaultValue={values.content}
                        fieldName="content"
                        onChangeText={(text) => {
                          setFieldValue("content", text);
                        }}
                        style={{ width: '95%' }}
                        styleInput={{
                          marginRight: 10,
                          borderRadius: 30,
                          borderColor: isError("content") ? 'red' : '#bfc2c2'
                        }}
                      />
                      <Pressable
                        style={{
                          elevation: 1
                        }}
                        sx={{
                          "@base": {
                            width: 40,
                            height: 40,
                          },
                          "@sm": {
                            width: 60,
                            height: 60,
                          },
                          "@md": {
                            width: 60,
                            height: 60,
                          },
                        }}
                        onPress={() => {
                          handleSubmit();
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{
                              flex: 1,
                              flexDirection: 'row',
                              padding: 16,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: pressed ? '#99d7ee' : '#009BD4',
                              borderRadius: 30,
                              borderColor: '#009BD4',
                              borderWidth: 2
                            }}>
                              <Send color='white' size={18} />
                            </View>
                          )
                        }}
                      </Pressable>
                    </View>
                  )
                }}
              </Formik>
            </KeyboardAvoidingView> */}
        </View>
      </Box>
    );
  }
}

Chat.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);