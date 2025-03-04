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
  Download, EyeIcon, FileTextIcon,
  FilterIcon,
  TrashIcon,
  SaveIcon,
  CheckIcon
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

class CurationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      quotation: [],
      showModal: false,
      modalAddPR: false,
      grand_total: 0,
      modalRevisi: false,
      mode: "",
      reason: ''
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
      const response = await axios.post("/curation/" + params.item.id);
      // console.warn(params);
      this.setState({
        grand_total: response.data.results.data.total_amount,
        filtered_data: response.data.results.curationItem,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.setState({ filtered_data: data.filtered_data });
  }

  async sendApprove(mode) {
    const { navigation, me, accessToken, saveSettings, route } = this.props;
    const { params = {} } = this.props.route;

    try {
      // console.warn(me);
      let parameter = {
        reason: this.state.reason,
        user_id: me.id
      };

      if (mode == 'Revisi') {
        response = await axios.post("/curation/revision/" + params.item.id, parameter, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      if (mode == 'Reject') {
        response = await axios.post("/curation/reject/" + params.item.id, parameter, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      if (mode == 'Approve') {
        response = await axios.post("/curation/approve/" + params.item.id, parameter, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }

      const success = response.data.status;
      console.warn(response.data);
      if (success) {
        navigation.goBack();
        route.params.onSuccessAdd();
      }
    } catch (error) {
      console.error(error);
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
                <Text sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Curation Detail
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
                </View>
              )
            }}>
          </FlatList>

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
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={{ flex: 0.5 }}
                onPress={async () => {
                  this.setState({
                    modalRevisi: true,
                    mode: 'Reject'
                  });
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#306fe3' : 'red', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: 'white' }}>
                          Reject
                        </Text>
                      </View>
                    </View>
                  )
                }}
              </Pressable>
              <Pressable
                style={{ flex: 0.5 }}
                onPress={async () => {
                  this.setState({
                    modalRevisi: true,
                    mode: 'Revisi'
                  });
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#fadc70' : '#f5ce42', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: 'black' }}>
                          Revisi
                        </Text>
                      </View>
                    </View>
                  )
                }}
              </Pressable>
            </View>
            <Pressable
              onPress={async () => {
                this.setState({ modalApprove: true })
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
                        Approve
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>

          <Modal
            isOpen={this.state.modalApprove}
            onClose={() => {
              this.setState({
                modalApprove: false,
                reason: ''
              })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={300} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <FileTextIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Approve Curation
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({
                        modalApprove: false,
                        reason: ''
                      })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginTop: 10 }}>
                      Approve item curation ini ?
                    </Text>
                  </View>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    this.sendApprove("Approve");
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#63b879' : '#399150', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <CheckIcon size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Approve
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={this.state.modalRevisi}
            onClose={() => {
              this.setState({
                modalRevisi: false,
                reason: ''
              })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={300} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <FileTextIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      {this.state.mode} Curation
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({
                        modalApprove: false,
                        reason: ''
                      })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginTop: 10 }}>
                      {this.state.mode} item curation ini ?
                    </Text>
                    <FormField
                      type="textarea"
                      defaultValue={""}
                      fieldName="reason"
                      label="Reason"
                      helperText="Isi Reason"
                      onChangeText={(text) => {
                        let reason = text;
                        this.setState({ reason: reason });
                      }}
                    />
                  </View>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    this.sendApprove(this.state.mode);
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#63b879' : '#399150', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <SaveIcon size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            {this.state.mode}
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>
        </Box>
      </>
    );
  }
}

CurationDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CurationDetail);