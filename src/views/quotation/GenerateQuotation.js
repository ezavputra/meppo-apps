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
  Edit
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
      date_now: date + "-" + month + "-" + year,
      pkp: [{
        id: "y",
        name: 'Iya'
      }, {
        id: "n",
        name: 'Tidak'
      }],
      quotation_item: [{"addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 10000, "product_id": 5, "product_name": "PROFILE FILTER ULTIPLEAT PN PUY3UY045H13", "qty": 10, "subtotal": 90000, "warranty": "3"}, {"addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 20000, "product_id": 12, "product_name": "MOBIL DTE 25 ULTRA ISO VG 46 @408L/DRUM", "qty": 10, "subtotal": 180000, "warranty": "2"}, {"addons": 1, "certificate": null, "disc": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "item_type": "product", "max_delivery": "Additional", "notes": "Tes", "photo": null, "price": 30000, "product_name": "Tes", "qty": 10, "subtotal": 300000, "warranty": "2"}],
      quotation_detail: {"addons_item": 300000, "disc_total_non_addons": 30000, "grand_total": 627000, "ppn": 57000, "total_non_addons": 300000},
      // quotation_detail: {
      //   total_non_addons: 0,
      //   disc_total_non_addons: 0,
      //   addons_item: 0,
      //   ppn: 0,
      //   grand_total: 0
      // },
      non_addons: [{"addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 10000, "product_id": 5, "product_name": "PROFILE FILTER ULTIPLEAT PN PUY3UY045H13", "qty": 10, "subtotal": 90000, "warranty": "3"}, {"addons": 0, "certificate": null, "disc": 10, "discontinue": 0, "estimation_delivery": "23-09-2024", "is_out_of_stock": 1, "max_delivery": "2024-09-22", "notes": "Tes", "photo": null, "price": 20000, "product_id": 12, "product_name": "MOBIL DTE 25 ULTRA ISO VG 46 @408L/DRUM", "qty": 10, "subtotal": 180000, "warranty": "2"}],
      addons: [{"item_estimation_delivery": "23-09-2024", "item_name": "Tes", "item_price": 30000, "item_qty": 10, "item_subtotal": 300000, "item_type": "product", "item_warranty": "2", "notes": "Tes"}]
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
      let param = {
        role: me.role.name
      }
      const response = await axios.post("/request_quotation/create", param);
      if (params.item_selected == null) {
        this.formik.setFieldValue("no_document", response.data.results.code);
      }
      this.setState({
        no_document: response.data.results.code,
        warehouse: response.data.results.warehouse,
        department: response.data.results.department,
        division: response.data.results.division,
        remarks: response.data.results.remarks,
        vendor: response.data.results.vendor,
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
      if (this.state.quotation_item.length == 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Item Quotation belum diisi",
          visibilityTime: 2000,
          position: 'bottom',
          bottomOffset: 150,
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        console.warn(this.state.non_addons);
        console.warn(this.state.addons);

        let formData = {
          "reference_no": params.item.rfq.code,
          "is_pkp": values.pkp,
          "pph_id": 10,
          "term_and_condition": values.tnc,
          "additional_discount": "percentage",
          "additional_discount_amount": 0,
          "total_amount": this.state.quotation_detail.total_non_addons +
            this.state.quotation_detail.addons_item - this.state.quotation_detail.disc_total_non_addons,
          "total_ppn": this.state.quotation_detail.ppn,
          "grand_total_amount": this.state.quotation_detail.grand_total,
          "quotation_details": this.state.non_addons,
          "addons_item": this.state.addons,
          "user_id": me.id,
          "email": me.email
        }

        if (this.state.vendor_selected != null) {
          formData.vendor_id = this.state.vendor_selected
        }

        console.warn(formData);
        const response = await axios.post("/generate_quotation", formData, {
          headers: {
            accept: "multipart/form-data"
          }
        });
        const success = response.data.status;
        // console.warn(response);

        if (success) {
          navigation.goBack();
          route.params.onSuccessAdd();
        }
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

          <ScrollView style={{ padding: 16 }}>
            <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  reference_no: params.item.rfq.code,
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
                      <FormField
                        isReadOnly={true}
                        type="text"
                        isError={isError}
                        errorText={errors.reference_no}
                        defaultValue={values.reference_no}
                        fieldName="reference_no"
                        label="Ref. RFQ"
                        helperText="No. Ref RFQ"
                        onChangeText={(text) => {
                          setFieldValue("reference_no", text);
                        }}
                      />
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
              <View style={{ marginBottom: 200 }}>
                <View style={{
                  padding: 16, borderWidth: 1, borderRadius: 8, borderColor: "#fff",
                  backgroundColor: '#009BD4', flexDirection: 'column'
                }}>
                  <View style={{
                    paddingVertical: 4,
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
              </View>
            </KeyboardAvoidingView>
          </ScrollView>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.navigate({
                    name: 'GenerateQuotationChoose',
                    params: {
                      onAddItem: this.onAddItem,
                      rfq_detail: params.item.rfq.rfq_details,
                      quotation_item: this.state.quotation_item,
                      quotation_detail: this.state.quotation_detail
                    }
                  })
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16,
                      marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4' }}>
                        {this.state.quotation_item.length > 0 ? (
                          this.state.quotation_item.length + " Item Selected"
                        ) : (
                          "Set Quotation Detail"
                        )}
                      </Text>
                      <ChevronRight size={18} color='#009BD4' />
                    </View>
                  )
                }}
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                this.formik.handleSubmit();
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