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
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class GoodReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      showModal: false
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
    try {
      const response = await axios.post("/good_receipt");
      console.warn(response.data.results);
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
    const { navigation, me } = this.props;
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
                <Text sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Purchase Order
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
                <Pressable
                  key={"materialreq" + index}
                  style={{
                    marginVertical: 5,
                    marginBottom: index + 1 == this.state.filtered_data.length ? 100 : 0
                  }}
                  onPress={() => {
                    navigation.navigate({
                      name: 'GoodReceiptDetail',
                      params: {
                        item: item,
                      }
                    });
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                        borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <View>
                          <View>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ width: '100%' }}>
                              {item.code}
                            </Text>
                            <Text sx={glueAndroid.Global_textLightItalic}
                              style={{ width: '100%', marginBottom: 5 }}>
                              Receipt Date : {item.receipt_date}
                            </Text>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ width: '100%' }}>
                              Vehicle Number : {"\n"}
                              <Text sx={glueAndroid.Global_textLight}
                                style={{ width: '100%' }}>
                                {item.vehincle_number}
                              </Text>
                            </Text>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ width: '100%' }}>
                              Status : {"\n"}
                              <Text sx={glueAndroid.Global_textLight}
                                style={{ width: '100%' }}>
                                {item.document_status.name}
                              </Text>
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <ChevronRight size={24} color='black' />
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )
            }}>
          </FlatList>

          {/* {me.role.name == "En" && ( */}
          <View style={{
            position: 'absolute', bottom: 0, width: '100%'
          }}>
            <Pressable
              onPress={() => {
                navigation.navigate({
                  name: 'GoodReceiptAdd',
                  params: {
                    onSuccessAdd: this.onSuccessAdd,
                    mode: 'create'
                  }
                });
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                    backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <PlusIcon size={18} color='white' />
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: 'white', marginLeft: 10 }}>
                        Add Good Receipt
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>
          {/* )} */}

        </Box>
      </>
    );
  }
}

GoodReceipt.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(GoodReceipt);