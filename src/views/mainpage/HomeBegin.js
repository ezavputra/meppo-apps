import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { baseURLProd } from "../../config/app";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, ScrollView, Pressable, Icon,
  Modal, ModalBackdrop, ModalContent, ModalBody, ModalHeader, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  LogIn,
  Home,
  ChevronRight,
  XCircle,
  Bell,
  BellDot,
  ScrollText
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
    icon: LogIn,
    label: "Login",
  },
  // {
  //   icon: Plus,
  //   label: "Listing",
  // },
];

class HomeBegin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "Home",
      currentIndex: 5,
      slide: [],
      menu: [],
      maxSlide: 0,
      modalStart: true,
      loadingSlide: true,
      loadingCat: true,
      loadingContent: true,
      backClickCount: 0,
      headHeight: 0,
      typeText: null
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
    try {
      const response = await axios.post("/slide", {
        type: ["home", "tutorial"]
      });
      const { data: detail } = response.data;
      console.warn(detail[1].length);
      this.setState({
        slide: detail[1],
        maxSlide: detail[1].length,
        loadingSlide: false,
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
            barStyle="light-content"
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
                    key={"bellnotification"}
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
                <Pressable
                  key={"login1"}
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
                      <LinearGradient
                        colors={[
                          pressed ? welcomeButtonHomeBg1[1] : welcomeButtonHomeBg1[0],
                          pressed ? welcomeButtonHomeBg2[1] : welcomeButtonHomeBg2[0]
                        ]}
                        style={{
                          flex: 1,
                          padding: 16,
                          borderRadius: 10,
                          elevation: 3
                        }}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <View>
                            <Text
                              sx={glueAndroid.Global_textBaseBold}
                              style={{
                                color: '#fff'
                              }}>
                              {welcomeButtonHomeTitle}
                            </Text>
                            <Text sx={glueAndroid.Global_textBase}
                              style={{
                                color: '#fff'
                              }}>
                              {welcomeButtonHomeSubtitle}
                            </Text>
                          </View>
                          <ChevronRight color="white" size={24} />
                        </View>
                      </LinearGradient>
                    )
                  }}
                </Pressable>
              </LinearGradient>
            </View>
            <ScrollView>
              {/* <LinearGradient
                colors={['#224475', 'white']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              > */}
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
                    padding: 8,
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
                  <View>
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
                              Toast.show({
                                type: 'base',
                                text1: toastNotYetLoginText[0],
                                text2: toastNotYetLoginText[1] + item.name,
                                visibilityTime: 2000,
                                // autoHide: false,
                                position: 'bottom',
                                bottomOffset: 100,
                                onPress: () => {
                                  Toast.hide();
                                }
                                // props: {
                                //   iconHead:
                                //     <View
                                //       style={{
                                //         backgroundColor: '#009BD4',
                                //         justifyContent: 'center',
                                //         padding: 12,
                                //         borderRadius: 10
                                //       }}>
                                //       <ScrollText
                                //         color='white'
                                //         size={width <= 480 ? 28 : 40} />
                                //     </View>,
                                //   rightButton:
                                //     <ChevronRight color='black' size={width <= 480 ? 28 : 40} />
                                // },
                              });
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

            <View
              alignContent="center"
              position="absolute"
              backgroundColor="transparent"
              bottom={0}
              w="100%"
              flexDirection="row"
              sx={{
                "@base": {
                  padding: 20
                },
                "@sm": {
                  padding: 30
                },
                "@md": {
                  padding: 30
                },
              }}
            >
              <Pressable
                key={"login2"}
                style={{
                  borderRadius: 10,
                  width: '100%',
                  elevation: 3
                }}
                onPress={() => {
                  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
                  navigation.navigate({
                    name: 'Login'
                  });
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flex: 1,
                      flexDirection: 'column',
                      padding: 8,
                      alignItems: 'center',
                      backgroundColor: pressed ? '#d0dfea' : '#fff',
                      borderRadius: 10,
                      backgroundColor: pressed ? '#d0dfea' : 'white'
                    }}>
                      <LogIn color="black" size={24} />
                      <Text sx={glueAndroid.Global_textBaseBold}>
                        {loginButtonText}
                      </Text>
                    </View>
                  )
                }}
              </Pressable>
            </View>
            {/* <BottomTabs
              bottomTabs={bottomTabs}
              active={this.state.activePage}
              onSelect={(value) => this.setState({ activePage: value })}
            /> */}
            <Modal
              isOpen={this.state.modalStart}
              onClose={() => {
                this.setState({ modalStart: false })
              }}
            // finalFocusRef={ref}
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
          </Box>

          {/* <Box
            h={120}
            backgroundColor='transparent'
            alignItems="center"
            w="100%"
            sx={{
              "@md": {
                display: "none",
              },
              _dark: { borderColor: "$borderDark900" },
            }}
          >
            <BottomTabs
              bottomTabs={bottomTabs}
              active={this.state.activePage}
              onSelect={(value) => this.setState({ activePage: value })}
            />
          </Box> */}
        </Box >
        {/* )} */}
      </>
    );
  }
}

HomeBegin.propTypes = {
  saveSettings: PropTypes.func,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeBegin);