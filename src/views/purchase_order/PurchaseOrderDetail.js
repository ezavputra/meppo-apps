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
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, Cog, ChevronUpIcon, ChevronDownIcon,
  Download, EyeIcon, FileTextIcon,
  FilterIcon,
  TrashIcon,
  SaveIcon,
  CheckIcon
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

class PurchaseOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      quotation: [],
      showModal: false,
      modalAddPR: false,
      grand_total: 0
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    console.warn(params)
    // this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { params = {} } = this.props.route;

    try {
      const response = await axios.post("/curation/" + params.item.id);
      // console.warn(params);
      this.setState({
        grand_total: response.data.results.data.total_amount,
        filtered_data: response.data.results.curationItem,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.setState({ filtered_data: data.filtered_data });
  }

  async sendApprove(mode) {
    const { navigation, me, accessToken, saveSettings, route } = this.props;
    const { params = {} } = this.props.route;

    try {
      // console.warn(me);
      let parameter = {
        user_id: me.id
      };

      if (mode == 'Reject') {
        formData.reason = this.state.reason;
        response = await axios.post("/curation/reject/" + params.item.id, parameter, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      if (mode == 'Approve') {
        response = await axios.post("/curation/approve/" + params.item.id, parameter, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }

      const success = response.data.status;
      console.warn(response.data);
      if (success) {
        navigation.goBack();
        route.params.onSuccessAdd();
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation } = this.props;
    const { params = {} } = this.props.route;

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
                  fontSize: 24, lineHeight: 32
                }}>
                  Purchase Order
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ marginVertical: 10, marginHorizontal: 16, borderBottomWidth: 1, borderColor: '#000', paddingBottom: 10 }}>
            <View style={{ marginBottom: 5 }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%' }}>
                No. PO :
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{ width: '100%' }}>
                  {" "}{params.item.code}
                </Text>
              </Text>
            </View>

            <View style={{ marginBottom: 5 }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%' }}>
                No. RFQ :
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{ width: '100%' }}>
                  {" "}{params.item.reference_code}
                </Text>
              </Text>
            </View>

            <View>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%' }}>
                Date :
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{ width: '100%' }}>
                  {" "}{params.item.created_at}
                </Text>
              </Text>
            </View>
          </View>

          <ScrollView>
            <Text sx={glueAndroid.Global_textBaseBold}
              style={{ width: '100%', textAlign: 'center', marginVertical: 10 }}>
              Purchase Order Detail
            </Text>

            {params.item.purchase_order_details.map((item, index) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black',
                  marginBottom: index + 1 == this.state.filtered_data.length ? params.item.payment_status_id == '82' ? 10 : 100 : 0,
                  // backgroundColor: pressed ? '#bdeeff' : '#fff',
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Vendor :
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.vendor.name}
                      </Text>
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%' }}>
                      {item.product.name}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}
                      style={{ width: '100%', marginBottom: 4 }}>
                      {item.qty_request} X Rp. {item.price}
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Disc. {item.discount == 0 ? '0' : item.discount + '%'}
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Subtotal : {" Rp. "}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.subtotal}
                      </Text>
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Warranty : {item.warranty} Week
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Estimasi Delivery : {"\n"}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.estimation_delivery}
                      </Text>
                    </Text>
                  </View>
                </View>
              )
            })}

            {params.item.payment_status_id == '82' && (
              <View>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{ width: '100%', textAlign: 'center', marginVertical: 10, marginTop: 15 }}>
                  Payment Order
                </Text>
                {params.item.vendor_payment.map((item, index) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                      borderWidth: 1, borderColor: 'black',
                      marginBottom: index + 1 == params.item.vendor_payment.length ? 200 : 0,
                      // backgroundColor: pressed ? '#bdeeff' : '#fff',
                      alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <View>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4 }}>
                          Vendor :
                          <Text sx={glueAndroid.Global_textLight}
                            style={{ width: '100%' }}>
                            {item.vendor.name}
                          </Text>
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4 }}>
                          Amount :
                          <Text sx={glueAndroid.Global_textLight}
                            style={{ width: '100%' }}>
                            Rp. {item.amount_quotation}
                          </Text>
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4 }}>
                          Note : {"\n"}
                          <Text sx={glueAndroid.Global_textLight}
                            style={{ width: '100%' }}>
                            {item.notes}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}

          </ScrollView>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <View style={{ borderWidth: 1, borderColor: '#000', borderRadius: 5, marginHorizontal: 16 }}>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                padding: 8, marginBottom: 4
              }}>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  Total
                </Text>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  Rp. {params.item.grandtotal - params.item.ppn_amount}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                padding: 8, marginBottom: 4
              }}>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  PPN
                </Text>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  Rp. {params.item.ppn_amount}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                padding: 8, marginBottom: 4
              }}>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  Grand Total
                </Text>
                <Text sx={glueAndroid.Global_textBaseBold}
                  style={{}}>
                  Rp. {params.item.grandtotal}
                </Text>
              </View>
            </View>
          </View>
        </Box>
      </>
    );
  }
}

PurchaseOrderDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetail);