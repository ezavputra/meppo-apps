import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler, RefreshControl, Linking } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { baseURLProd } from "../../config/app";
import { setSettings, setLoading } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, ScrollView, Pressable, Icon,
  Modal, ModalBackdrop, ModalContent, ModalBody, ModalHeader, ModalCloseButton,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent
} from "@gluestack-ui/themed";
import BottomTabs from "../../new-components/BottomTabs";
import {
  LogIn,
  Home,
  ChevronRight,
  XCircle,
  Bell,
  BellDot,
  ScrollText,
  Plus
} from "lucide-react-native";
import {
  headbgHome, logoheadHome, linearheadHome, bellHome, bellHomePressed,
  welcomeButtonHomeTitle, welcomeButtonHomeSubtitle, welcomeButtonHomeBg1,
  welcomeButtonHomeBg2, toastNotYetLoginText, loginButtonText, startPic,
  typeAnimationText
} from "../../config/strings";
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { TypeAnimation } from "react-native-type-animation";
import FastImage from 'react-native-fast-image';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Geolocation from "react-native-geolocation-service";
import Geocoder from 'react-native-geocoder';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const colors = [
  "#26292E",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

const bottomTabs = [
  {
    icon: Home,
    label: "Home",
  },
  {
    icon: ScrollText,
    label: "Orders",
  },
];

class HomeMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "Home",
      currentIndex: 5,
      slide: [],
      menu: [],
      maxSlide: 0,
      modalStart: false,
      loadingSlide: true,
      loadingCat: true,
      loadingContent: true,
      loadingCoin: true,
      backClickCount: 0,
      headHeight: 0,
      headColHeight: 0,
      typeText: null,
      actionsheet: false,
      bottomTabs: 0,
      dana_auth: null,
      coin: 0,
      isRefresh: false
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    if (typeAnimationText != null) {
      let textAnimate;
      let textAnimateArray = [];
      for (let index = 0; index < typeAnimationText.length; index++) {
        if (index == 0) {
          textAnimate = { text: typeAnimationText[index], typeSpeed: 1 };
        } else {
          textAnimate = {
            text: typeAnimationText[index], typeSpeed: 50,
            deletionSpeed: 50, delayBetweenSequence: 1000
          };
        }
        textAnimateArray.push(textAnimate);
      }
      this.setState({ typeText: textAnimateArray });
    }
    this.getPermissionLocation();
    this.fetchData();
    this._unsubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    // this._unsubscribe();
  }

  backPressed = () => {
    setTimeout(() => {
      this.setState({ backClickCount: 0 });
    }, 2000); // 2 seconds to tap second-time

    if (this.state.backClickCount === 0) {
      ToastAndroid.show("Tekan sekali lagi untuk keluar", ToastAndroid.SHORT);
      this.setState({ backClickCount: 1 });
    } else if (this.state.backClickCount === 1) {
      BackHandler.exitApp();
    }
    return true;
  }

  async fetchData() {
    const { me } = this.props;

    this.setState({
      loadingSlide: true,
      loadingCat: true,
      loadingContent: true,
      loadingCoin: true,
    });

    try {
      const response = await axios.post("/slide", {
        type: ["home", "tutorial"]
      });
      const { data: detail } = response.data;
      // console.warn(detail[1].length);
      this.setState({
        slide: detail[1],
        maxSlide: detail[1].length,
        loadingSlide: false
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.post("/check_coin", {
        user_id: me.customer.user_id
      });
      console.warn(response.data.data);
      this.setState({
        coin: response.data.data,
        loadingCoin: false,
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get("/categories/getSpecificMenu");
      const { data: menu } = response.data;
      this.setState({
        menu: menu[0].category,
        loadingCat: false,
        loadingContent: false
      });
    } catch (error) {
      //showLoading(false);
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

  getPermissionLocation() {
    check(Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({ location_permission: "unavailable" });
            console.warn('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            if (Platform.OS == 'ios') {
              request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                console.warn(result);
              });
            } else {
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                console.warn(result);
                this.setState({ location_permission: result });
              });
            }
            console.warn('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            this.setState({ location_permission: "limited" });
            console.warn('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            this.setState({ location_permission: "granted" });
            console.warn('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            this.setState({ location_permission: "blocked" });
            console.warn('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async category_act(item) {
    try {
      const { navigation, showLoading } = this.props;
      showLoading(true);
      const response = await axios.post("/orders", {
        filter: {
          categoryID: item.id,
          status_id: 0,
        },
      });
      const { data: menus } = response.data;
      console.warn(item.id);
      console.warn(menus.length);
      if (menus.length >= item.limit_order) {
        alert("Mohon Order " + item.limit_order + " diselesaikan dulu");
      } else {
        this.getPermissionLocation();
        if (this.state.location_permission != "granted") {
          console.warn("tes");
          showLoading(false);
          // this.setModalVisible(!this.state.modallocation);
        } else {
          Geolocation.getCurrentPosition(
            position => {
              var coord = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              Geocoder.geocodePosition(coord).then(async res => {
                showLoading(false);
                let locality = null;
                locality = res[0].subAdminArea != null ? res[0].subAdminArea : res[0].locality;
                console.warn(locality);
                const response = await axios.post("/checkcity", {
                  city: locality,
                  category_id: item.id
                });
                const { success: success, data: data } = response.data;
                // console.warn(data);
                if (success) {
                  showLoading(false);
                  navigation.navigate({
                    name: item.id != '008' ? 'ListOrder' : 'OrderMassage',
                    params: {
                      categoryID: item.id,
                      categoryName: item.name,
                      termCondition: item.term_condition,
                      contact_info: item.contact_info,
                      hourStart: item.hour_start,
                      hourEnd: item.hour_end,
                      distanceMax: item.distance_max,
                      cityName: locality,
                      city_id: data.id,
                      biaya_layanan: data.biaya_layanan,
                      outsideCity: false
                    }
                  });
                } else {
                  showLoading(false);
                  navigation.navigate({
                    name: 'OrderCityNotFound',
                    params: {
                      categoryID: item.id,
                      categoryName: item.name,
                      termCondition: item.term_condition,
                      contact_info: item.contact_info,
                      hourStart: item.hour_start,
                      hourEnd: item.hour_end,
                      distanceMax: item.distance_max,
                      cityName: locality,
                      biaya_layanan: null,
                      outsideCity: true
                    }
                  });
                }
              })
            },
            (error) => {
              showLoading(false);
              // See error code charts below.
              console.warn(error);
              // console.warn(error.code, error.message);
            },
            {
              enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
            }
          );
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  openPage(value) {
    this.setState({ actionsheet: true });
  }

  onRefreshHandler() {
    this.setState({ isRefresh: true });
    this.fetchData();
    this.setState({ isRefresh: false });
  }

  render() {
    const { navigation } = this.props;

    let show = 0;
    if (this.state.maxSlide > 1) {
      setInterval(() => {
        if (show == 5) {
          show = -1;
        }
        // this.carousel.goToPage(show + 1);
        show++;
      }, 5000);
    }

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
          <StatusBar
            backgroundColor={'transparent'}
            barStyle={"light-content"}
            translucent
          />
          <Box flex={1}>
            <View
              alignContent="center"
              position="absolute"
              // top={0}
              zIndex={999}
              w="100%"
              flex={1}
              flexDirection="column"
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                this.setState({ headHeight: height });
              }}
            >
              <ImageBackground
                resizeMode={'stretch'} // or cover
                style={{
                  flex: 1,
                  // backgroundColor: 'white'
                }}
                source={{ uri: baseURLProd + headbgHome }}
              >
                <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  sx={{
                    "@base": {
                      padding: 16
                    },
                    "@sm": {
                      padding: 30
                    },
                    "@md": {
                      padding: 30
                    },
                  }}>
                  <Image source={{ uri: baseURLProd + logoheadHome }}
                    alt='logo'
                    sx={{
                      "@base": {
                        width: "$40",
                        height: "$12",
                      },
                      "@sm": {
                        width: "$64",
                        height: "$20",
                      },
                      "@md": {
                        width: "$full",
                        height: "$32",
                      },
                    }}
                    resizeMode='stretch'
                  />
                  <Pressable
                    key={"bellnotif"}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    onPress={() => {
                      BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
                      navigation.navigate({
                        name: 'Login'
                      });
                    }}>
                    {({ pressed }) => {
                      return (
                        <Bell color={pressed ? bellHomePressed : bellHome} size={24} />
                      )
                    }}
                  </Pressable>
                </View>
              </ImageBackground>
              <LinearGradient
                colors={[linearheadHome, 'transparent']}
                // colors={['white', 'transparent']}
                style={{ flex: 1, paddingHorizontal: 16 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 10,
                  elevation: 3,
                  backgroundColor: 'white',
                  overflow: 'hidden'
                }}>
                  <Pressable
                    key={"HeadClick1"}
                    style={{ flex: 0.4 }}
                    onPress={() => {
                      console.warn("tes");
                    }}
                  >
                    {({ pressed }) => {
                      return (
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: pressed ? '#e6e6e6' : 'white',
                            padding: 16
                          }}
                          onLayout={(event) => {
                            const { x, y, width, height } = event.nativeEvent.layout;
                            this.setState({ headColHeight: height });
                          }}>
                          <View style={{
                            backgroundColor: '#009BD4',
                            width: 8,
                            borderRadius: 10
                          }}></View>
                          <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                          }}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}>
                              <Text sx={glueAndroid.Global_textBase}>Coin</Text>
                            </View>
                            <Skeleton
                              containerStyle={{
                                flex: 1, width: '100%'
                              }}
                              isLoading={this.state.loadingCoin}
                              animationType="pulse"
                              // duration={500}
                              layout={[
                                { key: '1', width: 60, height: 20 },
                              ]}
                            >
                              <Text
                                sx={{
                                  "@base": {
                                    fontFamily: "Poppins-SemiBold",
                                    fontSize: "$lg",
                                    marginTop: 4
                                  },
                                  "@sm": {
                                    fontFamily: "Poppins-SemiBold",
                                    fontSize: "$xl",
                                    lineHeight: 30
                                  },
                                  "@md": {
                                    fontFamily: "Poppins-SemiBold",
                                    fontSize: "$xl",
                                  },
                                }}>
                                {this.state.coin}
                              </Text>
                            </Skeleton>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <Pressable
                    key={"HeadClick2"}
                    style={{ flex: 0.6, borderLeftWidth: 1, borderColor: "#e6e6e6" }}
                    onPress={() => {
                      console.warn("tes");
                    }}
                  >
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row',
                          backgroundColor: pressed ? '#e6e6e6' : 'white',
                          padding: 16,
                          height: this.state.headColHeight == 0 ? null : this.state.headColHeight,
                          // justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <Text sx={glueAndroid.Global_textBase}>
                              Hubungkan Dengan Dana
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Image
                                source={require("./../../assets/img/dana_blue_bg.jpg")}
                                resizeMode='stretch'
                                style={{
                                  width: 60,
                                  height: 25,
                                  marginTop: 5,
                                  borderRadius: 10
                                }} />
                            </View>
                            {/* <Text sx={glueAndroid.Global_textBase}>
                              Hubungkan Dengan Dana
                            </Text> */}
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
            <ScrollView
              refreshControl={
                <RefreshControl
                  progressViewOffset={this.state.headHeight}
                  refreshing={this.state.isRefresh}
                  onRefresh={() => this.onRefreshHandler()}
                />
              }>
              <View
                style={{
                  marginTop: this.state.headHeight
                }}
                sx={{
                  "@base": {
                    height: "$48",
                  },
                  "@sm": {
                    height: "$80",
                  },
                  "@md": {
                    height: "$48",
                  },
                }}>

                <Skeleton
                  containerStyle={{
                    flex: 1, width: width
                  }}
                  isLoading={this.state.loadingSlide}
                  animationType="pulse"
                  // duration={500}
                  layout={[
                    { key: '1', width: '100%', height: '100%' },
                  ]}
                >
                  <View
                    sx={{
                      "@base": {
                        width: "$full",
                        height: "$48",
                        // marginTop: '$48'
                      },
                      "@sm": {
                        width: "$full",
                        height: "$80",
                        // marginTop: '$56'
                      },
                      "@md": {
                        width: "$full",
                        height: "$48",
                        // marginTop: '$48'
                      },
                    }}
                    style={{
                      paddingVertical: 10,
                    }}>
                    {this.state.slide.length > 1 ? (
                      // Multiple Item
                      <CarouselPager
                        ref={ref => this.carousel = ref}
                        deltaDelay={10}
                        animationDuration={400}
                        pageStyle={{
                          backgroundColor: '#fff',
                          borderRadius: 20,
                          overflow: 'hidden'
                        }}
                      >
                        {this.state.slide.map((item, index) => {
                          return (
                            <Pressable
                              key={"carousel" + index}
                              onPress={() => {
                                this.openLink(item.url)
                              }}>
                              <Image source={item.icon}
                                alt={'slide' + index}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode='stretch'
                              />
                            </Pressable>
                          )
                        })}
                      </CarouselPager>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 30,
                          borderRadius: 10
                        }}>
                        {/* <Text style={{ color: '#666', fontSize: 10, fontWeight: 'bold' }}>1</Text> */}
                      </View>
                    )}
                  </View>
                </Skeleton>
              </View>
              {/* </LinearGradient> */}
              <View
                sx={{
                  "@base": {
                    paddingBottom: '$24'
                  },
                  "@sm": {
                    paddingBottom: '$24'
                  },
                  "@md": {
                    paddingBottom: '$56'
                  },
                }}
              >
                <Skeleton
                  containerStyle={{
                    flex: 1, width: width,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                  isLoading={this.state.loadingCat}
                  animationType="pulse"
                  // duration={500}
                  layout={[
                    { key: '1', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '2', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '3', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '4', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '5', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '6', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '7', width: '20%', height: width * 20 / 100, margin: 8 },
                    { key: '8', width: '20%', height: width * 20 / 100, margin: 8 }
                  ]}
                >
                  <View style={{ padding: 8 }}>
                    <View style={{
                      alignSelf: 'flex-start',
                      padding: 8,
                    }}>
                      <TypeAnimation
                        sequence={this.state.typeText}
                        loop
                        cursor={false}
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: "white",
                          fontSize: 18,
                          paddingVertical: 2,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          backgroundColor: '#009BD4',
                        }}
                      />
                    </View>
                    <View style={{
                      flexDirection: 'row', flexWrap: "wrap",
                      paddingHorizontal: 16
                    }}>
                      {this.state.menu.map((item, index) => {
                        return (
                          <Pressable
                            key={"menu" + index}
                            style={{
                              borderRadius: 10,
                              width: '25%'
                            }}
                            onPress={() => {
                              BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
                              this.category_act(item)
                            }}>
                            {({ pressed }) => {
                              return (
                                <View style={{
                                  flex: 1,
                                  flexDirection: 'column',
                                  padding: 8,
                                  alignItems: 'center',
                                  backgroundColor: pressed ? '#d0dfea' : '#fff',
                                  borderRadius: 10
                                }}
                                  sx={{
                                    "@base": {
                                      marginBottom: 0
                                    },
                                    "@sm": {
                                      marginBottom: 20
                                    },
                                    "@md": {
                                      marginBottom: 20
                                    },
                                  }}>
                                  <FastImage
                                    style={{ width: 45, height: 45, marginBottom: 10 }}
                                    source={{
                                      uri: item.icon,
                                      priority: FastImage.priority.high
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  />
                                  <Text sx={glueAndroid.Global_textBaseBold}>
                                    {item.name}
                                  </Text>
                                </View>
                              )
                            }}
                          </Pressable>
                        )
                      })}
                    </View>
                  </View>
                </Skeleton>

                <Skeleton
                  containerStyle={{ flex: 1, width: width }}
                  isLoading={this.state.loadingContent}
                  animationType="pulse"
                  layout={[
                    { key: '1', width: '100%', height: 200, marginVertical: 8 },
                    { key: '2', width: '100%', height: 200, marginVertical: 8 },
                    { key: '3', width: '100%', height: 200, marginVertical: 8 },
                    { key: '4', width: '100%', height: 200, marginVertical: 8 },
                    { key: '5', width: '100%', height: 200, marginVertical: 8 }
                  ]}
                >
                  <Section
                    id="slide1"
                    seemore={() => {
                      BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
                      navigation.navigate({
                        name: 'SeeMoreContent',
                        params: {
                          items: this.state.slide,
                          title: "Take A Look",
                          subtitle: "Solution for your every need",
                          tag: "Sponsored",
                          imgHead: this.state.slide.length > 1 ? this.state.slide[3].icon : null
                        }
                      });
                    }}
                    direction="row"
                    items={this.state.slide}
                    color={['#124e78', '#124e78']} //gradient
                    textColor="light"
                    widthImage={["$56", "$80", "56"]} //base, sm, md
                    heightImage={["$32", "$48", "32"]} //base, sm, md
                    style={{ flex: 1, paddingVertical: 10 }}
                    title="Take A Look"
                    subtitle="Solution for your every need"
                    tag="Sponsored"
                    imgHead={this.state.slide.length > 1 ? this.state.slide[3].icon : null}
                  // imgBg={this.state.slide[1].icon}
                  />
                  <Section
                    id="slide2"
                    direction="row"
                    items={this.state.slide}
                    color={['#124e78', '#124e78']} //gradient
                    textColor="light"
                    widthImage={["$80", "$80", "64"]} //base, sm, md
                    heightImage={["$32", "$48", "32"]} //base, sm, md
                    style={{ flex: 1, paddingVertical: 10 }}
                  // title="Take A Look"
                  // subtitle="Solution for your every need"
                  // tag="Sponsored"
                  // imgBg={this.state.slide.length > 1 ? this.state.slide[3].icon : null}
                  />
                  <Section
                    id="slide3"
                    direction="row"
                    items={this.state.slide}
                    color={['white', 'white']}
                    textColor="dark"
                    widthImage={["$32", "$56", "32"]}
                    heightImage={["$32", "$56", "32"]}
                    style={{ flex: 1, paddingVertical: 10 }}
                    title="Cara Order PanggilTukang"
                  />
                  <Section
                    id="slide4"
                    direction="column"
                    category="article"
                    items={this.state.slide}
                    color={['white', 'white']}
                    textColor="dark"
                    widthImage={["$full", "$full", "full"]}
                    heightImage={["$48", "$80", "48"]}
                    style={{ flex: 1, paddingVertical: 10 }}
                    title="Info PanggilTukang"
                  />
                  {/* <Section
                    direction="row"
                    category="article"
                    items={this.state.slide}
                    color={['white', 'white']}
                    textColor="dark"
                    widthImage={["$full", "$full", "full"]}
                    heightImage={["$48", "$80", "48"]}
                    style={{ flex: 1, paddingVertical: 10 }}
                    title="Info PanggilTukang"
                  /> */}
                  <Section
                    id="slide5"
                    direction="column"
                    items={this.state.slide}
                    color={['white', 'white']}
                    textColor="dark"
                    widthImage={["$full", "$full", "full"]}
                    heightImage={["$48", "$80", "48"]}
                    style={{ flex: 1, paddingVertical: 10 }}
                    title="Info PanggilTukang"
                  />
                </Skeleton>

              </View>
            </ScrollView>

            <Modal
              isOpen={this.state.modalStart}
              onClose={() => {
                this.setState({ modalStart: false })
              }}
            >
              <ModalBackdrop />
              <ModalHeader>
                <View flex={1} flexDirection='row' justifyContent='space-between'>
                  <View></View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalStart: false })
                    }}>
                    <XCircle color="white" size={24} />
                  </Pressable>
                </View>
              </ModalHeader>
              <ModalContent>
                {this.state.slide.length > 1 && (
                  <View w={'100%'} h={400}>
                    <Image source={{ uri: baseURLProd + startPic }}
                      alt={'popup'}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='stretch'
                    />
                  </View>
                )}
              </ModalContent>
            </Modal>

            <Actionsheet
              isOpen={this.state.actionsheet}
              // isOpen={true}
              onClose={() => {
                this.setState({ actionsheet: false, activePage: "Home" })
              }}
              style={{
                zIndex: -30
              }}>
              <ActionsheetBackdrop />
              <ActionsheetContent w="$full" zIndex={-1}
                padding={0}
                sx={{
                  "@base": {
                    height: height
                  },
                  "@sm": {
                    height: height - (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)
                  },
                  "@md": {
                    height: height - (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)
                  },
                }}>
                <ActionsheetDragIndicatorWrapper borderRadius={0}>
                  <ActionsheetDragIndicator />
                  <ScrollView
                    w="$full"
                    h={height -
                      (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)}>
                    <View style={{ padding: 16 }}>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                      <Text>Tes</Text>
                    </View>
                  </ScrollView>
                </ActionsheetDragIndicatorWrapper>
              </ActionsheetContent>
            </Actionsheet>
          </Box>
        </Box>
      </>
    );
  }
}

HomeMain.propTypes = {
  saveSettings: PropTypes.func,
  showLoading: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken, stringSet }) => ({
  accessToken,
  me: userSession,
  stringSet
});

const mapDispatchToProps = (dispatch) => ({
  saveSession: (user) => dispatch(setUserSession(user)),
  saveAccessToken: (token) => dispatch(setAccessToken(token)),
  saveSettings: (user) => dispatch(setSettings(user)),
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeMain);