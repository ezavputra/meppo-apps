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

class PurchaseRequestInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    // this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    try {
      const response = await axios.post("/material_request");
      console.warn(response.data.results.departments)
      this.setState({
        data: response.data.results,
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
          <Box flex={1}>
            {/* <View style={{ padding: 16 }}>
              <Pressable onPress={() => {
                navigation.goBack()
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ArrowLeft color='black' />
                  <Text sx={glueAndroid.Global_textBaseBold} style={{
                    marginLeft: 16,
                    fontSize: 24, lineHeight: 32
                  }}>
                    {params.item.code}
                  </Text>
                </View>
              </Pressable>
            </View> */}

            <ScrollView style={{ marginBottom: 80 }}>
              <View style={{ padding: 16 }}>
                <View style={{ marginBottom: 8 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Status
                  </Text>
                  <View style={{
                    alignItems: 'flex-start'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{
                        marginTop: 5, backgroundColor: 'black',
                        paddingHorizontal: 8, paddingVertical: 4,
                        color: 'white',
                        borderRadius: 8
                      }}>
                      {params.item.document_status.name}
                    </Text>
                  </View>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Request Date
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.date}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Request By
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.created_by.name}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Last Update
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.last_update == null ? params.item.created_by.name : params.item.last_update.name}
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.updated_at}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Purchase For
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.purchase_for_text}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Department
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.department.name}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Divisi
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.division.name}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Warehouse
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.warehouse.name}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Remarks
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.remark.name}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Revisi
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.revision}
                  </Text>
                </View>
                <View style={{ marginVertical: 8, marginTop: 12 }}>
                  <Text sx={glueAndroid.Global_textTitle}>
                    Reason
                  </Text>
                  <Text sx={glueAndroid.Global_textBase}>
                    {params.item.last_reason == null ? '-' : params.item.last_reason}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Box>
        </Box>
      </>
    );
  }
}

PurchaseRequestInfo.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRequestInfo);