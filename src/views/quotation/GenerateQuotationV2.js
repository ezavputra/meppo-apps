import React, { Component } from 'react';
import {
  StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler,
  KeyboardAvoidingView, PermissionsAndroid
} from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import {
  setAccessToken,
  setAlert,
  setLoading,
  setUserSession,
  setSettings,
  setOrderPaymentSurveyCount,
} from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, Heading, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper,
  SelectDragIndicator, SelectItem,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
  EditIcon,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, ChevronDownIcon, Calendar,
  CameraIcon,
  ImageIcon,
  OptionIcon,
  Cog,
  FileIcon,
  Edit,
  SaveIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import { Formik } from "formik";
import FormField from "../../new-components/FormControlContainer";
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { UploadIcon } from 'lucide-react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import DatePicker from 'react-native-date-picker';
import Select2 from "react-native-select-two";

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class GenerateQuotation extends Component {
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
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      showModal: false,
      modalItems: false,
      date_now: date + "-" + month + "-" + year,
      pkp: [{
        id: "y",
        name: 'Iya'
      }, {
        id: "n",
        name: 'Tidak'
      }],
      // quotation_item: [{ "addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 10000, "product_id": 5, "product_name": "PROFILE FILTER ULTIPLEAT PN PUY3UY045H13", "qty": 10, "subtotal": 90000, "warranty": "3" }, { "addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 20000, "product_id": 12, "product_name": "MOBIL DTE 25 ULTRA ISO VG 46 @408L/DRUM", "qty": 10, "subtotal": 180000, "warranty": "2" }, { "addons": 1, "certificate": null, "disc": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "item_type": "product", "max_delivery": "Additional", "notes": "Tes", "photo": null, "price": 30000, "product_name": "Tes", "qty": 10, "subtotal": 300000, "warranty": "2" }],
      // quotation_detail: { "addons_item": 300000, "disc_total_non_addons": 30000, "grand_total": 627000, "ppn": 57000, "total_non_addons": 300000 },
      quotation_detail: {
        total_non_addons: 0,
        disc_total_non_addons: 0,
        addons_item: 0,
        ppn: 0,
        grand_total: 0
      },
      // non_addons: [{ "addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 10000, "product_id": 5, "product_name": "PROFILE FILTER ULTIPLEAT PN PUY3UY045H13", "qty": 10, "subtotal": 90000, "warranty": "3" }, { "addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 20000, "product_id": 12, "product_name": "MOBIL DTE 25 ULTRA ISO VG 46 @408L/DRUM", "qty": 10, "subtotal": 180000, "warranty": "2" }],
      // addons: [{ "item_estimation_delivery": "23-09-2024", "item_name": "Tes", "item_price": 30000, "item_qty": 10, "item_subtotal": 300000, "item_type": "product", "item_warranty": "2", "notes": "Tes" }],
      estimation_delivery: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      // filtered_data: params.rfq_detail,
      quotation_item: [],
      // quotation_detail: [],
      non_addons: [],
      addons: [],
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
      // quotation_detail: params.quotation_detail,
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
    const { params = {} } = this.props.route;

    console.warn(params);

    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    try {
      params.item_selected.forEach(element => {
        let item = {
          price: 0,
          disc: 0,
          subtotal: 0,
          product_id: element.product.id,
          product_name: element.product.name,
          qty: element.qty,
          max_delivery: element.created_at,
          estimation_delivery: "Belum Set",
          warranty: 0,
          certificate: null,
          notes: null,
          is_out_of_stock: 1,
          addons: 0,
          created_at: element.created_at,
          product: element.product
        };

        console.warn(item);
        this.state.quotation_item.push(item);
      });
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

  validate({
    tnc, pkp
  }) {
    const errors = {};

    // if (!vendor_id) {
    //   errors.vendor_id = "Vendor harus dipilih salah satu";
    // }
    // if (this.state.vendor_selected != null) {
    //   errors.vendor_id = "Vendor harus dipilih salah satu";
    // }
    if (!pkp) {
      errors.pkp = "PKP harus dipilih";
    }
    if (!tnc) {
      errors.tnc = "TNC harus diisi";
    }
    // if (!photo_upload) {
    //   errors.photo_upload = "Photo tidak boleh kosong";
    // }
    // if (!document_upload) {
    //   errors.document_upload = "Dokumen tidak boleh kosong";
    // }

    return errors;
  }

  async submit(values, actions, props) {
    const { navigation, showLoading, saveSession, route, me } = props;
    const { setSubmitting } = actions;
    const { params = {} } = this.props.route;

    setSubmitting(true);
    // showLoading(true);
    // console.warn(values);

    try {
      console.warn(this.state.non_addons);
      console.warn(this.state.addons);

      let formData = {
        "reference_no": params.item.code,
        "is_pkp": values.pkp,
        "pph_id": 10,
        "term_and_condition": values.tnc,
        "additional_discount": "percentage",
        "additional_discount_amount": 0,
        "total_amount": this.state.quotation_detail.total_non_addons +
          this.state.quotation_detail.addons_item - this.state.quotation_detail.disc_total_non_addons,
        "total_ppn": this.state.quotation_detail.ppn,
        "grand_total_amount": this.state.quotation_detail.grand_total,
        "quotation_details": this.state.quotation_item,
        "addons_item": this.state.addons,
        "user_id": me.id,
        "email": me.email
      }

      console.warn(formData);
      const response = await axios.post("/generate_quotation", formData, {
        headers: {
          accept: "multipart/form-data"
        }
      });
      const success = response.data.status;
      console.warn(response);

      if (success) {
        navigation.navigate({
          name: 'VendorRequestQuotation'
        })
        route.params.onSuccessAdd();
      }
    } catch (error) {
      console.warn(error);
      setSubmitting(false);
      showLoading(false);
    }
  }

  onAddItem = async (data) => {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    if (params.mode == 'Revisi') {
      data.product_selected.forEach((element) => {
        let item = {
          product_id: element.id,
          qty: element.qty,
          notes: null,
          product: element
        }
        this.state.revisi_selected.push(item);
      });
    }

    console.warn(data.quotation_item);
    console.warn(data.quotation_detail);

    data.quotation_item.forEach((element) => {
      if (element.addons == 0) {
        this.state.non_addons.push(element);
      } else if (element.addons == 1) {
        let item = {
          item_name: element.product_name,
          item_price: element.price,
          item_type: element.item_type,
          item_qty: element.qty,
          item_subtotal: element.subtotal,
          item_warranty: element.warranty,
          item_estimation_delivery: element.estimation_delivery,
          notes: element.notes
        }
        this.state.addons.push(item);
      }
    });

    console.warn(this.state.non_addons);
    console.warn(this.state.addons);

    this.setState({
      quotation_item: data.quotation_item,
      quotation_detail: data.quotation_detail,
    });
    console.warn(data);
  }

  onAddItemPR = async (data) => {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    this.setState({
      PRSelected: data.product_selected
    });
  }

  render() {
    const { navigation } = this.props;
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
                <Text numberOfLines={1} sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Generate Quotation
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%', marginBottom: 4 }}>
                Ref Purchase Request
              </Text>
              <Text sx={glueAndroid.Global_textBase}
                style={{ width: '100%', marginBottom: 4 }}>
                {params.item.code}
              </Text>
            </View>
          </View>

          <Text sx={glueAndroid.Global_textBaseBold}
            style={{ width: '100%', marginBottom: 4, marginHorizontal: 16 }}>
            Detail Quotation
          </Text>
          <FlatList
            data={this.state.quotation_item}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  flex: 1, flexDirection: 'column',
                  marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black',
                  marginBottom: index + 1 == this.state.quotation_item.length ? 200 : 0,
                  // backgroundColor: pressed ? '#bdeeff' : '#fff',
                  justifyContent: 'space-between'
                }}>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={{ uri: "https://staging.meppo-app.com/" + item.product.photo }}
                        sx={{
                          "@base": {
                            width: 80,
                            height: 80,
                          },
                          "@sm": {
                            width: 80,
                            height: 80,
                          },
                          "@md": {
                            width: 80,
                            height: 80,
                          },
                        }}
                        resizeMode='stretch'
                      />
                      <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4 }}>
                          {item.product.name}
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4 }}>
                          Max Delivery:
                        </Text>
                        <Text sx={glueAndroid.Global_textLightItalic}
                          style={{ width: '100%', marginBottom: 2 }}>
                          {item.created_at}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          {item.qty_vendor && (
                            <View>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginBottom: 4 }}>
                                Qty
                              </Text>
                              <Text sx={glueAndroid.Global_textLightItalic}
                                style={{ width: '100%', marginBottom: 2 }}>
                                {item.qty_vendor}
                              </Text>
                            </View>
                          )}
                          {item.price_vendor && (
                            <View style={{ marginLeft: 10 }}>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginBottom: 4 }}>
                                Price
                              </Text>
                              <Text sx={glueAndroid.Global_textLightItalic}
                                style={{ width: '100%', marginBottom: 2 }}>
                                {item.price_vendor}
                              </Text>
                            </View>
                          )}
                        </View>

                      </View>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => {
                      this.setState({ modalItems: !this.state.modalItems, index_selected: index });
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          padding: 12, borderRadius: 10, marginTop: 10,
                          backgroundColor: pressed ? '#306fe3' : '#013597',
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: 'white' }}>
                              Set Curation
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
              )
            }}>
          </FlatList>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                this.setState({ modalAddons: !this.state.modalAddons })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      Tambah Additional Item
                    </Text>
                    <PlusIcon size={18} color='#009BD4' />
                  </View>
                )
              }}
            </Pressable>
            <Pressable
              onPress={() => {
                // this.formik.handleSubmit();
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
                  this.setState({ showModal: !this.state.showModal });
                }

              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                    backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: 'white', marginLeft: 10 }}>
                        Submit Data
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
                    <SaveIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Konfirmasi
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
                  <Formik
                    innerRef={form => (this.formik = form)}
                    initialValues={{
                      reference_no: params.item.code,
                      pkp: "",
                      tnc: "",
                    }}
                    validate={this.validate}
                    onSubmit={(values, actions) => this.submit(values, actions, this.props)}
                  >
                    {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                      const isError = field => touched[field] && errors[field];
                      return (
                        <View>
                          {this.select_opsi(this.state.pkp, "PKP",
                            (value) => {
                              this.formik.setFieldValue("pkp", value);
                            }, values.pkp_id, values.pkp_name
                          )}
                          {touched.pkp && errors.pkp && (
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ color: 'red', marginBottom: 10 }}>
                              PKP harus dipilih
                            </Text>
                          )}
                          <FormField
                            type="textarea"
                            isError={isError}
                            errorText={errors.tnc}
                            defaultValue={values.tnc}
                            fieldName="tnc"
                            label="Terms and Condition"
                            helperText="Isi Terms and Condition"
                            onChangeText={(text) => {
                              setFieldValue("tnc", text);
                            }}
                          />
                        </View>
                      )
                    }}
                  </Formik>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    this.formik.handleSubmit();
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#306fe3' : '#013597', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <SaveIcon size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Generate Quotation
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

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
                    // defaultValue={product_name}
                    onChangeText={(text) => {
                      // product_name = text;
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
                    // defaultValue={warranty}
                    onChangeText={(text) => {
                      // warranty = text;
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
                    // defaultValue={notes}
                    onChangeText={(text) => {
                      // notes = text;
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

                  console.warn(this.state.quotation_detail)

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
                    Edit Item
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
                  item_selected.qty_vendor = qty;
                  item_selected.price_vendor = price;
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

                  console.warn(this.state.quotation_detail);

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
        </Box>
      </>
    );
  }
}

GenerateQuotation.propTypes = {
  saveSettings: PropTypes.func,
  showLoading: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken }) => ({
  accessToken,
  me: userSession,
});

const mapDispatchToProps = (dispatch) => ({
  saveSession: (user) => dispatch(setUserSession(user)),
  saveAccessToken: (token) => dispatch(setAccessToken(token)),
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
  saveSettings: (user) => dispatch(setSettings(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GenerateQuotation);