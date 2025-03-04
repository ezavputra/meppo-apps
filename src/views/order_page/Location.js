import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, KeyboardAvoidingView, ImageBackground } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import PropTypes from "prop-types";
import {
  Box, Text, Image, View, Pressable, ScrollView, FlatList, SectionList,
  FormControl, Textarea, TextareaInput, Input, InputField, HStack, Divider,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent
} from "@gluestack-ui/themed";
import {
  PencilIcon, CheckCircleIcon, CircleEllipsis
} from "lucide-react-native";
import {
  setAccessToken,
  setAlert,
  setLoading,
  setUserSession,
  setSettings,
  setOrderPaymentSurveyCount,
} from "../../store/actionCreators";
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';
// import Placesearch from 'react-native-placesearch';

const { width, height } = Dimensions.get("window");

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: -7.3363747,
        longitude: 112.635399,
        latitudeDelta: 0.00922 * 1.0,
        longitudeDelta: 0.00421 * 1.0
      },
      latitude: -7.3363747,
      longitude: 112.635399,
      formattedAddress: '',
      featureName: '',
      dataLocation: null,
      detailsLocation: {},
      detailsLocationByMap: {},
      buttonPosition: 0,
      citySelect: '',
      mapview: 1, mode: 0,
      width: 0, height: 0, marginBottom: 1,
      res_search: false,
      find_address: 'Cari Alamat'
    };
    this.placeSearch = React.createRef();
  }

  // Mount User Method
  async componentDidMount() {
    const { showLoading, me } = this.props;
    const { params = {} } = this.props.route;

    // Instead of navigator.geolocation, just use Geolocation.
    this.setState({
      latitude: params.latitude,
      longitude: params.longitude,
      mapRegion: params.mapRegion
    });

    Geolocation.getCurrentPosition(
      (position) => {
        console.warn(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          mapRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.0,
            longitudeDelta: 0.00421 * 1.0
          }
        });

      },
      (error) => {
        // See error code charts below.
        console.warn(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    StatusBar.setBarStyle("dark-content");

    if (Platform.OS == 'ios') {
      navigation.setOptions({
        title: "Set Lokasi",
        headerShown: true
      });
    }

    this._isMounted = true;

    // this.unsubscribe = navigation.addListener('focus', () => {
    //   StatusBar.setBarStyle("dark-content");
    // });
  }

  componentWillUnmount() {
    const { me } = this.props;
    this._isMounted = false;
    // this.unsubscribe();
  }

  selectAddress(data) {
    console.warn(data);
    this.setState({ res_search: true, find_address: this.state.featureName });
    this.onRegionChange(data.coordinate.lat, data.coordinate.lng, data);
    if (this.modal.current) {
      this.modal.current.close();
    }
  }

  onSelectAddress = data => {
    console.warn(data);
    this.setState({ res_search: true, find_address: this.state.featureName });
    this.onRegionChange(data.coordinate.lat, data.coordinate.lng, data);
  };

  goBack = () => {
    const { navigation, route } = this.props;

    console.warn(this.state.citySelect);
    navigation.goBack();
    // route.params.onSelect({
    //   citySelect: this.state.citySelect,
    //   latitude: this.state.latitude,
    //   longitude: this.state.longitude,
    //   formattedAddress: this.state.formattedAddress,
    //   featureName: this.state.featureName,
    //   mapRegion: this.state.mapRegion
    // });
  }

  onRegionChange(latitude, longitude, data) {
    this.mapRef.animateCamera({
      center: { latitude, longitude }
    });
    let r = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.00922 * 2,
      longitudeDelta: 0.00421 * 2,
    };
    this.setState({
      mapRegion: r,
      dataLocation: data,
      // detailsLocation: details,
      // If there are no new values set the current ones
      latitude: latitude || this.state.latitude,
      longitude: longitude || this.state.longitude
    });
  }

  onRegionMapChange(region) {
    this.setState({
      latitude: region.latitude,
      longitude: region.longitude
    })

    var coord = {
      lat: region.latitude,
      lng: region.longitude
    };

    Geocoder.geocodePosition(coord).then(res => {
      console.warn(res);
    })
  }

  onRegionChangeComplete(region, isGesture) {
    var coord = {
      lat: region.latitude,
      lng: region.longitude
    };
    // console.warn(isGesture.isGesture);

    Geocoder.geocodePosition(coord).then(res => {
      this.setState({
        citySelect: res[0].subAdminArea,
        latitude: region.latitude,
        longitude: region.longitude,
        formattedAddress: !isGesture.isGesture && this.state.dataLocation != null ?
          this.state.dataLocation.description : res[0].formattedAddress,
        featureName: !isGesture.isGesture && this.state.dataLocation != null ?
          this.state.dataLocation.structured_formatting.main_text : res[0].feature != null ? res[0].feature : res[0].streetName,
        mapRegion: {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        }
      });
    });
  }

  KeyUp = () => {
    this.placeSearch.current.searchAddress();
  };

  chngText = (data) => {
    this.placeSearch.current.setAddress(data);
  };

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { isLoading, isRefresh, service } = this.state;
    const { params = {} } = this.props.route;
    const { icon } = params;

    // If data finish load
    return (
      <Box flex={1} style={{ backgroundColor: '#009BD466' }}>
        <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

        <MapView
          ref={el => (this.mapRef = el)}
          style={{
            width: '100%', backgroundColor: 'rgba(0,0,0,.6)',
            height: height
          }}
          //initialRegion={this.state.mapRegion}
          region={this.state.mapRegion}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          // showsMyLocationButton={true}
          // showsUserLocation={true}
          onMapReady={() =>
            this.setState({
              width: width,
              height: height,
              marginBottom: 0,
              mapRegion: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.00922 * 2,
                longitudeDelta: 0.00421 * 2
              }
            })
          }
          onRegionChangeComplete={(region, isGesture) => {
            this.onRegionChangeComplete(region, isGesture);
          }}
        >
          <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
              pinColor={"red"} // any color
              title={"title"}
              description={"description"}>

            </Marker>
        </MapView>
      </Box >
    );
  }
}

Location.propTypes = {
  saveSession: PropTypes.func,
  saveAccessToken: PropTypes.func,
  showLoading: PropTypes.func,
  showAlert: PropTypes.func,
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
  showLoading: (isOpen) => dispatch(setLoading(isOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);