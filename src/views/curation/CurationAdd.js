import React, { Component } from 'react';
import {
  StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { baseURL } from "../../config/app";
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, Heading, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, Cog, ChevronUpIcon, ChevronDownIcon,
  Download, EyeIcon,
  FilterIcon,
  TrashIcon,
  SaveIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";
// import ReactNativeBlobUtil from 'react-native-blob-util';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class CurationAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      quotation: [],
      showModal: false,
      modalAddPR: false,
      grand_total: 0
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
      const response = await axios.post("/curationrfq/" + params.item.id);
      console.warn(response.data.results);
      this.setState({
        data: response.data.results,
        quotation: response.data.results.quotation,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.setState({ filtered_data: data.filtered_data });
  }

  render() {
    const { navigation } = this.props;
    const { params = {} } = this.props.route;
    let header = "";

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
                  Curation Add
                </Text>
              </View>
            </Pressable>
          </View>

          <Text sx={glueAndroid.Global_textBaseBold}
            style={{ width: '100%', textAlign: 'center' }}>
            Quotation Item
          </Text>

          <FlatList
            data={this.state.filtered_data}
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
                  borderWidth: 1, borderColor: 'black',
                  marginBottom: index + 1 == this.state.filtered_data.length ? 100 : 0,
                  // backgroundColor: pressed ? '#bdeeff' : '#fff',
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%' }}>
                      {item.item_name == null ? item.product.name : item.item_name}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}
                      style={{ width: '100%', marginBottom: 4 }}>
                      {item.qty_request} X Rp. {item.price}
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Type : {" "}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.type}
                      </Text>
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Disc. {item.discount == 0 ? '0' : item.discount + '%'}
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Subtotal : {" Rp. "}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.subtotal}
                      </Text>
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Warranty : {item.warranty} Week
                    </Text>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ width: '100%', marginBottom: 4 }}>
                      Estimasi Delivery : {"\n"}
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.estimation_delivery}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      var array = [...this.state.filtered_data]; // make a separate copy of the array
                      if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ filtered_data: array });
                      }
                      this.setState({ grand_total: this.state.grand_total - item.subtotal });
                    }}>
                    <View>
                      <TrashIcon size={28} color='black' />
                    </View>
                  </TouchableOpacity>
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
                    Daftar Quotation
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
                data={this.state.quotation}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  height: '80%',
                  backgroundColor: '#fff',
                  paddingTop: 10,
                }}
                renderItem={({ item, index }) => {
                  let vendor = item.vendor;
                  return (
                    <View style={{
                      marginHorizontal: 16,
                      marginBottom: index + 1 == this.state.quotation.length ? 20 : 0
                    }}>
                      {vendor.id != header && (
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%', marginBottom: 4, marginTop: 10 }}>
                          Quotation {index + 1} By {vendor.name}
                        </Text>
                      )}
                      {item.quotation_details.map((item, index) => {
                        return (
                          <Pressable
                            key={"quotation_details" + index}
                            style={{
                              marginVertical: 5,
                              marginBottom: 5
                            }}
                            onPress={() => {
                              item.vendor_id = vendor.id;
                              this.state.filtered_data.push(item);
                              this.setState({ grand_total: this.state.grand_total + item.subtotal });
                              this.setState({ refresh: !this.state.refresh });
                              // this.onAddItem(item)
                            }}>
                            {({ pressed }) => {
                              return (
                                <View style={{
                                  flexDirection: 'row', marginVertical: 4, padding: 16, borderRadius: 10,
                                  borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                                  alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                  <View>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%' }}>
                                      {item.item_name == null ? item.product.name : item.item_name}
                                    </Text>
                                    <Text sx={glueAndroid.Global_textLight}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      {item.qty_request} X Rp. {item.price}
                                    </Text>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      Type : {" "}
                                      <Text sx={glueAndroid.Global_textLight}
                                        style={{ width: '100%' }}>
                                        {item.type}
                                      </Text>
                                    </Text>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      Disc. {item.discount == 0 ? '0' : item.discount + '%'}
                                    </Text>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      Subtotal : {" Rp. "}
                                      <Text sx={glueAndroid.Global_textLight}
                                        style={{ width: '100%' }}>
                                        {item.subtotal}
                                      </Text>
                                    </Text>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      Warranty : {item.warranty} Week
                                    </Text>
                                    <Text sx={glueAndroid.Global_textBaseBold}
                                      style={{ width: '100%', marginBottom: 4 }}>
                                      Estimasi Delivery : {"\n"}
                                      <Text sx={glueAndroid.Global_textLight}
                                        style={{ width: '100%' }}>
                                        {item.estimation_delivery}
                                      </Text>
                                    </Text>
                                  </View>
                                  <View>
                                    <PlusIcon size={28} color='black' />
                                  </View>
                                </View>
                              )
                            }}
                          </Pressable>
                        )
                      })}
                    </View>
                  )
                  header = item_quotation.vendor.id;
                }}>
              </FlatList>
            </ActionsheetContent>
          </Actionsheet>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%'
          }}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16,
              borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 8, marginBottom: 4
            }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{}}>
                Grand Total
              </Text>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{}}>
                Rp. {this.state.grand_total}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                this.setState({ modalAddPR: true });
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <PlusIcon size={18} color='#009BD4' />
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4', marginLeft: 10 }}>
                        Pilih Item Quotation
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
            <Pressable
              onPress={async () => {
                const { navigation, me, accessToken, saveSettings, route } = this.props;

                if (this.state.filtered_data.length == 0) {
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
                  let formData = {
                    "rfq_id": this.state.data.rfq.id,
                    "reference_no": this.state.data.rfq.code,
                    "quotation_item": this.state.filtered_data,
                    "user_id": me.id
                  }

                  console.warn(formData);
                  const response = await axios.post("/curation/save", formData, {
                    headers: {
                      accept: "multipart/form-data"
                    }
                  });
                  const success = response.data.status;
                  console.warn(response);

                  if (success) {
                    navigation.goBack();
                    route.params.onSuccessAdd();
                  }
                }
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                    backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <SaveIcon size={18} color='white' />
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: 'white', marginLeft: 10 }}>
                        Submit Curation
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

CurationAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CurationAdd);