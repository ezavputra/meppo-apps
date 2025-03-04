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
  Download
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

class RequestQuotationDetail extends Component {
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
    const { params = {} } = this.props.route;
    try {
      const response = await axios.post("/request_quotation/" + params.item.id);
      console.warn(response.data.results.rfq_details);
      this.setState({
        filtered_data: response.data.results.rfq_details,
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
        });
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

  onSuccessAdd = async (data) => {
    this.fetchData();
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
                <Text sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 18, lineHeight: 32
                }}>
                  {params.item.code}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ marginHorizontal: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ marginRight: 8 }}>
                Request Date :
              </Text>
              <Text sx={glueAndroid.Global_textBase}>
                {params.item.request_date}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Text sx={glueAndroid.Global_textBaseBold}>
              Items Detail
            </Text>
          </View>

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
                  marginBottom: index + 1 == this.state.filtered_data.length ? 100 : 0
                }}>
                  <View>
                    <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%' }}>
                        {item.product.name}
                      </Text>
                      <Text sx={glueAndroid.Global_textLight}
                        style={{ width: '100%' }}>
                        {item.purchase_request.code}
                      </Text>
                      <Text sx={glueAndroid.Global_textLightItalic}
                        style={{ width: '100%', marginVertical: 8 }}>
                        Req Date: {item.effective_date}
                      </Text>
                    </View>
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

RequestQuotationDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestQuotationDetail);