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
  ChevronRight,
  PlusIcon
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

class AdjustmentStockDetailAdd extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { params = {} } = this.props.route;

    this.state = {
      data: [],
      modalAdd: false,
      modalAddProduct: false,
      product: [],
      product_selected: params.product_selected
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
    const { navigation, params } = this.props;
    try {
      const response = await axios.post("/purchase_request/list_product_cat/0");
      // this.formik.setFieldValue('stock', '1');
      console.warn(response.data.results.product);
      this.setState({
        product: response.data.results.product,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getProduct(id) {
    const { navigation, params } = this.props;
    let response;
    try {
      if (id == "semua") {
        response = await axios.post("/purchase_request/list_product_cat/0");
      } else {
        response = await axios.post("/purchase_request/list_product_cat/" + id);
      }
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
    route.params.onAddItem({
      product_selected: this.state.product_selected
    });
  }

  validateadd({
    category_product, sku, code, name, description, unit_id, in_stock,
    dimensi, part_number, for_machine, specification
  }) {
    const errors = {};

    if (!category_product) {
      errors.category_product = "Kategori Product tidak boleh kosong";
    } else {
      if (category_product == 3) {
        if (!dimensi) {
          errors.dimensi = "Dimensi tidak boleh kosong";
        }
        if (!part_number) {
          errors.part_number = "Part Number tidak boleh kosong";
        }
        if (!for_machine) {
          errors.for_machine = "For Machine tidak boleh kosong";
        }
        if (!specification) {
          errors.specification = "Specification tidak boleh kosong";
        }
      }
    }
    if (!sku) {
      errors.sku = "SKU tidak boleh kosong";
    }
    if (!code) {
      errors.code = "Kode Product tidak boleh kosong";
    }
    if (!name) {
      errors.name = "Nama Product harus dipilih";
    }
    // if (!description) {
    //   errors.description = "Deskripsi harus dipilih";
    // }
    if (!unit_id) {
      errors.unit_id = "Unit Product tidak boleh kosong";
    }
    if (!in_stock) {
      errors.in_stock = "In Stock Product tidak boleh kosong";
    }

    return errors;
  }

  async submitadd(values, actions, props) {
    const { navigation, showLoading, saveSession, route } = props;
    const { setSubmitting } = actions;
    const { params = {} } = props.route;

    setSubmitting(true);
    // showLoading(true);
    // console.warn(values);

    try {
      let formData = {
        "category_product": values.category_product,
        "sku": values.sku,
        "code": values.code,
        "name": values.name,
        "description": values.description,
        "unit_id": values.unit_id,
        "in_stock": values.in_stock,
        "dimensi": values.dimensi,
        "part_number": values.part_number,
        "for_machine": values.for_machine,
        "specification": values.specification,
      }

      console.warn(formData);
      const response = await axios.post("/purchase_request/add_product", formData, {
        headers: {
          accept: "multipart/form-data"
        }
      });
      const success = response.data.status;
      console.warn(response);

      if (success) {
        this.fetchData();
        this.setState({ modalAddProduct: false });
        Toast.show({
          type: 'success',
          text1: 'Berhasil',
          text2: "Berhasil Add Product",
          visibilityTime: 2000,
          position: 'bottom',
          bottomOffset: 180,
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
        this.formikadd.resetForm();
      }
    } catch (error) {
      console.warn(error);
      setSubmitting(false);
      showLoading(false);
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
                  Add Adjustment Item
                </Text>
              </View>
            </Pressable>
          </View>
          <Select
            style={{ margin: 16 }}
            onValueChange={(value) => {
              this.getProduct(value);
            }}>
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Pilih Product Category" />
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
                <SelectItem label={"Semua"} value={"semua"} />
                {params.product_category.map((item) => {
                  return (
                    <SelectItem label={item.name} value={item.id} />
                  )
                })}
              </SelectContent>
            </SelectPortal>
          </Select>
          <FlatList
            data={this.state.product}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  flexDirection: 'row', padding: 16, borderRadius: 10,
                  borderBottomWidth: 1, borderColor: '#bfc2c2', marginBottom: this.state.product.length - 1 == index ? 150 : 0,
                  backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <View style={{ flex: 0.7 }}>
                    <Text sx={glueAndroid.Global_textTitle}>
                      {item.name}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight} style={{ marginTop: 4 }}>
                      Code: {item.code}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}>
                      SKU: {item.sku}
                    </Text>
                  </View>

                  <View style={{ flex: 0.3 }}>
                    <Pressable
                      onPress={() => {
                        this.formik.setFieldValue('stock', item.stock.toString());
                        this.formik.setFieldValue('item_selected', item);
                        console.warn(item);
                        this.setState({ modalAdd: true });
                      }}>
                      {({ pressed }) => {
                        return (
                          <View style={{
                            flexDirection: 'row', padding: 12, borderRadius: 10, alignSelf: 'flex-end',
                            backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ color: 'white' }}>
                                Add
                              </Text>
                            </View>
                          </View>
                        )
                      }}
                    </Pressable>
                    {/* <NumericInput
                      onLimitReached={(isMax, msg) => console.warn(isMax, msg)}
                      value={this.state.value}
                      totalHeight={35}
                      editable={true}
                      minValue={0}
                      maxValue={item.stock}
                      valueType='real'
                      rounded
                      rightButtonBackgroundColor='#009BD4'
                      leftButtonBackgroundColor='#009BD4'
                      textStyle={{ fontWeight: 'bold' }}
                      iconStyle={{ color: 'white' }}
                      iconSize={24}
                      borderColor={'#009BD4'}
                      onChange={(value) => this.onChangeQty(value, item.stock, index)}
                      containerStyle={{
                        borderRadius: 10,
                      }}
                    /> */}
                  </View>
                </View>
              )
            }}>
          </FlatList>

          <Formik
            innerRef={form => (this.formik = form)}
            initialValues={{
              stock: "0",
              qty: "",
              item_selected: {
                product_unit: ''
              }
            }}
            validate={this.validate}
            onSubmit={(values, actions) => {
              this.setState({ product_selected: [...this.state.product_selected, values.item_selected] });
              this.setState({ modalAdd: false });
            }}
          >
            {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
              const isError = field => touched[field] && errors[field];
              return (
                <Actionsheet
                  isOpen={this.state.modalAdd}
                  onClose={() => {
                    this.setState({ modalAdd: false })
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
                          Adjustment Item
                        </Text>
                      </View>
                      <Pressable
                        key={"closemodal"}
                        onPress={() => {
                          this.setState({ modalAdd: false })
                        }}>
                        <X color="black" size={24} />
                      </Pressable>
                    </View>
                    <View style={{ padding: 16, paddingHorizontal: 24 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.4 }}>
                          <Text sx={glueAndroid.Global_textBaseBold}>
                            Nama Item
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}>
                            {values.item_selected.name}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 8 }}>
                            Code
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}>
                            {values.item_selected.code}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 8 }}>
                            SKU
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}>
                            {values.item_selected.sku}
                          </Text>
                        </View>
                        <View style={{ flex: 0.6 }}>
                          <Text sx={glueAndroid.Global_textBaseBold}>
                            Qty on Hand
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}>
                            {values.item_selected.stock} {values.item_selected.product_unit.name}
                          </Text>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 8 }}>
                            {/* {values.item_selected.name} */}
                            Deskripsi
                          </Text>
                          <Text sx={glueAndroid.Global_textBase}>
                            {values.item_selected.description}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', marginRight: 8 }}>
                        <FormField
                          widthbox={"100%"}
                          type="number"
                          isError={isError}
                          errorText={errors.qty}
                          defaultValue={values.qty}
                          fieldName="qty"
                          label="QTY"
                          helperText="Isi Quantity"
                          onChangeText={(text) => {
                            setFieldValue("item_selected.qty", text);
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ width: '100%' }}>
                      <Pressable
                        onPress={() => {
                          handleSubmit();
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
                                  Add
                                </Text>
                              </View>
                            </View>
                          )
                        }}
                      </Pressable>
                    </View>
                  </ActionsheetContent>
                </Actionsheet>
              )
            }}
          </Formik>

          <Modal
            isOpen={this.state.modalSelected}
            onClose={() => {
              this.setState({ modalSelected: false })
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
                      Items Requested
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalSelected: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                {this.state.product_selected.length == 0 ? (
                  <View style={{ marginTop: 30 }}>
                    <Text sx={glueAndroid.Global_textBaseBold}>
                      Item Kosong
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={this.state.product_selected}
                    showsVerticalScrollIndicator={false}
                    style={{
                      paddingTop: 20
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', padding: 16, borderRadius: 10,
                          borderBottomWidth: 1, borderColor: '#bfc2c2',
                          alignItems: 'center', justifyContent: 'space-between'
                        }}>
                          <View>
                            <Text sx={glueAndroid.Global_textBaseBold}>
                              {item.name}
                            </Text>
                            <Text sx={glueAndroid.Global_textLight}>
                              Code: {item.code}
                            </Text>
                          </View>
                          <Text sx={glueAndroid.Global_textBaseBold}>
                            {item.qty} {item.product_unit.name}
                          </Text>
                        </View>
                      )
                    }}>
                  </FlatList>
                )}
              </View>
            </ModalContent>
          </Modal>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  this.setState({ modalSelected: true });
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 8, marginRight: 6,
                      backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4' }}>
                        {this.state.product_selected.length} Items Adjustment
                      </Text>
                      <ChevronRight size={18} color='#009BD4' />
                    </View>
                  )
                }}
              </Pressable>
            </View>

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
        </Box>
      </>
    );
  }
}

AdjustmentStockDetailAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AdjustmentStockDetailAdd);