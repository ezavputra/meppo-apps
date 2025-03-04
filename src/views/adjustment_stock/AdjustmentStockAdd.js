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
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, ChevronDownIcon,
  CameraIcon,
  ImageIcon,
  OptionIcon,
  Cog,
  FileIcon
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

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class AdjustmentStockAdd extends Component {
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
      showModal: false,
      date_now: date + "-" + month + "-" + year,
      no_document: "",
      stock_type: [],
      warehouse: [],
      document_status: [],
      product_selected: [],
      unit: [],
      product_category: []
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    if (params.mode) {
      if (params.mode == "scan") {
        this.setState({ product_selected: params.product });
      }
    }

    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    try {
      const response = await axios.post("/adjustment_stock/create");
      this.formik.setFieldValue("no_document", response.data.results.code);
      this.setState({
        stock_type: response.data.results.stock_type,
        warehouse: response.data.results.warehouse,
        document_status: response.data.results.document_status,
        product_category: response.data.results.product_category,
        unit: response.data.results.unit,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getDivision(id) {
    try {
      const response = await axios.post("/purchase_request/get_division/" + id);
      this.setState({
        division: response.data.results.division,
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
        })
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

  validate({
    stock_type_id, warehouse_id, document_status_id
  }) {
    const errors = {};

    if (!stock_type_id) {
      errors.stock_type_id = "Tipe Stock tidak boleh kosong";
    }
    if (!warehouse_id) {
      errors.warehouse_id = "Warehouse tidak boleh kosong";
    }
    if (!document_status_id) {
      errors.document_status_id = "Status dokumen harus dipilih";
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
    const { params = {} } = props.route;

    setSubmitting(true);
    // showLoading(true);
    // console.warn(values);

    try {
      if (this.state.product_selected.length == 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Item Detail Adjustment belum diisi",
          visibilityTime: 2000,
          position: 'bottom',
          bottomOffset: 150,
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        let item_details = [];
        this.state.product_selected.map((item) => {
          item_details.push({
            product_id: item.id,
            product_qty: item.qty,
            product_note: null
          })
        })
        let formData = {
          "code": values.no_document,
          "date": values.req_date,
          "stock_type_id": values.stock_type_id,
          "document_status_id": values.document_status_id,
          "warehouse_id": values.warehouse_id,
          "description": values.description,
          // "document_upload": {
          //   uri: values.document_upload.assets[0].uri,
          //   name: "document-" + Math.floor(Math.random() * 101) + ".jpg",
          //   filename: values.document_upload.assets[0].fileName,
          //   type: values.document_upload.assets[0].type
          // },
          // "photo_upload": {
          //   uri: values.photo_upload.assets[0].uri,
          //   name: "photo-" + Math.floor(Math.random() * 101) + ".jpg",
          //   filename: values.photo_upload.assets[0].fileName,
          //   type: values.photo_upload.assets[0].type
          // },
          "adjustment_details": item_details,
          "user_id": me.id
        }

        console.warn(formData);
        const response = await axios.post("/adjustment_stock/save", formData, {
          headers: {
            accept: "multipart/form-data"
          }
        });
        const success = response.data.status;
        console.warn(response);

        if (success) {
          if (params.mode) {
            if (params.mode == "scan") {
              const resetAction = CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'Home',
                    params: {
                      menu: params.menu
                    }
                  },
                  {
                    name: "AdjustmentStock",
                    params: {
                      menu: params.menu
                    }
                  }
                ],
              });
              navigation.dispatch(resetAction);
            }
          } else {
            navigation.goBack();
            route.params.onSuccessAdd();
          }
        }
      }
    } catch (error) {
      console.warn(error);
      setSubmitting(false);
      showLoading(false);
    }
  }

  onAddItem = async (data) => {
    this.setState({
      product_selected: data.product_selected
    })
  }

  select_opsi(data, title, onValueChange) {
    return (
      <View style={{ marginVertical: 10 }}>
        <Text sx={glueAndroid.Global_textBaseBold}>
          {title}
        </Text>
        <Select
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
    const { navigation } = this.props;
    const { params = {} } = this.props.route;
    let no_doc = "";

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
                  Add Adjustment Stock
                </Text>
              </View>
            </Pressable>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  no_document: this.state.no_document,
                  req_date: this.state.date_now,
                  stock_type_id: "",
                  warehouse_id: "",
                  document_status_id: "",
                  description: ""
                }}
                validate={this.validate}
                onSubmit={(values, actions) => this.submit(values, actions, this.props)}
              >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                  const isError = field => touched[field] && errors[field];
                  return (
                    <View style={{ marginBottom: 200 }}>
                      {this.select_opsi(this.state.stock_type, "Stock Type",
                        (value) => {
                          this.formik.setFieldValue("stock_type_id", value);
                        }
                      )}
                      {touched.stock_type_id && errors.stock_type_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Stock Type harus dipilih
                        </Text>
                      )}
                      <FormField
                        isReadOnly={true}
                        type="text"
                        isError={isError}
                        errorText={errors.no_document}
                        defaultValue={values.no_document}
                        fieldName="no_document"
                        label="No. Dokumen"
                        helperText="Auto Create No. Dokumen"
                        onChangeText={(text) => {
                          setFieldValue("no_document", text);
                        }}
                      />
                      <FormField
                        isReadOnly={true}
                        type="text"
                        isError={isError}
                        errorText={errors.req_date}
                        defaultValue={values.req_date}
                        fieldName="req_date"
                        label="Request Date"
                        helperText="Tanggal Request Adjusment Stock"
                        onChangeText={(text) => {
                          setFieldValue("req_date", text);
                        }}
                      />
                      {this.select_opsi(this.state.warehouse, "Warehouse",
                        (value) => {
                          this.formik.setFieldValue("warehouse_id", value);
                        }
                      )}
                      {touched.warehouse_id && errors.warehouse_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Warehouse harus dipilih
                        </Text>
                      )}
                      {this.select_opsi(this.state.document_status, "Status",
                        (value) => {
                          this.formik.setFieldValue("document_status_id", value);
                        }
                      )}
                      {touched.document_status_id && errors.document_status_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Document Status harus dipilih
                        </Text>
                      )}
                      <FormField
                        type="textarea"
                        isError={isError}
                        errorText={errors.description}
                        defaultValue={values.description}
                        fieldName="description"
                        label="Deskripsi"
                        helperText="Isi Deskripsi"
                        onChangeText={(text) => {
                          setFieldValue("description", text);
                        }}
                      />
                    </View>
                  )
                }}
              </Formik>
            </KeyboardAvoidingView>
          </ScrollView>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                if (params.mode) {
                  if (params.mode == "scan") {
                    navigation.goBack();
                  }
                } else {
                  navigation.navigate({
                    name: 'AdjustmentStockDetailAdd',
                    params: {
                      onAddItem: this.onAddItem,
                      product_category: this.state.product_category,
                      unit: this.state.unit,
                      product_selected: this.state.product_selected
                    }
                  })
                }

              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      {this.state.product_selected.length == 0 ? (
                        "Tambah Item Adjustment"
                      ) : (
                        this.state.product_selected.length + " Items Adjustmented"
                      )}
                    </Text>
                    <ChevronRight size={18} color='#009BD4' />
                  </View>
                )
              }}
            </Pressable>
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

AdjustmentStockAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AdjustmentStockAdd);