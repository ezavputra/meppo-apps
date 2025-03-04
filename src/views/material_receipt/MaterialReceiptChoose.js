import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, Heading, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon, CheckboxGroup,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X, CheckIcon, PlusIcon, Cog, Calendar
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";
import { Formik } from "formik";
import DatePicker from 'react-native-date-picker';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class MaterialReceiptChoose extends Component {
  constructor(props) {
    super(props);

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    if (date.toString().length == 1) {
      date = "0" + date;
    }
    if (month.toString().length == 1) {
      month = "0" + month;
    }

    this.state = {
      max_delivery: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: [],
      item_po: [],
      showModal: false,
      check_pr: [],
      modalAddPR: false,
      refresh: false,
      rfq_detail: 0
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { params = {} } = this.props.route;

    try {
      let post = {
        mode: params.mode
      }
      if (params.mode == "PR") {
        post.status = "39,31";
        post.purchase_for = "site";
      } else {
        post.vendor_id = params.vendor_id;
      }

      const response = await axios.post("/material_receipt/show_transaction", post);
      console.warn(response.data.results);

      this.setState({
        data: response.data.results,
        filtered_data: response.data.results,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  async onAddItem() {
    const { navigation, route } = this.props;
    let done = 0;
    let count = 1;

    try {
      if (this.state.item_po.length == 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Item masih kosong",
          visibilityTime: 2000,
          position: 'bottom',
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        let product_selected = [];

        this.state.item_po.forEach((element) => {
          let item = {
            transaction_id: element.transaction_id,
            transaction_detail_id: element.id,
            product_id: element.product_id,
            qty: element.qty,
            notes: ""
          }
          product_selected.push(item);
        });

        console.warn(product_selected);

        navigation.goBack();
        route.params.onAddItem({
          product_selected: product_selected
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, me } = this.props;
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
                  Add Transaction
                </Text>
              </View>
            </Pressable>
          </View>

          <FlatList
            data={this.state.item_po}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                  marginBottom: index + 1 == this.state.item_po.length ? 100 : 0,
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 5 }}>
                      {item.code}
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%' }}>
                      Product: {"\n"}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.product_name}
                      </Text>
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%' }}>
                      Qty: {"\n"}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.qty}
                      </Text>
                    </Text>
                  </View>
                </View>
              )
            }}>
          </FlatList>

          <Actionsheet
            isOpen={this.state.modalAddPR}
            onClose={() => {
              this.setState({ modalAddPR: false })
            }}>
            <ActionsheetBackdrop />
            <ActionsheetContent w="$full" zIndex={-1}
              padding={0}
              bg='white'>
              <ActionsheetDragIndicatorWrapper borderRadius={0} marginBottom={10}>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <View flexDirection='row' justifyContent='space-between' alignItems='true' width={"100%"} paddingHorizontal={16}>
                <View style={{ flexDirection: 'row' }}>
                  <Cog size={18} color='black' />
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={{ color: 'black', marginLeft: 10 }}>
                    Add Transaction
                  </Text>
                </View>
                <Pressable
                  key={"closemodal"}
                  onPress={() => {
                    this.setState({ modalAddPR: false })
                  }}>
                  <X color="black" size={24} />
                </Pressable>
              </View>
              <FlatList
                data={this.state.filtered_data}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  paddingTop: 10,
                }}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      key={"materialreq1" + index}
                      style={{
                        marginVertical: 5,
                        marginBottom: index + 1 == this.state.filtered_data.length ? 20 : 0
                      }}
                      onPress={() => {
                        item.detail.forEach((element) => {
                          element.transaction_id = item.id;
                          element.code = item.code;
                          this.state.item_po.push(element);
                        });
                        this.setState({ refresh: !this.state.refresh, modalAddPR: false });
                        // this.onAddItem(item)
                      }}>
                      {({ pressed }) => {
                        return (
                          <View style={{
                            flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                            borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                            alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <View>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginBottom: 5 }}>
                                {item.code}
                              </Text>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%' }}>
                                Transaction Date: {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.receipt_date}
                                </Text>
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <ChevronRight size={20} color='black' />
                            </View>
                          </View>
                        )
                      }}
                    </Pressable>
                  )
                }}>
              </FlatList>
            </ActionsheetContent>
          </Actionsheet>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              disabled={this.state.item_po.length == 0 ? false : true}
              onPress={() => {
                this.setState({ modalAddPR: true })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      Add Transaction
                    </Text>
                    <PlusIcon size={18} color='#009BD4' />
                  </View>
                )
              }}
            </Pressable>
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
                        Submit Item
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>

          <DatePicker
            modal
            mode='date'
            open={this.state.dateopen}
            date={this.state.dateInit}
            minimumDate={new Date()}
            onConfirm={(date) => {
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();

              if (day.toString().length == 1) {
                day = "0" + day;
              }
              if (month.toString().length == 1) {
                month = "0" + month;
              };

              this.setState({
                dateInit: date,
                max_delivery: day + "-" + month + "-" + year,
                selectedDate: year + "-" + month + "-" + day,
                dateopen: false
              });
            }}
            onCancel={() => {
              this.setState({
                dateopen: false
              })
            }}
          />

        </Box>
      </>
    );
  }
}

MaterialReceiptChoose.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialReceiptChoose);