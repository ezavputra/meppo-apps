import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, TouchableOpacity, Animated } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import PropTypes from "prop-types";
import { Box, Image, Text, View } from "@gluestack-ui/themed";
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, TabBar, SceneMap, TabBarItem, TabBarIndicator } from 'react-native-tab-view';
import Orders from '../mainpage/Orders';
// import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator();

const Berjalan = () => (
  <Orders statusID={0} />
);

const Selesai = () => (
  <Orders statusID={6} />
);

class DetailNonAc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      tabIndex: 0,
      tabWidth: 100,
      routes: [
        { key: 'berjalan', title: 'Sedang Berjalan', width: 100 },
        { key: 'selesai', title: 'Riwayat', width: 130 },
      ]
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

  }

  renderTabBar = (props) => (
    <TabBar
      {...props}
      activeColor={"black"}
      inactiveColor={"black"}
      style={{
        backgroundColor: 'transparent',
        marginHorizontal: 16
      }}
      bounces={true}
      renderTabBarItem={(props) => (
        <TabBarItem
          {...props}
          renderLabel={({ route, focused, color }) => (
            <Text sx={glueAndroid.Global_textBaseBold}
              style={{ color, textAlign: 'center' }}
              >
              {route.title}
            </Text>
          )}
        />
      )}
      renderIndicator={(props) => (
        <TabBarIndicator
          {...props}
          style={{
            backgroundColor: '#80bed5', borderRadius: 10,
            paddingHorizontal: 0,
            height: 5,
            // height: '100%'
          }} />
      )}
      scrollEnabled={true}
      tabStyle={{
        width: 'auto',
        // width: 150
      }}
    />
  );

  render() {
    const { navigation } = this.props;

    // If data finish load
    return (
      <View style={{ flex: 1, backgroundColor: '#f5fbfe' }}>
        <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

        <LinearGradient
          // colors={["#80bed5", 'transparent']}
          colors={['#ebf6fd', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={{ height: 40 }}>
          </View>
          
          <View style={{
            padding: 16,
          }}>
            <Text
              style={{ color: 'black' }}
              sx={{
                "@base": {
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 30,
                  lineHeight: '$3xl'
                },
                "@sm": {
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 40,
                  lineHeight: '$4xl'
                },
                "@md": {
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 40,
                  lineHeight: '$4xl'
                },
              }}>
              Order List
            </Text>
          </View>
          <TabView
            renderTabBar={(props) => this.renderTabBar(props, this.state.routes)}
            navigationState={{
              index: this.state.tabIndex,
              routes: this.state.routes
            }}
            renderScene={SceneMap({
              berjalan: Berjalan,
              selesai: Selesai,
            })}
            onIndexChange={(index) => this.setState({ tabIndex: index })}
            initialLayout={{ width: width }}
          />
        </LinearGradient>
      </View>
    );
  }
}

DetailNonAc.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailNonAc);