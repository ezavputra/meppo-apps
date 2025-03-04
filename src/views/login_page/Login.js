import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, ImageBackground, KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import PropTypes from "prop-types";
import { Box, Text, Image, View, Pressable } from "@gluestack-ui/themed";
import {
  LogIn,
} from "lucide-react-native";
import {
  setAccessToken,
  setAlert,
  setLoading,
  setUserSession,
  setSettings,
  setOrderPaymentSurveyCount,
} from "../../store/actionCreators";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import { Formik } from "formik";
import FormField from "../../new-components/FormControlContainer";
import { OneSignal } from 'react-native-onesignal';

const { width, height } = Dimensions.get("window");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
      userInfo: null,
      gettingLoginStatus: false,
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { showLoading } = this.props;
    showLoading(false);
  }

  async submit(values, actions, props) {
    const { navigation, showLoading, saveSession } = props;
    const { params = {} } = props.route;

    showLoading(true);

    try {
      let formData = {
        "login_field": values.email,
        "password": values.password
      }

      const response = await axios.post("/login", formData);
      const status = response.data.status;

      console.warn(response.data);

      if (status) {
        showLoading(false);

        response.data.results.email = response.data.results.user.email;
        response.data.results.password = values.password;
        saveSession(response.data.results);

        OneSignal.login(String("meppo-" + response.data.results.user.id));
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
                menu: response.data.results.menu
              }
            }
          ],
        });
        navigation.dispatch(resetAction);
      }
    } catch (error) {
      console.error(error.response);
      showLoading(false);
    }
  }

  render() {
    const { showLoading, navigation } = this.props;

    // If data finish load
    return (
      <Box flex={1}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />

          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
            style={{
              backgroundColor: '#013597'
            }} />

          <View style={{ padding: 16 }}>
            <Image
              alt='loginImg'
              source={require('../../assets/img/logo-apps.jpeg')}
              sx={{
                "@base": {
                  width: '100%',
                  height: 130,
                },
                "@sm": {
                  width: '100%',
                  height: 130,
                },
                "@md": {
                  width: '100%',
                  height: 130,
                },
              }}
              style={{
                marginTop: 30
              }}
              resizeMode='stretch'
            />

            <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  email: "",
                  password: ""
                }}
                validate={this.validate}
                onSubmit={(values, actions) => this.submit(values, actions, this.props)}
              >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                  const isError = field => touched[field] && errors[field];
                  return (
                    <View>
                      <FormField
                        type="email"
                        isError={isError}
                        errorText={errors.email}
                        defaultValue={values.email}
                        fieldName="email"
                        label="Email"
                        helperText="Isi email"
                        onChangeText={(text) => {
                          setFieldValue("email", text);
                        }}
                      />
                      <FormField
                        type="password"
                        isError={isError}
                        errorText={errors.password}
                        defaultValue={values.password}
                        fieldName="password"
                        label="Password"
                        helperText="Isi Password"
                        onChangeText={(text) => {
                          setFieldValue("password", text);
                        }}
                      />
                    </View>
                  )
                }}
              </Formik>

              <Pressable
                style={{
                  borderRadius: 10,
                  width: '100%',
                  // elevation: 1
                }}
                onPress={() => {
                  showLoading(true);
                  this.formik.handleSubmit();
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      padding: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: pressed ? '#053385' : '#96026c',
                      borderRadius: 10,
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold} style={{ color: 'white' }}>Login</Text>
                    </View>
                  )
                }}
              </Pressable>
            </KeyboardAvoidingView>
          </View>

        </View>
      </Box>
    );
  }
}

Login.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);