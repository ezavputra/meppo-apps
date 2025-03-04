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
  Box, Image, Text, View, Pressable, Icon, FlatList
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ArrowLeft,
} from "lucide-react-native";
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class SeeMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headHeight: 0,
      currentIndex: 5,
      slide: [],
      menu: [],
      maxSlide: 0,
      modalStart: false,
      loadingSlide: true,
      loadingCat: true,
      loadingContent: true,
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
    const { params = {} } = this.props.route;

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
            {/* <View
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                this.setState({ headHeight: height });
              }}>
              <ArrowLeft color='white' />
            </View> */}
            <View
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                this.setState({ headHeight: height });
              }}
              alignContent="center"
              position="absolute"
              // top={0}
              zIndex={999}
              w="100%"
              flex={1}
              flexDirection="column"
            >
              <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
                style={{
                  backgroundColor: '#009BD4'
                }} />
              <View style={{
                backgroundColor: '#009BD4',
                paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8
              }}>
                <Pressable onPress={() => {
                  navigation.goBack()
                }}>
                  <ArrowLeft color='white' />
                </Pressable>
              </View>
              <LinearGradient
                colors={['#009BD4', 'transparent']}
                style={{ flex: 1, padding: 16 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    elevation: 3
                  }}
                >
                  <View>
                    {params.title && (
                      <Text
                        sx={glueAndroid.Global_textBaseBold}>
                        {params.title}
                      </Text>
                    )}
                    {params.subtitle && (
                      <Text
                        sx={glueAndroid.Global_textBase}>
                        {params.subtitle}
                      </Text>
                    )}
                    {params.tag && (
                      <Text
                        sx={glueAndroid.Global_textLightItalicXs}>
                        {params.tag}
                      </Text>
                    )}
                  </View>
                  <Image source={params.imgHead}
                    style={{
                      borderRadius: 10
                    }}
                    sx={{
                      "@base": {
                        width: "$16",
                        height: "$16",
                      },
                      "@sm": {
                        width: "$24",
                        height: "$24",
                      },
                      "@md": {
                        width: "$16",
                        height: "$16",
                      },
                    }}
                    resizeMode='stretch'
                  />
                </View>
              </LinearGradient>
            </View>

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
              <FlatList
                contentContainerStyle={{
                  paddingTop: this.state.headHeight,
                }}
                data={params.items}
                renderItem={({ item }) => (
                  <View
                    style={{
                      padding: 16
                    }}>
                    <Image source={item.icon}
                      style={{
                        borderRadius: 12
                      }}
                      sx={{
                        "@base": {
                          width: "$full",
                          height: "$48",
                        },
                        "@sm": {
                          width: "$full",
                          height: "$80",
                        },
                        "@md": {
                          width: "$full",
                          height: "$80",
                        },
                      }}
                      resizeMode='stretch'
                    />
                  </View>
                )} />
            </Skeleton>
          </Box>
        </Box>
      </>
    );
  }
}

SeeMore.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SeeMore);