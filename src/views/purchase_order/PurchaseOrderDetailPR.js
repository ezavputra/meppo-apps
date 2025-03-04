import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler, KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper,
  SelectDragIndicator, SelectItem,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  PencilIcon, TrashIcon, ArrowLeft, Cog, X,
  ChevronDownIcon,
  CheckIcon,
  ChevronRight
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Formik } from "formik";
import FormField from "../../new-components/FormControlContainer";
import NumericInput from 'react-native-numeric-input';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class PurchaseOrderDetailPR extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { params = {} } = this.props.route;

    this.state = {
      data: [],
      modalAdd: false,
      purchase_request_details: []
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;
    try {
      let item;
      if (params.item_new.length == 0) {
        const response = await axios.post("/purchase_request_detail/" + params.item.id);
        item = response.data.results
      } else {
        item = params.item_new;
      }
      this.setState({
        purchase_request_details: item,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
    }

    console.warn(this.state.purchase_request_details);
    // this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { navigation, params } = this.props;
    try {
      const response = await axios.post("/material_request/list_product_cat/0");
      // this.formik.setFieldValue('stock', '1');
      // console.warn(response);
      this.setState({
        product: response.data.results.product,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onAddItem() {
    const { navigation, route } = this.props;

    navigation.goBack();
    route.params.onAddItemPR({
      product_selected: this.state.purchase_request_details
    });
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
                <Text numberOfLines={1} sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Purchase Request Detail
                </Text>
              </View>
            </Pressable>
          </View>

          <FlatList
            data={this.state.purchase_request_details}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10
            }}
            renderItem={({ item, index }) => {
              if (params.item_new.length == 0) {
                item.price = 0;
                item.notes = "";
              } else {
                item.price = params.item_new[index].price;
                item.notes = params.item_new[index].notes;
              }
              return (
                <View style={{
                  padding: 16, borderBottomWidth: index == this.state.purchase_request_details.length - 1 ? 0 : 1,
                  borderColor: '#bfc2c2',
                  marginBottom: index == this.state.purchase_request_details.length - 1 ? 100 : 0
                }}>
                  <View style={{
                    flexDirection: 'row', borderRadius: 10,
                    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <View style={{ flex: 0.8 }}>
                      <Text sx={glueAndroid.Global_textTitle}>
                        {item.product.name}
                      </Text>
                      <Text sx={glueAndroid.Global_textLight} style={{ marginTop: 4 }}>
                        Code: {item.product.code}
                      </Text>
                      <Text sx={glueAndroid.Global_textLight}>
                        SKU: {item.product.sku}
                      </Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textBaseBold} style={{ marginBottom: 10 }}>
                        Stock: {item.product.stock}
                      </Text>
                      <Pressable
                        onPress={() => {
                          let filteredArray = this.state.purchase_request_details.filter(items => items !== item);
                          this.setState({ purchase_request_details: filteredArray });
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{
                              flexDirection: 'row', padding: 12, borderRadius: 10, alignSelf: 'flex-end',
                              backgroundColor: pressed ? '#c9625f' : '#c9322c', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <TrashIcon size={18} color='white' />
                            </View>
                          )
                        }}
                      </Pressable>
                    </View>
                  </View>
                  <FormField
                    type="text"
                    defaultValue={item.price}
                    fieldName="price"
                    label="Price"
                    helperText="Isi Price"
                    onChangeText={(text) => {
                      item.price = text
                    }}
                    style={{ marginBottom: 0 }}
                  />
                  <FormField
                    type="text"
                    defaultValue={item.notes}
                    fieldName="notes"
                    label="Notes"
                    helperText="Isi Notes"
                    onChangeText={(text) => {
                      item.notes = text
                    }}
                  />
                </View>
              )
            }}>
          </FlatList>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                this.onAddItem();
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
                        Submit PO Item
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>
        </Box>
      </>
    );
  }
}

PurchaseOrderDetailPR.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetailPR);