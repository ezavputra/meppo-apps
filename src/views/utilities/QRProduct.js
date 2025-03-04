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
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
} from "@gluestack-ui/themed";
import {
  ArrowLeft, Send, ChevronRight,
  PlusIcon, X
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

const { width, height } = Dimensions.get("window");

class QRProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      showModal: true,
      qty: 0,
      index_selected: 0,
      refresh: false
    };
    this.ws = null;
  }

  // Mount User Method
  async componentDidMount() {
    const { showLoading, me } = this.props;
    const { params = {} } = this.props.route;

    if (params.old_data) {
      params.old_data.forEach(element => {
        this.state.product.push(element);
      });
    }

    console.warn(params.data.results.product);
    this.state.product.push(params.data.results.product);
    this.setState({ product: this.uniq(this.state.product, data => data.id) });
    this.setState({ index_selected: this.uniq(this.state.product, data => data.id).length - 1 });
  }

  uniq(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
  }

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { params = {} } = this.props.route;
    const { user } = params;
    let qty = Number(this.state.qty);

    // If data finish loa
    return (
      <>
        <Box
          flex={1}
          sx={{
            _light: { bg: "white" },
            _dark: { bg: "black" },
          }}
        >
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />

          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
            style={{
              backgroundColor: '#013597'
            }} />

          <View style={{ padding: 16 }}>
            <Pressable onPress={() => {
              navigation.goBack()
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ArrowLeft color='black' />
                <Text numberOfLines={1} sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Add Product - Scan QR
                </Text>
              </View>
            </Pressable>
          </View>

          <FlatList
            data={this.state.product}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
            }}
            renderItem={({ item, index }) => {
              item.qty = item.qty != undefined ? item.qty : 0;
              return (
                <View style={{
                  flexDirection: 'row', padding: 16, borderRadius: 10,
                  borderBottomWidth: 1, borderColor: '#bfc2c2', marginBottom: this.state.product.length - 1 == index ? 150 : 0,
                  backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <View style={{ flex: 0.7 }}>
                    <Text sx={glueAndroid.Global_textTitle}>
                      {item.name}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight} style={{ marginTop: 4 }}>
                      Code: {item.code}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}>
                      SKU: {item.sku}
                    </Text>
                  </View>

                  <View style={{ flex: 0.3 }}>
                    <Pressable
                      onPress={() => {
                        this.setState({ showModal: true, index_selected: index });
                      }}>
                      {({ pressed }) => {
                        return (
                          <View style={{
                            flexDirection: 'row', padding: 12, borderRadius: 10, alignSelf: 'flex-end',
                            backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ color: 'white' }}>
                                + {item.qty}
                              </Text>
                            </View>
                          </View>
                        )
                      }}
                    </Pressable>
                  </View>
                </View>
              )
            }}>
          </FlatList>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.navigate({
                    name: 'QRScanner',
                    params: {
                      mode: 'add-again',
                      menu: params.menu,
                      product: this.state.product
                    }
                  })
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 8, marginRight: 6,
                      backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4' }}>
                        Tambah Scan Product
                      </Text>
                      <PlusIcon size={18} color='#009BD4' />
                    </View>
                  )
                }}
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                navigation.navigate({
                  name: 'AdjustmentStockAdd',
                  params: {
                    mode: 'scan',
                    menu: params.menu,
                    product: this.state.product
                  }
                })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                    backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: 'white' }}>
                        Submit Item
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>

          <Modal
            isOpen={this.state.showModal}
            onClose={() => {
              this.setState({ showModal: false })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={400} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <PlusIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Add Stock
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ showModal: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView style={{ paddingVertical: 10 }}>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}>
                      {params.data.results.product.name}
                    </Text>
                    <Text sx={glueAndroid.Global_textLightItalic}>
                      {params.data.results.product.code}
                    </Text>
                  </View>
                  <FormField
                    type="number"
                    fieldName="qty"
                    label="Qty"
                    onChangeText={(text) => {
                      qty = text;
                    }}
                  />
                </ScrollView>
                <Pressable
                  onPress={() => {
                    console.warn(qty);
                    console.warn(this.state.index_selected);
                    this.state.product.at(this.state.index_selected).qty = qty;
                    this.setState({
                      refresh: !this.state.refresh,
                      showModal: false
                    });
                    // qty = 0;
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#81defc' : '#bdeeff', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#009BD4', marginLeft: 10 }}>
                            Add Stock
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>
        </Box>
      </>
    );
  }
}

QRProduct.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(QRProduct);