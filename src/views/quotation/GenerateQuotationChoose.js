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
  Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper,
  SelectDragIndicator, SelectItem,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X, CheckIcon, PlusIcon, Cog, Calendar, ChevronDownIcon
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

class GenerateQuotationChoose extends Component {
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
      estimation_delivery: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: params.rfq_detail,
      quotation_item: [],
      showModal: false,
      check_pr: [],
      modalAddons: false,
      addons_state: false,
      item_type: [{
        id: "product",
        name: 'Product'
      }, {
        id: "service",
        name: 'Service / Jasa'
      }],
      refresh: false,
      quotation_detail: params.quotation_detail,
      item_selected: null,
      discount: 0,
      qty: 0,
      price: 0,
      subtotal: 0,
      total_addons: 0,
      total_non_addons: 0,
      disc_total_non_addons: 0,
      addons_item: 0,
      ppn: 0,
      grand_total: 0,
      product_name: ""
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
      params.rfq_detail.forEach(element => {
        let item = {
          price: 0,
          disc: 0,
          subtotal: 0,
          product_id: element.product.id,
          product_name: element.product.name,
          qty: element.qty,
          max_delivery: element.max_date_delivery,
          estimation_delivery: "Belum Set",
          warranty: 0,
          certificate: null,
          photo: null,
          notes: null,
          is_out_of_stock: 1,
          addons: 0
        };

        console.warn(item);
        this.state.quotation_item.push(item);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async onAddItem() {
    const { navigation, route } = this.props;

    try {
      let done = 0;
      let count = 1;
      this.state.quotation_item.forEach(element => {
        if (element.estimation_delivery == "Belum Set") {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: "Ada item yang belum di set",
            visibilityTime: 2000,
            position: 'bottom',
            // autoHide: false,
            onPress: () => {
              Toast.hide();
            }
          });
        } else {
          if (count == this.state.quotation_item.length) {
            done = 1;
          }
        }
        count++;
      });

      if (done == 1) {
        navigation.goBack();
        route.params.onAddItem({
          quotation_item: this.state.quotation_item,
          quotation_detail: this.state.quotation_detail
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  select_opsi(
    data, title, onValueChange,
    defaultvalue = null, selectedvalue = null
  ) {
    return (
      <View style={{ marginVertical: 10 }}>
        <Text sx={glueAndroid.Global_textBaseBold}>
          {title}
        </Text>
        <Select
          defaultValue={defaultvalue}
          selectedValue={selectedvalue}
          style={{ marginTop: 5 }}
          onValueChange={onValueChange}>
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Pilih Opsi" />
            <SelectIcon mr="$3">
              <ChevronDownIcon size={16} color='black' />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {data.map((item) => {
                return (
                  <SelectItem label={item.name} value={item.id} />
                )
              })}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
    )
  }

  render() {
    const { navigation, me } = this.props;
    const { params = {} } = this.props.route;

    let discount = Number(this.state.discount);
    let warranty = "";
    let notes = "";
    let product_name = String(this.state.product_name);
    let qty = Number(this.state.qty);
    let price = Number(this.state.price);
    let subtotal = Number(this.state.subtotal);
    let tipe_item_id = null;
    let tipe_item_name = null;
    let estimation_delivery = this.state.estimation_delivery;

    let grand_total = Number(this.state.grand_total);
    let ppn = Number(this.state.ppn);
    let addons_item = Number(this.state.addons_item);
    let disc_total_non_addons = Number(this.state.disc_total_non_addons);
    let total_non_addons = Number(this.state.total_non_addons);

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
                  Quotation Detail
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{
            padding: 16, borderWidth: 1, borderRadius: 8, borderColor: "#fff",
            backgroundColor: '#009BD4', marginHorizontal: 16, flexDirection: 'column'
          }}>
            <View style={{
              paddingVertical: 4, paddingHorizontal: 12,
              backgroundColor: '#fff', marginBottom: 10, borderRadius: 8
            }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#000', textAlign: 'center' }}>
                Quotation Detail
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#fff' }}>
                Total Non Addons
              </Text>
              <Text sx={glueAndroid.Global_textBase} style={{ color: '#fff' }}>
                {this.state.quotation_detail.total_non_addons}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#fff' }}>
                Disc. Total Non Addons
              </Text>
              <Text sx={glueAndroid.Global_textBase} style={{ color: '#fff' }}>
                {this.state.quotation_detail.disc_total_non_addons}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#fff' }}>
                Addons Item
              </Text>
              <Text sx={glueAndroid.Global_textBase} style={{ color: '#fff' }}>
                {this.state.quotation_detail.addons_item}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#fff' }}>
                PPN (%)
              </Text>
              <Text sx={glueAndroid.Global_textBase} style={{ color: '#fff' }}>
                {this.state.quotation_detail.ppn}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#fff' }}>
                Grand Total
              </Text>
              <Text sx={glueAndroid.Global_textBase} style={{ color: '#fff', textAlign: 'right' }}>
                {this.state.quotation_detail.grand_total}
              </Text>
            </View>
          </View>

          <FlatList
            data={this.state.quotation_item}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10
            }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  key={"item_pr" + index}
                  style={{
                    marginVertical: 5,
                    marginBottom: index + 1 == this.state.quotation_item.length ? 200 : 0
                  }}
                  onPress={() => {
                    price = item.price;
                    discount = item.disc;
                    if (item.addons == 0) {
                      this.setState({
                        index_selected: index,
                        item_selected: item,
                        modalItems: true
                      });
                    } else {
                      Toast.show({
                        type: 'success',
                        text1: 'Info',
                        text2: "Item Additional",
                        visibilityTime: 2000,
                        position: 'bottom',
                        // autoHide: false,
                        onPress: () => {
                          Toast.hide();
                        }
                      });
                    }
                  }}>
                  {({ pressed }) => {
                    // item.estimated_price = item.estimated_price != undefined ? item.estimated_price : estimated_price;
                    // item.max_delivery = item.max_delivery != undefined ? item.max_delivery : max_delivery;
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                        borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <View>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            {item.product_name}
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}
                            style={{ width: '100%' }}>
                            {item.qty} Pcs
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%', marginTop: 5 }}>
                            Price : {" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              Rp. {item.price}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Disc.{" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              {item.disc}%
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Subtotal : {" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              Rp. {item.disc == 0 ? (item.qty * item.price) : ((item.qty * item.price) - ((item.qty * item.price) * item.disc) / 100)}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Max Delivery : {" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              {item.max_delivery == null ? "-" : item.max_delivery}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Estimation Delivery : {" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              {item.estimation_delivery}
                            </Text>
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            Warranty : {" "}
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ width: '100%' }}>
                              {item.warranty} Week
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

          <Actionsheet
            isOpen={this.state.modalItems}
            onClose={() => {
              this.setState({ modalItems: false })
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
                    {this.state.addons_state == false ? 'Edit Item' : 'Add Addons Item'}
                  </Text>
                </View>
                <Pressable
                  key={"closemodal"}
                  onPress={() => {
                    this.setState({ modalItems: false })
                  }}>
                  <X color="black" size={24} />
                </Pressable>
              </View>
              <ScrollView style={{ width: '100%', paddingVertical: 10, paddingHorizontal: 16, height: '50%' }}>
                <View style={{ flex: 1, marginBottom: 60 }}>
                  <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8 }}>
                    <FormField
                      type="number"
                      fieldName="qty"
                      label="Qty"
                      defaultValue={this.state.qty}
                      helperText="Isi quantity quotation"
                      onChangeText={(text) => {
                        qty = text;
                        subtotal = (qty * price) - (qty * price * (discount / 100));
                        this.setState({
                          qty: qty,
                          subtotal: subtotal
                        });
                      }}
                      style={{
                        flex: 0.5, marginRight: 10
                      }}
                    />
                    <FormField
                      type="number"
                      fieldName="price"
                      label="Price"
                      defaultValue={this.state.price}
                      onChangeText={(text) => {
                        price = text;
                        subtotal = (qty * price) - (qty * price * (discount / 100));
                        this.setState({
                          price: price,
                          subtotal: subtotal
                        });
                      }}
                      style={{
                        flex: 0.5, marginLeft: 10
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, marginTop: 8 }}>
                    <FormField
                      type="number"
                      fieldName="discount"
                      label="Discount"
                      defaultValue={this.state.discount}
                      onChangeText={(text) => {
                        discount = text;
                        subtotal = (qty * price) - (qty * price * (discount / 100));
                        this.setState({
                          discount: discount,
                          subtotal: subtotal
                        });
                      }}
                      style={{
                        flex: 0.5
                      }}
                    />
                    <View style={{ padding: 12, flex: 0.5, marginLeft: 12 }}>
                      <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                        style={{ marginBottom: 12 }}>
                        Subtotal
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                        style={{ marginBottom: 4 }}>
                        Rp. {this.state.subtotal}
                      </Text>
                    </View>
                  </View>
                  <FormField
                    type="number"
                    fieldName="warranty"
                    label="Warranty"
                    defaultValue={warranty}
                    onChangeText={(text) => {
                      warranty = text;
                    }}
                  />
                  <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                    style={{ marginBottom: 4 }}>
                    Estimation Delivery
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
                              {this.state.estimation_delivery}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <FormField
                    type="textarea"
                    fieldName="notes"
                    label="Notes"
                    defaultValue={notes}
                    onChangeText={(text) => {
                      notes = text;
                    }}
                  />
                </View>
              </ScrollView>
              <Pressable
                style={{ width: '100%', padding: 16 }}
                onPress={() => {
                  let total_all = 0;

                  let item_selected = this.state.quotation_item.at(this.state.index_selected);
                  item_selected.qty = qty;
                  item_selected.price = price;
                  item_selected.disc = discount;
                  item_selected.subtotal = (qty * price) - (qty * price * (discount / 100));
                  item_selected.notes = notes;
                  item_selected.estimation_delivery = this.state.estimation_delivery;
                  item_selected.warranty = warranty;
                  item_selected.discontinue = 0;

                  total_non_addons = this.state.quotation_item.reduce((a, v) => a = price * qty, 0);
                  disc_total_non_addons = this.state.quotation_item.reduce((a, v) => a = ((qty * price) * discount) / 100, 0);

                  total_all = total_non_addons - disc_total_non_addons;
                  ppn = (total_all * 10) / 100;
                  grand_total = total_all + ppn;

                  this.setState({
                    refresh: !this.state.refresh,
                    modalItems: false,
                    quotation_detail: {
                      total_non_addons: total_non_addons + this.state.quotation_detail.total_non_addons,
                      disc_total_non_addons: disc_total_non_addons + this.state.quotation_detail.disc_total_non_addons,
                      addons_item: this.state.quotation_detail.addons_item,
                      ppn: ppn + this.state.quotation_detail.ppn,
                      grand_total: grand_total + this.state.quotation_detail.grand_total
                    },
                    qty: 0,
                    price: 0,
                    subtotal: 0,
                    discount: 0
                  });

                  discount = "";
                  warranty = "";
                  notes = "";

                  qty = Number(this.state.qty);
                  price = Number(this.state.price);
                  subtotal = Number(this.state.subtotal);

                  total_non_addons = Number(this.state.total_non_addons);
                  disc_total_non_addons = Number(this.state.disc_total_non_addons);
                  addons_item = Number(this.state.addons_item);
                  ppn = Number(this.state.ppn);
                  grand_total = Number(this.state.grand_total);

                  estimation_delivery = this.state.date_now;
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#306fe3' : '#013597', justifyContent: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: '#fff', textAlign: 'center' }}>
                          Submit
                        </Text>
                      </View>
                    </View>
                  )
                }}
              </Pressable>
            </ActionsheetContent>
          </Actionsheet>

          <Actionsheet
            isOpen={this.state.modalAddons}
            onClose={() => {
              this.setState({ modalAddons: false })
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
                    {'Add Addons Item'}
                  </Text>
                </View>
                <Pressable
                  key={"closemodal"}
                  onPress={() => {
                    this.setState({ modalAddons: false })
                  }}>
                  <X color="black" size={24} />
                </Pressable>
              </View>
              <ScrollView style={{ width: '100%', paddingVertical: 10, paddingHorizontal: 16, height: '50%' }}>
                <View style={{ flex: 1, marginBottom: 60 }}>
                  {this.select_opsi(this.state.item_type, "Type Item",
                    (value) => {
                      this.setState({ item_type_selected: value });
                    }
                  )}
                  <FormField
                    type="text"
                    fieldName="product_name"
                    label="Additional Item"
                    defaultValue={product_name}
                    onChangeText={(text) => {
                      product_name = text;
                      this.setState({ product_name: product_name });
                    }}
                  />
                  <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8 }}>
                    <FormField
                      type="number"
                      fieldName="qty"
                      label="Qty"
                      defaultValue={this.state.qty}
                      helperText="Isi quantity quotation"
                      onChangeText={(text) => {
                        qty = text;
                        subtotal = (qty * price) - (qty * price * (0 / 100));
                        this.setState({
                          qty: qty,
                          subtotal: subtotal
                        });
                      }}
                      style={{
                        flex: 0.5, marginRight: 10
                      }}
                    />
                    <FormField
                      type="number"
                      fieldName="price"
                      label="Price"
                      defaultValue={this.state.price}
                      onChangeText={(text) => {
                        price = text;
                        subtotal = (qty * price) - (qty * price * (0 / 100));
                        this.setState({
                          price: price,
                          subtotal: subtotal
                        });
                      }}
                      style={{
                        flex: 0.5, marginLeft: 10
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, marginTop: 8 }}>
                    <View style={{ padding: 12, flex: 1, marginLeft: 12 }}>
                      <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                        style={{ marginBottom: 12 }}>
                        Subtotal
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                        style={{ marginBottom: 4 }}>
                        Rp. {this.state.subtotal}
                      </Text>
                    </View>
                  </View>
                  <FormField
                    type="number"
                    fieldName="warranty"
                    label="Warranty"
                    defaultValue={warranty}
                    onChangeText={(text) => {
                      warranty = text;
                    }}
                  />
                  <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                    style={{ marginBottom: 4 }}>
                    Estimation Delivery
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
                              {this.state.estimation_delivery}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <FormField
                    type="textarea"
                    fieldName="notes"
                    label="Notes"
                    defaultValue={notes}
                    onChangeText={(text) => {
                      notes = text;
                    }}
                  />
                </View>
              </ScrollView>
              <Pressable
                style={{ width: '100%', padding: 16 }}
                onPress={() => {
                  let total_all = 0;
                  let total_addons = 0;

                  let addons = {
                    qty: qty,
                    price: price,
                    disc: 0,
                    subtotal: (qty * price) - (qty * price * (discount / 100)),
                    item_type: this.state.item_type_selected,
                    product_name: this.state.product_name,
                    max_delivery: "Additional",
                    estimation_delivery: this.state.estimation_delivery,
                    warranty: warranty,
                    certificate: null,
                    photo: null,
                    notes: notes,
                    is_out_of_stock: 1,
                    addons: 1
                  }
                  console.warn(addons);
                  this.state.quotation_item.push(addons);

                  total_addons = this.state.quotation_item.filter(function (item_addons) {
                    return item_addons.addons === 1;
                  }).reduce((a, v) => a = price * qty, 0);

                  total_all = total_addons + this.state.grand_total;
                  ppn = (total_all * 10) / 100;
                  grand_total = total_all + ppn;

                  this.setState({
                    refresh: !this.state.refresh,
                    modalAddons: false,
                    quotation_detail: {
                      total_non_addons: this.state.quotation_detail.total_non_addons,
                      disc_total_non_addons: this.state.quotation_detail.disc_total_non_addons,
                      addons_item: total_addons + this.state.quotation_detail.addons_item,
                      ppn: ppn + this.state.quotation_detail.ppn,
                      grand_total: grand_total + this.state.quotation_detail.grand_total
                    },
                    qty: 0,
                    price: 0,
                    subtotal: 0,
                    discount: 0,
                    product_name: ""
                  });

                  warranty = "";
                  notes = "";

                  qty = Number(this.state.qty);
                  price = Number(this.state.price);
                  subtotal = Number(this.state.subtotal);

                  total_non_addons = Number(this.state.total_non_addons);
                  disc_total_non_addons = Number(this.state.disc_total_non_addons);
                  addons_item = Number(this.state.addons_item);
                  ppn = Number(this.state.ppn);
                  grand_total = Number(this.state.grand_total);

                  estimation_delivery = this.state.date_now;
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#306fe3' : '#013597', justifyContent: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: '#fff', textAlign: 'center' }}>
                          Submit
                        </Text>
                      </View>
                    </View>
                  )
                }}
              </Pressable>
            </ActionsheetContent>
          </Actionsheet>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                this.setState({
                  modalAddons: true,
                  addons_state: true
                })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      Addons Quotation Detail
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
                        Submit Quotation Detail
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
                estimation_delivery: day + "-" + month + "-" + year,
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

GenerateQuotationChoose.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(GenerateQuotationChoose);