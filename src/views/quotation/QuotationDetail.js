import React, { Component } from 'react';
import {
  StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { baseURL } from "../../config/app";
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, Heading, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon,
  Download,
  Scroll
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";
// import ReactNativeBlobUtil from 'react-native-blob-util';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class QuotationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delivery_item: [],
      filtered_data: [],
      showModal: false,
      grand_total: 0
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { params = {} } = this.props.route;
    try {
      // const response = await axios.post("/request_quotation");
      this.setState({
        delivery_item: params.item.delivery_item,
        filtered_data: params.item.quotation_details,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async openLink(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'none',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#009BD4',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          // animations: {
          //   startEnter: 'slide_up',
          //   startExit: 'slide_none',
          //   endEnter: 'slide_none',
          //   endExit: 'slide_down'
          // },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        });
      }
      else Linking.openURL(url)
    } catch (error) {
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

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  render() {
    const { navigation } = this.props;
    const { params = {} } = this.props.route;
    let no_doc = "";
    let grand_total = Number(this.state.grand_total);

    // If data finish load
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
                <Text sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 18, lineHeight: 32
                }}>
                  Quotation Detail
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ marginHorizontal: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ marginRight: 8 }}>
                Ref. PO:
              </Text>
              <Text sx={glueAndroid.Global_textBase}>
                {params.item.reference_no}
              </Text>
            </View>
          </View>

          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
              <Text sx={glueAndroid.Global_textBaseBold}>
                Quotation Detail
              </Text>
            </View>

            {this.state.filtered_data.map((item, index) => {
              grand_total += item.subtotal;
              return (
                <View>
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                    borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                    alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <View>
                      <View>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          {item.product_id == null ? item.item_name : item.product.name}
                        </Text>
                        {item.product != undefined && (
                          <View>
                            <Text sx={glueAndroid.Global_textLightItalic}
                              style={{ width: '100%' }}>
                              {item.product.code}
                            </Text>
                            <Text sx={glueAndroid.Global_textLightItalic}
                              style={{ width: '100%' }}>
                              {item.qty_request} {item.product.product_unit.name} X Rp. {item.price}
                            </Text>
                          </View>
                        )}
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginTop: 8 }}>
                          Discount: {item.discount == 0 ? 0 : item.discount + ' %'}
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Subtotal: Rp. {item.subtotal}
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Estimation Delivery: {item.estimation_delivery}
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Warranty {item.warranty} Week
                        </Text>
                      </View>
                    </View>
                  </View>
                  {index + 1 == this.state.filtered_data.length && (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                      borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                      marginBottom: index + 1 == this.state.filtered_data.length ? params.item.document_status_id == '88' ? 10 : 100 : 0,
                      alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>
                        Grand Total
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}>
                        Rp. {grand_total}
                      </Text>
                    </View>
                  )}
                </View>
              )
            })}

            {params.item.document_status_id == '88' && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                  <Text sx={glueAndroid.Global_textBaseBold}>
                    Delivery
                  </Text>
                </View>
                {this.state.delivery_item.map((item, index) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                      borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                      marginBottom: index + 1 == this.state.filtered_data.length ? params.item.document_status_id == '88' ? 10 : 100 : 0,
                      alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <View>
                        <View>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Shipment Date: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.date}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Receipt Date: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.receipt_date}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            AWB: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.awb}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Item Name: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.product_name}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            QTY: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.qty}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Status: {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.document_status.name}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </ScrollView>
        </Box>
      </>
    );
  }
}

QuotationDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(QuotationDetail);