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

class QuotationDelivery extends Component {
  constructor(props) {
    super(props);
    const { params = {} } = this.props.route;

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
      delivery_date: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: [],
      item_pr: params.item.quotation_details,
      item_pr_product: [],
      item_pr_temp: [],
      showModal: false,
      check_pr: [],
      modalAddPR: false,
      refresh: false,
      rfq_detail: 0,
      awb: "",
      note: "",
      date_delivery: ""
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    // this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    try {
      let post = {
        status: 56,
        purchase_for: 'head-office'
      }
      const response = await axios.post("/purchase_request/show_pr", post);
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
    const { navigation, route, me } = this.props;
    const { params = {} } = this.props.route;
    let delivery_detail = [];

    try {
      this.state.item_pr.forEach(element => {
        if (element.awb_note == "" || element.max_delivery == "" || element.note == "") {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: "Ada bagian yang belum diisi",
            visibilityTime: 2000,
            position: 'bottom',
            // autoHide: false,
            onPress: () => {
              Toast.hide();
            }
          });
        } else {
          delivery_detail.push({
            quotation_detail_id: element.id,
            product_id: element.product_id,
            awb: element.awb_note,
            date: element.date_delivery,
            product_name: element.product != null ? element.product.name : element.item_name,
            note: element.note,
            qty: element.qty_request,
          })
        }
      });

      let formData = {
        delivery_detail: delivery_detail,
        user_id: me.id
      }

      console.warn(formData);

      const response = await axios.post("/quotation/shipping/" + params.item.id, formData, {
        headers: {
          accept: "multipart/form-data"
        }
      });
      const success = response.data.status;

      if (success) {
        navigation.goBack();
        route.params.onSuccessAdd();
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, me } = this.props;
    const { params = {} } = this.props.route;
    let estimated_price = "";
    let awb = String(this.state.awb);
    let date_delivery = this.state.delivery_date;
    let note = String(this.state.note);

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
                  Quotation Delivery
                </Text>
              </View>
            </Pressable>
          </View>

          <FlatList
            data={this.state.item_pr}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
              marginBottom: 80
            }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  key={"item_pr" + index}
                  style={{
                    marginVertical: 5,
                    marginBottom: index + 1 == this.state.item_pr.length ? 100 : 0
                  }}
                  onPress={() => {
                    this.setState({
                      index_selected: index
                    });
                    this.setState({ modalSet: true });
                  }}>
                  {({ pressed }) => {
                    item.awb_note = item.awb_note == undefined ? awb : item.awb_note;
                    item.note = item.note == undefined ? note : item.note;
                    item.date_delivery = item.date_delivery == undefined ? date_delivery : item.date_delivery;
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                        borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <View>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%', marginBottom: 5 }}>
                            {item.product.name}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Qty : {item.qty_request}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            AWB : {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.awb_note == '' ? "Belum di set" : item.awb_note}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Date : {item.date_delivery}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Note : {"\n"}
                            <Text sx={glueAndroid.Global_textLight}
                              style={{ width: '100%' }}>
                              {item.note == '' ? "Belum di set" : item.note}
                            </Text>
                          </Text>
                        </View>
                        <View>
                          <ChevronRight size={28} color='black' />
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )
            }}>
          </FlatList>

          <Modal
            isOpen={this.state.modalSet}
            onClose={() => {
              this.setState({ modalSet: false })
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={400} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <Cog size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Set Value
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalSet: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView style={{ paddingVertical: 10 }}>
                  <FormField
                    type="text"
                    fieldName="awb"
                    label="AWB"
                    defaultValue={""}
                    onChangeText={(text) => {
                      awb = text;
                      this.setState({ awb: awb });
                    }}
                  />
                  <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                    style={{ marginBottom: 4 }}>
                    Date
                  </Text>
                  <Pressable
                    onPress={() => {
                      this.setState({ dateopen: true })
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                          borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                          backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Calendar size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              {this.state.delivery_date}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <FormField
                    type="textarea"
                    fieldName="note"
                    label="Note"
                    defaultValue={""}
                    onChangeText={(text) => {
                      note = text;
                      this.setState({ note: note });
                    }}
                  />
                </ScrollView>
                <Pressable
                  onPress={() => {
                    let item_selected = this.state.item_pr.at(this.state.index_selected);
                    item_selected.awb_note = this.state.awb;
                    item_selected.note = this.state.note;
                    item_selected.date_delivery = this.state.delivery_date;
                    awb = "";
                    note = "";
                    this.setState({ refresh: !this.state.refresh, delivery_date: this.state.date_now });
                    this.setState({ modalSet: false });
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#306fe3' : '#013597', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#fff', marginLeft: 10 }}>
                            Submit
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

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
                        Submit
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
                delivery_date: day + "-" + month + "-" + year,
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

QuotationDelivery.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(QuotationDelivery);