import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, RefreshControl } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings, setLoading, setUserSession } from "../../store/actionCreators";
import PropTypes from "prop-types";
import {
  Text, View, FlatList, Pressable, Image, ScrollView,
  AvatarGroup, Avatar, AvatarBadge, AvatarImage, AvatarFallbackText
} from "@gluestack-ui/themed";
import LinearGradient from 'react-native-linear-gradient';
import {
  PackageOpen, Info
} from "lucide-react-native";
import LottieView from 'lottie-react-native';
import Svg, { Circle, SvgUri, SvgFromUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import { toCurrency } from "../../_helpers/formatter";

const { width, height } = Dimensions.get("window");

class BiayaPerbaikan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      orders: [],
      detail: null,
      isLoading: false,
      isRefresh: false,
    };
  }

  render() {
    const { detail, botHeight } = this.props;

    console.warn(detail);
    
    return (
      <View style={{
        flex: 1,
        paddingBottom: botHeight,
      }}>
        <View style={{
          backgroundColor: detail.status_color + "1A", borderColor: detail.status_color, borderWidth: 2,
          padding: 16, borderRadius: 10, marginTop: 20, marginBottom: 10
        }}>
          <Text sx={glueAndroid.Global_textBaseBold} style={{ textAlign: 'justify', color: 'black' }}>
            {detail.status_id == 8 ? detail.status_message2 : detail.status_message}
          </Text>
        </View>
        <View style={{
          marginVertical: 10,
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 10
        }}>
          <Text sx={glueAndroid.Global_midTextBold}>Total Order</Text>
          {/* {
            detail != undefined && (
              detail.payment_orders[0].order_detail.map((item, index) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 10
                  }}
                >
                  <View style={{ flex: 0.5, flexDirection: "column" }}>
                    <Text sx={glueAndroid.Global_textBaseBold}>{item.name}</Text>
                    <Text sx={glueAndroid.Global_textLight}>
                      {item.qty > 0 ? item.qty : ""} {item.unit} Unit x{" "}
                      {toCurrency(item.price)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "flex-end",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text sx={glueAndroid.Global_textLight}>
                      {toCurrency(item.price * item.qty)}
                    </Text>
                  </View>
                </View>
              ))
            )
          } */}
          {/* {detail.payment_orders.length > 0 &&
            parseInt(detail.payment_orders[0].amount_discount) > 0 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 10
                }}
              >
                <View style={{ flex: 0.5, flexDirection: "column" }}>
                  <Text sx={glueAndroid.Global_textBaseBold}>Potongan/Voucher</Text>
                  <Text sx={glueAndroid.Global_textLight}>
                    Kupon "{detail.payment_orders[0].couponorder.coupon_code}"
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={[{ color: "red" }]}>
                    -{" "}
                    {toCurrency(
                      detail.payment_orders[0].couponorder.amount_discount
                    )}
                  </Text>
                </View>
              </View>
            )} */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderColor: "#cfcfcf",
              borderStyle: 'dashed'
            }}
          >
            <View style={{ flex: 0.5, flexDirection: "column" }}>
              <Text sx={glueAndroid.Global_textBaseBold}>Total</Text>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: "row",
                alignItems: "center",
                alignContent: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              {/* <Text sx={glueAndroid.Global_textBaseBold}>
                {toCurrency(
                  detail.payment_orders.length > 0
                    ? detail.payment_orders[0].amount
                    : 0
                )}
              </Text> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

BiayaPerbaikan.propTypes = {
  detail: PropTypes.any,
  botHeight: PropTypes.number,
};

BiayaPerbaikan.defaultProps = {
  detail: [],
  botHeight: 0
};

export default BiayaPerbaikan;
