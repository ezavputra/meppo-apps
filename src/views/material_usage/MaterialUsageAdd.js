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

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class MaterialUsageAdd extends Component {
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
      warehouse: [],
      document_status: [{
        id: 1,
        name: 'Submit'
      }],
      product_selected: [],
      revisi_selected: []
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
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    try {
      let param = {
        role: me.role.name
      }
      const response = await axios.post("/material_usage/create", param);
      if (params.item_selected == null) {
        this.formik.setFieldValue("no_document", response.data.results.code);
      }
      this.setState({
        no_document: response.data.results.code,
        warehouse: response.data.results.warehouse,
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
    usage_date, warehouse_id, document_status_id,
  }) {
    const errors = {};

    if (!usage_date) {
      errors.usage_date = "Usage date harus dipilih";
    }
    if (!warehouse_id) {
      errors.warehouse_id = "Warehouse harus dipilih";
    }
    if (!document_status_id) {
      errors.document_status_id = "Document Status tidak boleh kosong";
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
      if (this.state.product_selected.length == 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Item Material Request belum diisi",
          visibilityTime: 2000,
          position: 'bottom',
          bottomOffset: 150,
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        let material_request_details = this.state.product_selected[0].material_request_details;
        let formData = {
          "no_document": values.no_document,
          "usage_date": values.usage_date,
          "department_id": this.state.product_selected[0].department_id,
          "division_id": this.state.product_selected[0].division_id,
          "warehouse_id": values.warehouse_id,
          "document_status_id": values.document_status_id,
          "notes": values.notes,
          "material_usage_detail": material_request_details,
          "user_id": me.id
        }

        console.warn(formData);
        const response = await axios.post("/material_usage/save", formData, {
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
    this.setState({
      product_selected: data.product_selected
    })
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
                  {params.mode == 'Revisi' ? 'Revisi' : 'Pengajuan'} Material Usage
                </Text>
              </View>
            </Pressable>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <KeyboardAvoidingView>
              <Formik
                innerRef={form => (this.formik = form)}
                initialValues={{
                  no_document: params.item_selected != null ? params.item_selected.code : this.state.no_document,
                  usage_date: params.item_selected != null ? params.item_selected.usage_date : this.state.date_now,
                  warehouse_id: params.item_selected != null ? params.item_selected.warehouse_id : "",
                  warehouse_name: params.item_selected != null ? params.item_selected.warehouse.name : "",
                  document_status_id: params.item_selected != null ? params.item_selected.document_status_id : "",
                  document_status_name: params.item_selected != null ? params.item_selected.document_status_name : "",
                  notes: params.item_selected != null ? params.item_selected.notes : ""
                }}
                validate={this.validate}
                onSubmit={(values, actions) => this.submit(values, actions, this.props)}
              >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
                  const isError = field => touched[field] && errors[field];
                  return (
                    <View style={{ marginBottom: 200 }}>
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
                                  {values.usage_date}
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable>
                      {touched.usage_date && errors.usage_date && (
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ color: 'red' }}>
                          Tanggal usage date harus di set
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
                        errorText={errors.notes}
                        defaultValue={values.notes}
                        fieldName="notes"
                        label="Notes"
                        helperText="Isi Notes"
                        onChangeText={(text) => {
                          setFieldValue("notes", text);
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
            {this.state.product_selected.length > 0 && (
              <View style={{
                flexDirection: 'row', marginHorizontal: 16, marginVertical: 4,
              }}>
                <Text sx={glueAndroid.Global_textBaseBold}>
                  Dep. {this.state.product_selected[0].department.name} - 
                </Text>
                <Text sx={glueAndroid.Global_textBaseBold}>
                  {" "}Div. {this.state.product_selected[0].division.name}
                </Text>
              </View>
            )}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Pressable
                style={{ flex: this.state.product_selected.length == 0 ? 1 : 0.8 }}
                onPress={() => {
                  navigation.navigate({
                    name: 'MaterialRequestUsage',
                    params: {
                      onAddItem: this.onAddItem,
                      product_selected: this.state.product_selected
                    }
                  })
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16,
                      marginRight: this.state.product_selected.length == 0 ? 16 : 4,
                      marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4' }}>
                        {this.state.product_selected.length == 0 ? (
                          "Pilih Material Request"
                        ) : (
                          this.state.product_selected[0].code
                        )}
                      </Text>
                      {this.state.product_selected.length == 0 ? (
                        <ChevronRight size={18} color='#009BD4' />
                      ) : (
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: '#009BD4' }}>
                          Ganti
                        </Text>
                      )}
                    </View>
                  )
                }}
              </Pressable>
              {this.state.product_selected.length > 0 && (
                <Pressable
                  style={{ flex: 0.2 }}
                  onPress={() => {
                    navigation.navigate({
                      name: 'MaterialUsageDetailMR',
                      params: {
                        onAddItem: this.onAddItem,
                        material_request_details: this.state.product_selected[0].material_request_details
                      }
                    })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginRight: 16,
                        marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#b5b52b' : '#fafa66', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Edit size={18} color='#999931' />
                      </View>
                    )
                  }}
                </Pressable>
              )}
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
              this.formik.setFieldValue("usage_date", day + "-" + month + "-" + year);

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

MaterialUsageAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialUsageAdd);