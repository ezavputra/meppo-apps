import React, { Component } from 'react';
import {
  StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, PermissionsAndroid,
  BackHandler, TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  Album, LogOutIcon, UserCircle, X, ArrowRightCircle,
  QrCodeIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationService from "../../../NavigationService";
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headHeight: 0,
      currentIndex: 5,
      slide: [],
      menu: [],
      dashboard_data: [],
      maxSlide: 0,
      modalStart: false,
      loadingSlide: true,
      loadingCat: true,
      loadingContent: true,
      showModal: false
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    this.fetchData();

    check(PERMISSIONS.ANDROID.CAMERA)
      .then(async (result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "Camera Permission",
                message: "We need location permission to use camera",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.warn("You can use camera");
            } else {
              console.warn("Camera denied");
            }
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        // …
      });
  }

  async fetchData() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    try {
      let response;
      if (me.role.name == 'Vendor') {
        response = await axios.get("/get-data-dashboard-vendor/" + me.user.vendor_id);
      } else {
        response = await axios.get("/get-data-dashboard/" + me.role.id);
        console.warn(response);
      }
      this.setState({
        dashboard_data: response.data
      });
    } catch (error) {
      //showLoading(false);
      console.error(error);
    }
  }

  list_menu(key, onPress, title) {
    return (
      <Pressable
        key={key}
        style={{
          marginVertical: 5
        }}
        onPress={onPress}>
        {({ pressed }) => {
          return (
            <View style={{
              flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
              backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center'
            }}>
              <Album size={24} color='#009BD4' />
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{ color: '#009BD4', width: '100%', marginLeft: 10 }}>
                {title}
              </Text>
            </View>
          )
        }}
      </Pressable>
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

  render() {
    const { params = {} } = this.props.route;
    const { navigation, me, accessToken, saveSettings } = this.props;

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

          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text sx={glueAndroid.Global_textTitle}
                style={{ width: '100%' }}>
                Halo, {me.name}
              </Text>
              <Text sx={glueAndroid.Global_textSub}
                style={{ width: '100%' }}>
                {me.role.name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{
                marginRight: 10
              }}
                onPress={() => {
                  // Toast.show({
                  //   type: 'warning',
                  //   text1: 'Warn',
                  //   text2: "QR in Development",
                  //   visibilityTime: 2000,
                  //   topOffset: 50,
                  //   // autoHide: false,
                  //   onPress: () => {
                  //     Toast.hide();
                  //   }
                  // })
                  const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'Home',
                        params: {
                          menu: params.menu
                        }
                      },
                      {
                        name: "QRScanner",
                        params: {
                          menu: params.menu
                        }
                      }
                    ],
                  });
                  navigation.dispatch(resetAction);
                }}>
                <QrCodeIcon size={24} color='black' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setState({ showModal: true });
              }}>
                <LogOutIcon size={24} color='black' />
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            isOpen={this.state.showModal}
            onClose={() => {
              this.setState({ showModal: false })
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={200} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <LogOutIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      LOGOUT
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    this.setState({ showModal: false });
                  }}>
                    <X size={24} color='black' />
                  </TouchableOpacity>
                </View>
                <Text sx={glueAndroid.Global_textTitle}
                  style={{ color: 'black', marginTop: 30 }}>
                  Yakin ingin logout dari aplikasi ?
                </Text>
                <View style={{ flexDirection: 'row', bottom: 0, position: 'absolute', padding: 16, alignSelf: 'center' }}>
                  <Pressable
                    onPress={() => {
                      this.setState({ showModal: false })
                    }}
                    style={{ flex: 0.5, marginRight: 10 }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                          backgroundColor: pressed ? '#81defc' : '#bdeeff', justifyContent: 'center'
                        }}>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#009BD4', marginLeft: 10 }}>
                            Batal
                          </Text>
                        </View>
                      )
                    }}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      NavigationService.logout(navigation)
                    }}
                    style={{ flex: 0.5 }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                          backgroundColor: pressed ? '#81defc' : 'transparent', justifyContent: 'center'
                        }}>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'red', marginLeft: 10 }}>
                            Logout
                          </Text>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
              </View>
            </ModalContent>
          </Modal>

          <View
            sx={{
              "@base": {
                width: "$full",
                height: "$48",
                // marginTop: '$48'
              },
              "@sm": {
                width: "$full",
                height: "$56",
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

            {me.role.name == 'Vendor' ? (
              <View style={{
                backgroundColor: '#ffe69c', height: '100%', paddingHorizontal: 30, flexDirection: 'row',
                justifyContent: 'space-between', paddingVertical: 20,
                borderRadius: 20, overflow: 'hidden', marginHorizontal: 20, marginBottom: 30
              }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text sx={glueAndroid.Global_textBaseBold}>List of All Products</Text>
                  <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 32, lineHeight: 40 }}>
                    {this.state.dashboard_data.total_waiting_rfq}
                  </Text>
                </View>
              </View>
            ) : (
              <CarouselPager
                ref={ref => this.carousel = ref}
                deltaDelay={10}
                animationDuration={400}
                pageStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 20
                }}
              >
                <View style={{
                  backgroundColor: '#ffe69c', height: '100%', paddingHorizontal: 30,
                  justifyContent: 'space-between', paddingVertical: 20,
                }}>
                  <View style={{ marginBottom: 20 }}>
                    <Text sx={glueAndroid.Global_textBaseBold}>Approval Reports</Text>
                    <Text sx={glueAndroid.Global_textLight}>Transaction to Approve</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>Purchase Request</Text>
                      <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 28, lineHeight: 40 }}>
                        {this.state.dashboard_data.total_purchase_request}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>RFQ</Text>
                      <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 28, lineHeight: 40 }}>
                        {this.state.dashboard_data.total_rfq}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>Quotation</Text>
                      <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 28, lineHeight: 40 }}>
                        {this.state.dashboard_data.total_quotation}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{
                  backgroundColor: '#ffe69c', height: '100%', paddingHorizontal: 30, flexDirection: 'row',
                  justifyContent: 'space-between', paddingVertical: 20
                }}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text sx={glueAndroid.Global_textBaseBold}>List of All Products</Text>
                    <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 32, lineHeight: 40 }}>
                      {this.state.dashboard_data.product_all}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                    <View style={{ flex: 0.5, alignItems: 'center', borderRightWidth: 1 }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>Active</Text>
                      <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 28, lineHeight: 40 }}>
                        {this.state.dashboard_data.product_active}
                      </Text>
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}>Archive</Text>
                      <Text sx={glueAndroid.Global_textBoldItalic} style={{ fontSize: 28, lineHeight: 40 }}>
                        {this.state.dashboard_data.product_archive}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    const resetAction = CommonActions.reset({
                      index: 1,
                      routes: [
                        {
                          name: 'Home',
                          params: {
                            menu: params.menu
                          }
                        },
                        {
                          name: "StockProductDashboard",
                          params: {
                            menu: params.menu
                          }
                        }
                      ],
                    });
                    navigation.dispatch(resetAction);
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        backgroundColor: '#ffe69c', height: '100%', paddingHorizontal: 30,
                        justifyContent: 'space-between', paddingVertical: 20
                      }}>
                        <View style={{ marginBottom: 10 }}>
                          <Text sx={glueAndroid.Global_textBaseBold}>Stock Products</Text>
                          <Text sx={glueAndroid.Global_textLight} style={{ marginBottom: 8 }}>The product will run out soon</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 3 }}>Tap untuk detail</Text>
                          <ArrowRightCircle size={24} color='black' style={{ marginLeft: 6 }} />
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </CarouselPager>
            )}
          </View>

          <ScrollView style={{ paddingHorizontal: 16 }}>
            {params.menu.map((item, index) => {
              return (
                item.children.length == 0 && item.parent.is_mobile != 0 ? (
                  this.list_menu(item.parent.name,
                    () => {
                      const resetAction = CommonActions.reset({
                        index: 1,
                        routes: [
                          {
                            name: 'Home',
                            params: {
                              menu: params.menu
                            }
                          },
                          {
                            name: item.parent.displayname,
                            params: {
                              menu: params.menu[index]
                            }
                          }
                        ],
                      });
                      navigation.dispatch(resetAction);
                    },
                    item.parent.displayname
                  )
                ) : (
                  <View>
                    {item.parent.is_mobile != 0 && (
                      <Text sx={glueAndroid.Global_textTitle}
                        style={{ marginVertical: 10 }}>
                        {item.parent.displayname}
                      </Text>
                    )}
                    {item.children.map((item2) => {
                      return (
                        item.parent.is_mobile != 0 && (
                          this.list_menu(item2.child.name,
                            () => {
                              const resetAction = CommonActions.reset({
                                index: 1,
                                routes: [
                                  {
                                    name: 'Home',
                                    params: {
                                      menu: params.menu
                                    }
                                  },
                                  {
                                    name: item2.child.route_mobile_name,
                                    params: {
                                      menu: item2.child
                                    }
                                  }
                                ],
                              });
                              navigation.dispatch(resetAction);
                            },
                            item2.child.displayname
                          )
                        )
                      )
                    })}
                  </View>
                )
              )
            })}
          </ScrollView>
        </Box >
      </>
    );
  }
}

Home.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);