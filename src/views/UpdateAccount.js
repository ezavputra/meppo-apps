import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, KeyboardAvoidingView, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../config/style-android";
import PropTypes from "prop-types";
import {
  Box, Text, Image, View, Pressable, ScrollView, FlatList,
  Modal, ModalBackdrop, ModalContent
} from "@gluestack-ui/themed";
import {
  ArrowLeft, XCircle
} from "lucide-react-native";
import {
  setAccessToken,
  setAlert,
  setLoading,
  setUserSession,
  setSettings,
  setOrderPaymentSurveyCount,
} from "../store/actionCreators";
import { Formik } from "formik";
import FormField from "../new-components/FormControlContainer";
import DatePicker from 'react-native-date-picker'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

class UpdateAccount extends Component {
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
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { showLoading } = this.props;
    showLoading(false);
    this.fetchData();
  }

  async fetchData() {
    const { showLoading } = this.props;
    try {
      showLoading(true);
      const response = await axios.get("/listcity_available");
      const { data: city } = response.data;

      showLoading(false);
      this.setState({
        city
      });
    } catch (error) {
      showLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        visibilityTime: 3000,
        // autoHide: false,
        onPress: () => {
          Toast.hide();
        }
      });
    }
  }

  validate({
    fullname,
    email,
  }) {
    const errors = {};

    if (!fullname) {
      errors.fullname = "Nama Lengkap tidak boleh kosong";
    } else if (!/^(?:[A-Za-z/\s/g]+|\d+)$/.test(fullname)) {
      errors.fullname = 'Tidak boleh mengandung karakter selain alphabet';
    }
    if (!email) {
      errors.email = "Alamat Email tidak boleh kosong";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = 'Email Tidak Valid';
    }
    // if (!customer_id) {
    //   errors.customer_id = "Customer ID tidak boleh kosong";
    // }

    return errors;
  }

  async submit(values, actions, props) {
    const { navigation, showLoading, saveSession } = props;
    const { setSubmitting } = actions;
    const { params = {} } = props.route;
    const { isFirst } = params;

    setSubmitting(true);
    showLoading(true);
    // console.warn(values);

    try {
      // const formData = new FormData();

      // formData.append("customer_id", values.customer_id);
      // formData.append("fullname", values.fullname);
      // formData.append("phone", values.phone);
      // formData.append("email", values.email);
      // formData.append("address", values.address);
      // formData.append("city_id", values.city);
      // formData.append("referral_from", values.referral_from);
      // formData.append("birthday", values.birthday);

      let formData = {
        "customer_id": values.customer_id,
        "fullname": values.fullname,
        "phone": values.phone,
        "email": values.email,
        "address": values.address,
        "city_id": values.city_id,
        "referral_from": values.referral_from,
        "birthday": values.birthday
      }
      
      console.warn(formData);

      const response = await axios.post("/customer/update", formData);
      const success = response.data.success;

      if (success) {
        const profile = response.data.data;
        const message = response.data.message;
        setSubmitting(false);
        saveSession(profile);
        showLoading(false);
        // this.alert(message);

        if (isFirst) {
          console.warn('first');
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Home',
                params: {
                  isFirst: true
                }
              }
            ],
          });
          navigation.dispatch(resetAction);
          ToastAndroid.show("Data profil berhasil disimpan", ToastAndroid.SHORT);
        } else {
          // console.warn('pernah');
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Home',
              },
              {
                name: 'Profile',
              }
            ],
          });
          navigation.dispatch(resetAction);
          ToastAndroid.show("Data profil berhasil disimpan", ToastAndroid.SHORT);
        }
      } else {
        console.warn(response);
        setSubmitting(false);
        showLoading(false);
      }
    } catch (error) {
      console.error(error.response);
      setSubmitting(false);
      showLoading(false);
    }
  }

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { params = {} } = this.props.route;
    const { user } = params;

    // If data finish load
    return (
      <Box flex={1}>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />
          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}></View>

          <View style={{
            padding: 16,
            borderRadius: 10,
          }}>
            <Pressable
              onPress={() => {
                // showLoading(true);
                // this.signIn();
              }}>
              {({ pressed }) => {
                return (
                  <ArrowLeft size={30} color={pressed ? '#fff' : '#000'} />
                )
              }}
            </Pressable>
          </View>

          <View style={{
            padding: 16,
          }}>
            <Text sx={{
              "@base": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
              "@sm": {
                fontFamily: "Poppins-SemiBold",
                fontSize: 30,
                lineHeight: '$3xl'
              },
              "@md": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
            }}>
              Update Informasi Umum
            </Text>
            <Text sx={{
              "@base": {
                fontFamily: "Poppins-Light",
                fontSize: "$lg",
              },
              "@sm": {
                fontFamily: "Poppins-Light",
                fontSize: 18,
                lineHeight: '$3xl'
              },
              "@md": {
                fontFamily: "Poppins-Light",
                fontSize: "$lg",
              },
            }}>
              Update data dibawah supaya kami lebih kenal kamu
            </Text>
          </View>

          <ScrollView>
            <View
              sx={{
                "@base": {
                  paddingBottom: '$32'
                },
                "@sm": {
                  paddingBottom: '$32'
                },
                "@md": {
                  paddingBottom: '$56'
                },
              }}
              style={{
                padding: 16,
              }}>
              <KeyboardAvoidingView>
                <Formik
                  innerRef={form => (this.formik = form)}
                  initialValues={{
                    customer_id: user ? user.customer.id : me.customer.id,
                    fullname: user ? user.customer.fullname : me.customer.fullname,
                    phone: user ? user.phone : me.phone,
                    email: user ? user.email : me.email,
                    address: user ? user.customer.address : me.customer.address,
                    referral_from: user ? user.referral_from : me.referral_from,
                    birthday: user ? user.customer.birthday : me.customer.birthday,
                    city: user ? user.customer.city : me.customer.city
                  }}
                  validate={this.validate}
                  onSubmit={(values, actions) => this.submit(values, actions, this.props)}
                >
                  {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                    const isError = field => touched[field] && errors[field];
                    return (
                      <View>
                        <FormField
                          isError={isError}
                          errorText={errors.fullname}
                          defaultValue={values.fullname}
                          fieldName="fullname"
                          label="Nama Lengkap"
                          helperText="Isi nama lengkapmu"
                          onChangeText={(text) => {
                            setFieldValue("fullname", text);
                          }}
                        />
                        <FormField
                          type="phone"
                          isError={isError}
                          errorText={errors.phone}
                          defaultValue={values.phone}
                          fieldName="phone"
                          label="No. Handphone"
                          helperText="Isi nomor handphone"
                          onChangeText={(text) => {
                            setFieldValue("phone", text);
                          }}
                        />
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
                          isError={isError}
                          errorText={errors.birthday}
                          defaultValue={values.birthday}
                          fieldName="birthday"
                          label="Tanggal Lahir"
                          helperText="Isi tanggal lahir"
                          onPress={() => {
                            this.setState({ dateSelect: true })
                          }}
                        />
                        <FormField
                          isError={isError}
                          errorText={errors.city}
                          defaultValue={values.city}
                          fieldName="city"
                          label="Kota"
                          helperText="Isi kota tempat tinggal saat ini"
                          onPress={() => {
                            this.setState({ modalStart: true })
                          }}
                        />
                        <FormField
                          type="textarea"
                          isError={isError}
                          errorText={errors.address}
                          defaultValue={values.address}
                          fieldName="address"
                          label="Alamat"
                          helperText="Isi alamat tempat tinggal saat ini"
                          onChangeText={(text) => {
                            setFieldValue("address", text);
                          }}
                        />
                        <FormField
                          isError={isError}
                          errorText={errors.referral_from}
                          defaultValue={values.referral_from}
                          fieldName="referral_from"
                          label="Kode Referral (Optional)"
                          helperText="Kode referral jika punya"
                          onChangeText={(text) => {
                            setFieldValue("referral_from", text);
                          }}
                        />
                      </View>
                    )
                  }}
                </Formik>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>

        <DatePicker
          modal
          title={"Pilih Tanggal"}
          androidVariant={"iosClone"}
          mode='date'
          open={this.state.dateSelect}
          date={this.state.date}
          onConfirm={(date) => {
            let month = date.getMonth() + 1;
            let tanggal = date.getDate();
            if (month < 10) {
              month = "0" + month.toString();
            }
            if (tanggal < 10) {
              tanggal = "0" + tanggal.toString();
            }
            let datePick = date.getFullYear() + "-" + month
              + "-" + tanggal;
            this.formik.setFieldValue("birthday", datePick, false);
            this.setState({
              date: date,
              datePick: datePick,
              dateSelect: false
            })
          }}
          onCancel={() => {
            this.setState({
              dateSelect: false
            })
          }}
        />

        <Modal
          isOpen={this.state.modalStart}
          onClose={() => {
            this.setState({ modalStart: false })
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            <View h={400} style={{
              backgroundColor: 'white'
            }}>
              <View style={{ padding: 16 }}>
                <Text sx={glueAndroid.Global_textBaseBold}>Pilih Kota</Text>
              </View>
              <FlatList
                data={this.state.city}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      width: '100%',
                    }}
                    onPress={() => {
                      this.formik.setFieldValue("city_id", item.id, false);
                      this.formik.setFieldValue("city", item.name, false);
                      this.setState({
                        cityPick: item,
                        citySelect: item.name,
                        modalStart: false
                      })
                    }}>
                    {({ pressed }) => {
                      return (
                        <Box
                          borderBottomWidth="$1"
                          borderColor="#bfc2c2"
                          backgroundColor={pressed ? '#bfc2c2' : 'white'}
                          sx={{
                            "@base": {
                              padding: 16
                            },
                            "@sm": {
                              padding: 16
                            },
                            "@md": {
                              padding: 16
                            },
                          }}>
                          <Text sx={glueAndroid.Global_textBase}>{item.name}</Text>
                        </Box>
                      )
                    }}
                  </Pressable>
                )}>
              </FlatList>
            </View>
          </ModalContent>
        </Modal>

        <View
          alignContent="center"
          position="absolute"
          backgroundColor="transparent"
          bottom={0}
          w="100%"
          flexDirection="column"
          style={{
            backgroundColor: 'white'
          }}
          sx={{
            "@base": {
              padding: 20
            },
            "@sm": {
              padding: 30
            },
            "@md": {
              padding: 30
            },
          }}
        >
          <Pressable
            style={{
              width: '100%',
              elevation: 1
            }}
            onPress={() => {
              this.formik.handleSubmit();
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
                  borderRadius: 10,
                  borderColor: '#009BD4',
                  borderWidth: 2
                }}>
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={{
                      color: '#fff'
                    }}>
                    Update
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

UpdateAccount.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccount);