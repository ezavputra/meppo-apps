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
  FilterIcon
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

class CurationChoose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      choosen_item: [],
      showModal: false
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    console.warn(params);
    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { params = {} } = this.props.route;

    try {
      const response = await axios.post("/curation/" + params.item.id);
      console.warn(response.data.results.quotation);
      this.setState({
        filtered_data: response.data.results.quotation,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  async onAddItem() {
    const { navigation, route } = this.props;

    try {
      navigation.goBack();
      route.params.onAddItem({
        filtered_data: this.state.choosen_item
      });
    } catch (error) {
      console.error(error);
    }
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
                  fontSize: 24, lineHeight: 32
                }}>
                  Pilih Quotation
                </Text>
              </View>
            </Pressable>
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
                  borderWidth: 1, borderColor: 'black',
                  marginBottom: index + 1 == this.state.filtered_data.length ? 100 : 0,
                  // backgroundColor: pressed ? '#bdeeff' : '#fff',
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <View>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%', marginBottom: 8 }}>
                        Quotation {index+1} By {item.vendor.name}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%', marginBottom: 8 }}>
                        {item.vendor.name}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            }}>
          </FlatList>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%'
          }}>
            <Pressable
              onPress={() => {
                navigation.navigate({
                  name: 'RequestQuotationAdd',
                  params: {
                    onSuccessAdd: this.onSuccessAdd
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
                        Pilih Item Quotation
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

CurationChoose.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CurationChoose);