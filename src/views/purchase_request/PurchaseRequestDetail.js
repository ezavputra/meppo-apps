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
  PencilIcon, TrashIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class PurchaseRequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false
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
    const { navigation, params } = this.props;
    this.setState({ isLoading: true });
    try {
      const response = await axios.post("/purchase_request_detail/" + params.item.id);
      this.setState({
        data: response.data.results,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, params } = this.props;

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
          {this.state.isLoading ? (
            <View style={{ alignItems: 'center', marginVertical: 50 }}>
              <Text sx={glueAndroid.Global_textBaseBold}>
                Loading Data
              </Text>
            </View>
          ) : (
            <FlatList
              data={this.state.data}
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: '#fff',
                paddingTop: 10
              }}
              renderItem={({ item, index }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                    borderWidth: 1, borderColor: 'black',
                    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text sx={glueAndroid.Global_textBaseBold}>
                          {item.product.name}
                        </Text>
                        <Text sx={glueAndroid.Global_textLightItalic}>
                          {" - "}{item.product.code}
                        </Text>
                      </View>
                      <Text sx={glueAndroid.Global_textBase}>
                        ({item.product.product_category.name})
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 10 }}>
                        Function
                      </Text>
                      <Text sx={glueAndroid.Global_textBase}>
                        {item.product.description}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold} style={{ marginTop: 4 }}>
                        Note
                      </Text>
                      <Text sx={glueAndroid.Global_textBase}>
                        {item.notes == null ? '-' : item.notes}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textTitle}>
                        {item.qty}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}>
                        {item.product.product_unit.name}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Pressable
                          style={{
                            marginTop: 10
                          }}
                          onPress={() => {
                            console.warn("tes")
                          }}>
                          {({ pressed }) => {
                            return (
                              <View style={{
                                padding: 8, backgroundColor: pressed ? 'yellow' : 'orange', borderRadius: 8
                              }}>
                                <PencilIcon size={18} color="black" />
                              </View>
                            )
                          }}
                        </Pressable>
                        <Pressable
                          style={{
                            marginTop: 10, marginLeft: 5
                          }}
                          onPress={() => {
                            console.warn("tes")
                          }}>
                          {({ pressed }) => {
                            return (
                              <View style={{
                                padding: 8, backgroundColor: pressed ? 'maroon' : 'red', borderRadius: 8
                              }}>
                                <TrashIcon size={18} color="white" />
                              </View>
                            )
                          }}
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )
              }}>
            </FlatList>
          )}
        </Box>
      </>
    );
  }
}

PurchaseRequestDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRequestDetail);