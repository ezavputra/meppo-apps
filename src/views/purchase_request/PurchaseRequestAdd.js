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
  FileIcon, Calendar
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
// import DocumentPicker, { types } from 'react-native-document-picker';
import DatePicker from 'react-native-date-picker';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class PurchaseRequestAdd extends Component {
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
      no_document: "",
      purchase_request_for: [
        {
          "id": 'site',
          "name": 'Site'
        },
        {
          "id": 'head-office',
          "name": 'Head Office'
        }
      ],
      remarks: [],
      department: [],
      division: [],
      warehouse: [],
      product_category: [],
      purchase_type: [],
      document_status: [{
        id: 1,
        name: 'Submit'
      }],
      product_selected: [],
      revisi_selected: [],
      unit: []
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    if (params.mode == 'Revisi') {
      this.setState({ selectedDate: params.item_selected.effective_date });
      params.detail_selected.forEach(element => {
        element.product.product_id = element.product_id;
        element.product.qty = element.qty;
        element.product.notes = null;
        this.state.product_selected.push(element.product);
      });
    } else {
      this.formik.setFieldValue("purchase_request_for", this.state.purchase_request_for[0].id);
    }

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
      const response = await axios.post("/purchase_request/create", param);
      if (params.item_selected == null) {
        this.formik.setFieldValue("no_document", response.data.results.code);
      }
      this.setState({
        remarks: response.data.results.remarks,
        department: response.data.results.department,
        division: response.data.results.division,
        warehouse: response.data.results.warehouse,
        unit: response.data.results.unit,
        product_category: response.data.results.product_category,
        purchase_type: response.data.results.purchase_type,
        // document_status: response.data.results.document_status
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
    document_upload, department_id, division_id, warehouse_id,
    justification, photo_upload, purchase_type, effective_date,
    document_status_id, remarks_id
  }) {
    const errors = {};

    if (!purchase_type) {
      errors.purchase_type = "Purchase Type tidak boleh kosong";
    }
    if (!department_id) {
      errors.department_id = "Department tidak boleh kosong";
    }
    if (!division_id) {
      errors.division_id = "Divisi tidak boleh kosong";
    }
    if (!warehouse_id) {
      errors.warehouse_id = "Warehouse tidak boleh kosong";
    }
    if (!document_status_id) {
      errors.document_status_id = "Status dokumen harus dipilih";
    }
    if (!remarks_id) {
      errors.remarks_id = "Remarks harus dipilih";
    }
    if (!justification) {
      errors.justification = "Justifikasi tidak boleh kosong";
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
          text2: "Item Detail Request belum diisi",
          visibilityTime: 2000,
          position: 'bottom',
          bottomOffset: 150,
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        let formData = {
          "purchase_for": values.purchase_request_for,
          "purchase_type_id": values.purchase_type,
          "code": values.no_document,
          "effective_date": this.state.selectedDate,
          "description": values.justification,
          "document_status_id": values.document_status_id,
          "remark_id": values.remarks_id,
          "department_id": values.department_id,
          "division_id": values.division_id,
          "warehouse_id": values.warehouse_id,
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
          "product_selected": this.state.product_selected,
          "user_id": me.id
        }

        let response;
        console.warn(formData);
        if (params.mode == 'Revisi') {
          formData.material_request_details =
            this.state.revisi_selected.length == 0 ? this.state.product_selected : this.state.revisi_selected;
          console.warn(formData);
          response = await axios.post("/purchase_request/approve/" + params.item_selected.id, formData, {
            headers: {
              accept: "multipart/form-data"
            }
          });
        } else {
          console.warn(formData);
          response = await axios.post("/purchase_request/save", formData, {
            headers: {
              accept: "multipart/form-data"
            }
          });
        }
        const success = response.data.status;
        console.warn(response);

        if (success) {
          if (params.mode == 'Revisi') {
            navigation.pop(2);
          } else {
            navigation.goBack();
          }
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
    this.setState({
      product_selected: data.product_selected
    })
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
                  {params.mode == 'Revisi' ? params.mode : 'Pengajuan'} Purchase Request
                </Text>
              </View>
            </Pressable>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  purchase_request_for: params.item_selected != null ? params.item_selected.purchase_for : "",
                  purchase_type: params.item_selected != null ? params.item_selected.type_purchase_request : "",
                  no_document: params.item_selected != null ? params.item_selected.code : this.state.no_document,
                  effective_date: params.item_selected != null ? params.item_selected.effective_date : this.state.date_now,
                  justification: params.item_selected != null ? params.item_selected.notes : "",
                  document_status_id: params.item_selected != null ? params.item_selected.document_status_id : "",
                  remarks_id: params.item_selected != null ? params.item_selected.remark_id : "",
                  remarks_name: params.item_selected != null ? params.item_selected.remark.name : "",
                  document_upload: null,
                  photo_upload: null,
                  department_id: params.item_selected != null ? params.item_selected.department_id : "",
                  department_name: params.item_selected != null ? params.item_selected.department.name : "",
                  division_id: params.item_selected != null ? params.item_selected.division_id : "",
                  division_name: params.item_selected != null ? params.item_selected.division.name : "",
                  warehouse_id: params.item_selected != null ? params.item_selected.warehouse_id : "",
                  warehouse_name: params.item_selected != null ? params.item_selected.warehouse.name : "",
                }}
                validate={this.validate}
                onSubmit={(values, actions) => this.submit(values, actions, this.props)}
              >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                  const isError = field => touched[field] && errors[field];
                  return (
                    <View style={{ marginBottom: 200 }}>
                      {this.select_opsi(this.state.purchase_request_for, "Purchase Request For",
                        (value) => {
                          this.formik.setFieldValue("purchase_request_for", value);
                        }, 'site', 'Site'
                      )}
                      {params.mode != 'Revisi' && (
                        <View>
                          {this.select_opsi(this.state.purchase_type, "Purchase Type",
                            (value) => {
                              this.formik.setFieldValue("purchase_type", value);
                            }, 
                          )}
                          {touched.purchase_type && errors.purchase_type && (
                            <Text sx={glueAndroid.Global_textBase}
                              style={{ color: 'red', marginBottom: 10 }}>
                              Purchase Type harus dipilih
                            </Text>
                          )}
                        </View>
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
                                  {values.effective_date}
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable>
                      {touched.effective_date && errors.effective_date && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Tanggal effective date harus di set
                        </Text>
                      )}
                      {this.select_opsi(this.state.department, "Department",
                        (value) => {
                          this.getDivision(value);
                          this.formik.setFieldValue("department_id", value);
                        }, values.department_id, values.department_name
                      )}
                      {touched.department_id && errors.department_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Department harus dipilih
                        </Text>
                      )}
                      {this.select_opsi(this.state.division, "Divisi",
                        (value) => {
                          this.formik.setFieldValue("division_id", value);
                        }, values.division_id, values.division_name
                      )}
                      {touched.division_id && errors.division_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Divisi harus dipilih
                        </Text>
                      )}
                      {this.select_opsi(this.state.warehouse, "Warehouse",
                        (value) => {
                          this.formik.setFieldValue("warehouse_id", value);
                        }, values.warehouse_id, values.warehouse_name
                      )}
                      {touched.warehouse_id && errors.warehouse_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red', marginBottom: 10 }}>
                          Warehouse harus dipilih
                        </Text>
                      )}
                      <Text sx={glueAndroid.Global_textBaseBold}>
                        Photo
                      </Text>
                      <Pressable
                        onPress={() => {
                          this.setState({ showModal: true })
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{
                              flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                              borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                              backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                            }}>
                              <View style={{ flexDirection: 'row' }}>
                                {values.photo_upload != null ? (
                                  <ImageIcon size={18} color='#009BD4' />
                                ) : (
                                  <UploadIcon size={18} color='#009BD4' />
                                )}
                                <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                                  style={{ color: '#009BD4', marginLeft: 10, width: values.photo_upload != null ? '90%' : 'auto' }}>
                                  {values.photo_upload != null ? (
                                    values.photo_upload.assets[0].fileName
                                  ) : (
                                    "Upload"
                                  )}
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable>
                      {touched.photo_upload && errors.photo_upload && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Harus ada photo yang di upload
                        </Text>
                      )}
                      <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 10 }}>
                        Dokumen
                      </Text>
                      <Pressable
                        onPress={async () => {
                          const result = await launchImageLibrary({
                            'mediaType': 'photo'
                          })
                            .then((response) => {
                              this.setState({ showModal: false });
                              this.formik.setFieldValue("document_upload", response);
                            })
                            .catch((error) => {
                              console.log('error', error);
                              this.setState({ showModal: false });
                            });
                          // const response = await DocumentPicker.pick({
                          //   presentationStyle: 'fullScreen',
                          //   type: [types.pdf],
                          // });
                          // console.warn(response);
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{
                              flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                              borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                              backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                            }}>
                              <View style={{ flexDirection: 'row' }}>
                                {values.document_upload != null ? (
                                  <FileIcon size={18} color='#009BD4' />
                                ) : (
                                  <UploadIcon size={18} color='#009BD4' />
                                )}
                                <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                                  style={{ color: '#009BD4', marginLeft: 10, width: values.document_upload != null ? '90%' : 'auto' }}>
                                  {values.document_upload != null ? (
                                    values.document_upload.assets[0].fileName
                                  ) : (
                                    "Upload"
                                  )}
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable>
                      {touched.document_upload && errors.document_upload && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Harus ada dokumen yang di upload
                        </Text>
                      )}
                      <FormField
                        type="textarea"
                        isError={isError}
                        errorText={errors.justification}
                        defaultValue={values.justification}
                        fieldName="justification"
                        label="Justifikasi"
                        helperText="Isi Justifikasi"
                        onChangeText={(text) => {
                          setFieldValue("justification", text);
                        }}
                      />
                      {this.select_opsi(this.state.remarks, "Remarks",
                        (value) => {
                          this.formik.setFieldValue("remarks_id", value);
                        }, values.remarks_id, values.remarks_name
                      )}
                      {touched.remarks_id && errors.remarks_id && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Remarks harus dipilih
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
                      {/* <Pressable
                        onPress={() => {
                          this.setState({ modalDocStatus: true })
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{
                              flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                              borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                              backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                            }}>
                              <View style={{ flexDirection: 'row' }}>
                                {values.document_status_id == "" && (
                                  <Cog size={18} color='#009BD4' />
                                )}
                                <Text sx={glueAndroid.Global_textBaseBold}
                                  style={{ color: '#009BD4', marginLeft: 10 }}>
                                  {values.document_status_id == "" ? "Pilih Opsi" : values.document_status_name}
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable> */}
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
                navigation.navigate({
                  name: 'PurchaseRequestDetailAdd',
                  params: {
                    onAddItem: this.onAddItem,
                    product_category: this.state.product_category,
                    unit: this.state.unit,
                    product_selected: this.state.product_selected
                  }
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
                      {this.state.product_selected.length == 0 ? (
                        "Tambah Item Purchase Request Detail"
                      ) : (
                        this.state.product_selected.length + " Items Requested"
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

          <Modal
            isOpen={this.state.showModal}
            onClose={() => {
              this.setState({ showModal: false })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={200} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <UploadIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Opsi Upload Photo
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
                <View style={{ marginTop: 16 }}>
                  <Pressable
                    onPress={async () => {
                      try {
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.CAMERA,
                          {
                            title: "App Camera Permission",
                            message: "App needs access to your camera ",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                          }
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                          const result = await launchCamera({
                            'mediaType': 'photo'
                          })
                            .then((response) => {
                              this.setState({ showModal: false });
                              this.formik.setFieldValue("photo_upload", response);
                              console.warn(response)
                            })
                            .catch((error) => {
                              console.log('error', error);
                              this.setState({ showModal: false });
                            });
                        } else {
                          console.log("Camera permission denied");
                        }
                      } catch (err) {
                        console.warn(err);
                      }
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                          borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                          backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <CameraIcon size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              Ambil dari Camera
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      const result = await launchImageLibrary({
                        'mediaType': 'photo'
                      })
                        .then((response) => {
                          this.setState({ showModal: false });
                          this.formik.setFieldValue("photo_upload", response);
                          console.warn(response)
                        })
                        .catch((error) => {
                          console.log('error', error);
                          this.setState({ showModal: false });
                        });
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                          borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                          backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <ImageIcon size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              Ambil dari Gallery
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
              </View>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={this.state.modalRemark}
            onClose={() => {
              this.setState({ modalRemark: false })
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={300} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <Cog size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Remarks
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalRemark: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <FlatList
                  data={this.state.remarks}
                  style={{
                    marginTop: 10
                  }}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        this.formik.setFieldValue("remarks_id", item.id);
                        this.formik.setFieldValue("remarks_name", item.name);
                        this.setState({ modalRemark: false });
                      }}>
                      {({ pressed }) => {
                        return (
                          <Box
                            borderBottomWidth="$1"
                            borderColor="#bfc2c2"
                            backgroundColor={pressed ? '#bfc2c2' : 'white'}
                            marginVertical={4}
                            sx={{
                              "@base": {
                                padding: 16
                              },
                              "@sm": {
                                padding: 16
                              },
                              "@md": {
                                padding: 16
                              },
                            }}>
                            <Text sx={glueAndroid.Global_textBase}>{item.name}</Text>
                          </Box>
                        )
                      }}
                    </Pressable>
                  )}>
                </FlatList>
              </View>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={this.state.modalDocStatus}
            onClose={() => {
              this.setState({ modalDocStatus: false })
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={300} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <Cog size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Status
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalDocStatus: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <FlatList
                  data={this.state.document_status}
                  style={{
                    marginTop: 10
                  }}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        this.formik.setFieldValue("document_status_id", item.id);
                        this.formik.setFieldValue("document_status_name", item.name);
                        this.setState({ modalDocStatus: false });
                      }}>
                      {({ pressed }) => {
                        return (
                          <Box
                            borderBottomWidth="$1"
                            borderColor="#bfc2c2"
                            backgroundColor={pressed ? '#bfc2c2' : 'white'}
                            marginVertical={4}
                            sx={{
                              "@base": {
                                padding: 16
                              },
                              "@sm": {
                                padding: 16
                              },
                              "@md": {
                                padding: 16
                              },
                            }}>
                            <Text sx={glueAndroid.Global_textBase}>{item.name}</Text>
                          </Box>
                        )
                      }}
                    </Pressable>
                  )}>
                </FlatList>
              </View>
            </ModalContent>
          </Modal>

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
              }
              this.formik.setFieldValue("effective_date", day + "-" + month + "-" + year);

              this.setState({
                dateInit: date,
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

PurchaseRequestAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRequestAdd);