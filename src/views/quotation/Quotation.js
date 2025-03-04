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
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, EyeIcon,
  Download,
  TruckIcon
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

class Quotation extends Component {
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
      delivery_date: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: [],
      showModal: false,
      index_selected: 0,
      item_selected: null
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
    const { navigation, me, accessToken, saveSettings } = this.props;

    try {
      let vendor = {
        user_id: me.id
      };
      const response = await axios.post("/quotation_vendor", vendor);
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

  render() {
    const { navigation } = this.props;
    const { params = {} } = this.props.route;
    let no_doc = "";
    let awb = "";
    let payment_note = "";

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
                  Quotation
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              this.setState({ showModal: true })
            }}>
            {({ pressed }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                  backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <SearchIcon size={18} color='#009BD4' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4', marginLeft: 10 }}>
                      Search
                    </Text>
                  </View>
                  <ChevronRight size={18} color='#009BD4' />
                </View>
              )
            }}
          </Pressable>

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
                    <SearchIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Search Filter
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
                  <FormField
                    type="text"
                    fieldName="No. Document"
                    label="No. Document"
                    onChangeText={(text) => {
                      no_doc = text;
                    }}
                  />
                </ScrollView>
                <Pressable
                  onPress={() => {
                    let filtered;
                    filtered = this.state.data.filter(item =>
                      item.code.toLowerCase().includes(no_doc.toLowerCase()),
                    );
                    this.setState({
                      filtered_data: filtered,
                      showModal: false
                    })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#81defc' : '#bdeeff', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <SearchIcon size={18} color='#009BD4' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#009BD4', marginLeft: 10 }}>
                            Search
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

          <FlatList
            data={this.state.filtered_data}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <View>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%', marginBottom: 5 }}>
                        {item.reference_no}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%' }}>
                        Total: {"\n"}
                        <Text sx={glueAndroid.Global_textBase}
                          style={{ width: '100%' }}>
                          {item.total_amount}
                        </Text>
                      </Text>
                      <View style={{ marginTop: 4 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Status:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.document_status.name == "Receipt" ? "Closed" :
                            item.document_status.name == 'Approved Director' ? 'Approve' :
                              item.document_status.name == 'Rejected Director' ? 'Reject' : item.document_status.name}
                        </Text>
                      </View>
                      <View style={{ marginTop: 6 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Payment:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.payment_status == null ? "Proccess" : item.payment_status.name}
                        </Text>
                      </View>
                      <View style={{ marginTop: 6 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Delivery:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.delivery_status == null ? "Pending" : item.delivery_status.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Pressable
                      // key={"materialreq" + index}
                      style={{
                        marginVertical: 5, marginRight: 20
                      }}
                      onPress={async () => {
                        navigation.navigate({
                          name: 'QuotationDetail',
                          params: {
                            item: item
                          }
                        });
                      }}>
                      {({ pressed }) => {
                        return (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <EyeIcon size={20} color='black' />
                          </View>
                        )
                      }}
                    </Pressable>
                    {item.document_status_id == '56' && item.delivery_status_id == null && (
                      <Pressable
                        // key={"materialreq" + index}
                        style={{
                          marginVertical: 5
                        }}
                        onPress={async () => {
                          navigation.navigate({
                            name: 'QuotationDelivery',
                            params: {
                              onSuccessAdd: this.onSuccessAdd,
                              item: item,
                            }
                          });
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <TruckIcon size={20} color='black' />
                            </View>
                          )
                        }}
                      </Pressable>
                    )}
                  </View>
                </View>
              )
            }}>
          </FlatList>
        </Box>
      </>
    );
  }
}

Quotation.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Quotation);