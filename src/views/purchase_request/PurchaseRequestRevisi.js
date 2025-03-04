import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, RefreshControl } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { Fonts, glueAndroid } from "../../config/style-android";
import { setSettings, setLoading, setUserSession } from "../../store/actionCreators";
import PropTypes from "prop-types";
import {
  Text, View, ScrollView,
} from "@gluestack-ui/themed";
import {
  PackageOpen, Info
} from "lucide-react-native";
import Timeline from 'react-native-simple-timeline';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");

class PurchaseRequestRevisi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      orders: [],
      detail: null,
      order_step: [],
      isLoading: false,
      isRefresh: false,
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, showLoading, detail } = this.props;

    this.fetchData();
    // let step = [];
    // detail.order_step.forEach(element => {
    //   step.push({
    //     id: element.id,
    //     status: element.title,
    //     date: element.day
    //   })
    // });

    // this.setState({ order_step: step });
  }

  async fetchData() {
    const { navigation, params } = this.props;
    try {
      const response = await axios.post("/purchase_request_revisi/" + params.item.id);
      let step = [];
      response.data.results.forEach(element => {
        step.push({
          id: element.id,
          status: element.reasons + "\n(" + element.user.name + ")",
          date: element.created_at
        })
      });
      this.setState({ order_step: step });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, showLoading, me, botHeight } = this.props;
    const { detail, isLoading, isRefresh } = this.state;

    return (
      <View style={{
        flex: 1,
        paddingBottom: botHeight,
      }}>
        {/* {this.state.isLoading && (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
            <View style={{ width: width, alignItems: 'center', justifyContent: 'center' }}>
              <LottieView style={{ width: 100, height: 100 }}
                source={require(`../../assets/anim/empty.json`)}
                autoPlay={true} loop={true}
                colorFilters={[
                  { keypath: 'Document', color: 'black' },
                  { keypath: 'Blue Lines', color: '#445CDA' },
                  { keypath: 'Line', color: 'black' },
                  { keypath: 'Circle', color: 'black' },
                ]}
              />
              <Text sx={glueAndroid.Global_textBaseBold} style={{ fontFamily }}>
                Loading data
              </Text>
            </View>
          </View>
        )} */}

        {this.state.order_step.length == 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 50 }}>
            <Text sx={glueAndroid.Global_textBaseBold}>
              Belum Ada Revisi
            </Text>
          </View>
        ) : (
          <Timeline
            data={this.state.order_step}
            customStyle={{
              flatlistContainer: {
                marginBottom: 50,
                padding: 16
              },
              textStyle: {
                txtStatus: {
                  fontFamily: "Poppins-SemiBold"
                },
                txtDate: {
                  fontFamily: "Poppins-LightItalic"
                }
              }
            }}
          />
        )}
      </View>
    );
  }
}

PurchaseRequestRevisi.propTypes = {
  navigation: PropTypes.object,
  showLoading: PropTypes.func,
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
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRequestRevisi);