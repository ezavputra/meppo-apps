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
  PlusIcon,
  Download,
  EyeIcon,
  FileEdit
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

class VendorRequestQuotationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      showModal: false,
      product_selected: []
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
    const { params = {} } = this.props.route;

    try {
      const response = await axios.post("/request_quotation_vendor/show/" + params.item.id);
      this.setState({
        data: response.data.results,
        filtered_data: response.data.results,
      });

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
                  Detail RFQ
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ padding: 16 }}>
            <View style={{ marginBottom: 8 }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%', marginBottom: 4 }}>
                No. RFQ
              </Text>
              <Text sx={glueAndroid.Global_textBase}
                style={{ width: '100%', marginBottom: 4 }}>
                {params.item.code}
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ width: '100%', marginBottom: 4 }}>
                Request Date
              </Text>
              <Text sx={glueAndroid.Global_textBase}
                style={{ width: '100%', marginBottom: 4 }}>
                {params.item.date}
              </Text>
            </View>
          </View>

          <FlatList
            data={this.state.filtered_data.detail}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              item.selected = 0;
              return (
                <View style={{
                  flex: 1, flexDirection: 'column',
                  marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black',
                  marginBottom: index + 1 == this.state.filtered_data.detail.length ? 200 : 0,
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
                      <View style={{ flex: 1, flexDirection: 'column' }}>
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
                      </View>
                    </View>

                    <Pressable
                      onPress={() => {
                        item.selected = 1;
                        this.setState({ product_selected: [...this.state.product_selected, item] });
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
                                {item.selected == 0 ? "Tambah" : "Ditambahkan"}
                              </Text>
                            </View>
                          </View>
                        )
                      }}
                    </Pressable>
                  </View>
                </View>
              )
            }}>
          </FlatList>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%',
            backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                // navigation.navigate({
                //   name: 'PurchaseRequestDetailAdd',
                //   params: {
                //     onAddItem: this.onAddItem,
                //     product_category: this.state.product_category,
                //     unit: this.state.unit,
                //     product_selected: this.state.product_selected
                //   }
                // })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      {this.state.product_selected.length + " Items Selected"}
                    </Text>
                    <ChevronRight size={18} color='#009BD4' />
                  </View>
                )
              }}
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate({
                  name: 'GenerateQuotationV2',
                  params: {
                    item: params.item,
                    item_selected: this.state.product_selected
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

        </Box>
      </>
    );
  }
}

VendorRequestQuotationView.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(VendorRequestQuotationView);