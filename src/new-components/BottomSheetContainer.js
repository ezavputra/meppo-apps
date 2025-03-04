import React, { Component } from "react";
import { Dimensions } from "react-native";
import PropTypes from "prop-types";
import { glueAndroid } from "../config/style-android";
import {
  Image, View, Text
} from "@gluestack-ui/themed";

const { width, height } = Dimensions.get("window");

class BottomSheetContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, display } = this.props;

    return (
      <View
        style={{
          display: 'none',
          width: '100%',
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }}
        sx={{
          "@base": {
            padding: 16,
          },
          "@sm": {
            padding: 24,
          },
          "@md": {
            padding: 24,
          },
        }}>
        <View style={{
          flexDirection: 'row',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#cfcfcf",
          padding: 16
        }}>
          {item.order_tukang != null ? (
            <Image
              sx={{
                "@base": {
                  width: '$12',
                  height: '$12'
                },
                "@sm": {
                  width: '$20',
                  height: '$20'
                },
                "@md": {
                  width: '$20',
                  height: '$20'
                },
              }}
              alt={item.order_tukang.tukang.photo_tukang}
              borderRadius="$full"
              source={{
                uri: item.order_tukang.tukang.photo_tukang,
              }}
            />
          ) : (
            <Image
              sx={{
                "@base": {
                  width: '$12',
                  height: '$12'
                },
                "@sm": {
                  width: '$20',
                  height: '$20'
                },
                "@md": {
                  width: '$20',
                  height: '$20'
                },
              }}
              alt={item.id + 'no_tukang'}
              borderRadius="$full"
              source={require("../assets/img/no_tukang.png")}
            />
          )}
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Text sx={glueAndroid.Global_textBaseBold}
              style={{
                marginLeft: 10
              }}>
              {item.order_tukang != null ? (
                item.order_tukang.tukang.fullname
              ) : (
                "Belum Mendapatkan Tukang"
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

BottomSheetContainer.propTypes = {
  item: PropTypes.any,
  display: PropTypes.string,
};

BottomSheetContainer.defaultProps = {
  item: null,
  display: 'hidden',
};

export default BottomSheetContainer;
