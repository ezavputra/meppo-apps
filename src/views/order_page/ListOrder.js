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
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
  Menu, MenuItem, MenuItemLabel
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
import NumericInput from 'react-native-numeric-input';
import { toCurrency } from "../../_helpers/formatter";
import RadioButtonText from "../../components/RadioButtonText";
import Toggle from "react-native-toggle-element";
import Geolocation from "react-native-geolocation-service";
import Geocoder from 'react-native-geocoder';
import BottomSheet from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get("window");

class ListOrder extends Component {
  constructor(props) {
    super(props);
    const { params = {} } = this.props.route;

    this.state = {
      isTimePickerVisible: false,
      currentLocation: {
        latitude: -7.4605876,
        longitude: 112.7032945,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      },
      currentLocationAddress: "",
      actionsheet: true,
      service: [], list_contact: [],
      work_type: [], selectedOptAddress: "edit0",
      indexList: 0,
      locationtype: [],
      priceSurvey: 0,
      businessHourStart: 0,
      businessHourEnd: 0,
      selectIndex: 0, selectedLokasiIndex: 0,
      isModalVisible: false,
      toggleTipeLokasi: false,
      quantity: 0,
      selectedCustomSegment: '',
      locationDetail: '',
      data: [
        {
          title: {
            no: 1,
            name: 'Tentukan Lokasi'
          },
          data: [0],
        },
        {
          title: {
            no: 2,
            name: 'Pilih Tipe Lokasi',
            sub: "Yuk tentukan dulu tipe lokasi perbaikan"
          },
          data: [1],
        },
        {
          title: {
            no: 3,
            name: 'Pilih Layanan'
          },
          data: [2],
        }
      ],
      qty: '',
      locationPrice: 0,
      totalPrice: 0,
      height: 100,
      flex: 1,
      option: null,
      visibleSnack: false,
      isLoading: true,
      form_contact: null,
      city_name: params.cityName,
      biaya_layanan: params.biaya_layanan,
      hideFooter: false, address_type: [{
        index: 0,
        label: "Cari Alamat",
        value: "manual",
        desc: "Alamat manual"
      }, {
        index: 1,
        label: "Daftar Alamat",
        value: "contact",
        desc: "Daftar Alamat"
      }], address_selected: 0, contact_id: null,
      city_id: params.city_id,
      latitude: 0, address_choose: null,
      longitude: 0, city_select: null,
      featureName: '', isFirst: true,
      formattedAddress: '', note_address: ''
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { showLoading, me } = this.props;

    this.fetchData();
    this.getCurrentPostition();
  }

  getCurrentPostition() {
    const { params = {} } = this.props.route;

    Geolocation.getCurrentPosition(
      position => {
        var coord = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.warn("are");
        Geocoder.geocodePosition(coord).then(res => {
          if (this.state.latitude == 0) {
            this.setState({
              address_choose: {
                city_id: params.city_id,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                formattedAddress: res[0].formattedAddress,
                featureName: res[0].feature != null ? res[0].feature : res[0].streetName,
                mapRegion: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.00922 * 1.0,
                  longitudeDelta: 0.00421 * 1.0
                }
              },
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              formattedAddress: res[0].formattedAddress,
              featureName: res[0].feature != null ? res[0].feature : res[0].streetName,
              mapRegion: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922 * 1.0,
                longitudeDelta: 0.00421 * 1.0
              }
            });
          }
        })
      },
      (error) => {
        // See error code charts below.
        console.warn(error.code, error.message);
      },
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    );
  }

  async fetchData() {
    const { showLoading, settings, navigation, me } = this.props;
    const { params = {} } = this.props.route;
    const { categoryID } = params;
    let totalPrice = 0;
    let quantity = 0;
    this.setState({ isLoading: true });

    try {
      const response = await axios.post("/service", {
        categoryID: categoryID,
        cityID: this.state.city_id != null ? this.state.city_id : params.city_id
      });
      const { data: service, work_type: work_type } = response.data;
      console.warn(service);
      this.setState({
        work_type,
        service,
        qty: '',
        isLoading: false
      });

      if (service.length <= 1) {
        this.onChangeQty(1, 0);
      }
    } catch (error) {
      // showLoading(false);
      this.setState({ isLoading: false });
      console.error(error.response);
    }

    // showLoading(true);
    try {
      console.warn(categoryID);
      const resp = await axios.post("/locationtype", {
        city_id: this.state.city_id,
        category_id: params.categoryID
      });
      const { data: locationtype } = resp.data;
      console.warn(this.state.city_id);
      this.setState({
        locationtype
      });
    } catch (error) {
      console.error(error.response);
    }

    try {
      const response = await axios.get("/getlistcontact/" + me.customer.id);
      const { data: list_contact } = response.data;
      this.setState({
        list_contact: list_contact
      });
      // showLoading(false);
    } catch (error) {
      // showLoading(false);
      console.error(error.response);
    }
  }

  onChangeQty(value, index) {
    const { service, qty, locationPrice } = this.state;
    let totalPrice = 0;
    let quantity = 0;
    service[index].qty = value;

    service.map((item) => {
      totalPrice += item.qty * item.price;
      quantity += item.qty;
    })

    totalPrice += this.state.locationPrice;

    this.setState({
      service,
      totalPrice,
      quantity,
      isLoading: false
    })
  }

  // onSelect = async (data) => {
  //   const { params = {} } = this.props.route;

  //   const response = await axios.post("/checkcity", {
  //     city: data.citySelect,
  //     category_id: params.categoryID
  //   });
  //   const { success: success } = response.data;
  //   const { data: citychoose } = response.data;

  //   this.setState(data);
  //   this.setState({
  //     address_choose: {
  //       city_id: success ? citychoose.id : "Outer",
  //       latitude: data.latitude,
  //       longitude: data.longitude,
  //       formattedAddress: data.formattedAddress,
  //       featureName: data.featureName,
  //       mapRegion: data.mapRegion
  //     },
  //     city_id: success ? citychoose.id : "Outer",
  //     latitude: data.latitude,
  //     longitude: data.longitude,
  //     formattedAddress: data.formattedAddress,
  //     mapRegion: data.mapRegion,
  //     city_name: data.citySelect,
  //     biaya_layanan: success ? citychoose.biaya_layanan : 0
  //   });
  // };

  headerSection(no, title, subtitle = "") {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{
          elevation: 4,
          backgroundColor: 'white',
          justifyContent: 'center',
          padding: 6,
          paddingHorizontal: 12,
          borderRadius: 10
        }}>
          <Text
            sx={{
              "@base": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
              "@sm": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
              "@md": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
            }}
            style={{
              textAlignVertical: 'center',
              color: '#009BD4'
            }}
          >
            {no}
          </Text>
        </View>
        <View style={{
          alignSelf: 'center',
          justifyContent: 'center',
          marginLeft: 10
        }}>
          <Text
            sx={{
              "@base": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
              "@sm": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
              "@md": {
                fontFamily: "Poppins-SemiBold",
                fontSize: "$lg",
              },
            }}
            style={{ textAlignVertical: 'center', color: 'white' }}>
            {title}
          </Text>
          {subtitle != "" && (
            <Text sx={glueAndroid.Global_textLight} style={{ color: 'white' }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    )
  }

  render() {
    const { navigation, showLoading, me, settings } = this.props;
    const { isLoading, isRefresh, service } = this.state;
    const { params = {} } = this.props.route;

    // If data finish load
    return (
      <Box flex={1} style={{ backgroundColor: '#009BD466' }}>
        <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

        <View style={{ height: 40 }}>
        </View>

        <SectionList
          stickySectionHeadersEnabled
          minWidth={300}
          sections={this.state.data}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{
              backgroundColor: '#009BD4', marginHorizontal: 12, padding: 12
            }}>
              {this.headerSection(title.no, title.name, title.sub)}
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: 'white', borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
              marginHorizontal: 12, padding: 12, marginBottom: 8
            }}>
              {item == 0 && (
                <View style={{
                  flexDirection: 'row', padding: 8, borderRadius: 8,
                  justifyContent: 'space-between', alignItems: 'center'
                  // borderWidth: 1, borderColor: "#009BD4", backgroundColor: '#009BD433'
                }}>
                  <View style={{ flex: 0.9 }}>
                    <Text
                      sx={{
                        "@base": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                        "@sm": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                        "@md": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                      }}
                      style={{
                        display: this.state.formattedAddress != '' ? "flex" : "none"
                      }}>
                      {this.state.featureName != '' ? this.state.featureName : ""}
                    </Text>
                    <Text sx={glueAndroid.Global_textLight} numberOfLines={2}>
                      {this.state.formattedAddress != '' ? this.state.formattedAddress : "Belum Set Lokasi"}
                    </Text>
                  </View>
                  <Pressable
                    key={"ubahlokasi"}
                    onPress={() => {
                      this.setState({ actionsheet: true })
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          backgroundColor: pressed ? '#009BD466' : '#fff', borderRadius: 4
                        }}>
                          <PencilIcon color="#00000066" size={24} />
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
              )}
              {item == 1 && (
                <Toggle
                  value={this.state.toggleTipeLokasi}
                  onPress={(newState) => this.setState({ toggleTipeLokasi: newState })}
                  leftComponent={
                    <Text sx={glueAndroid.Global_textBaseBold}>
                      Rumah
                    </Text>
                  }
                  rightComponent={
                    <Text sx={glueAndroid.Global_textBaseBold}>
                      Apartment
                    </Text>
                  }
                  trackBarStyle={{
                    borderColor: "#009BD4",
                    backgroundColor: '#009BD466'
                  }}
                  trackBar={{
                    width: width - 48,
                    height: 40,
                    borderWidth: 2,
                  }}
                  thumbButton={{
                    width: (width - 48) / 2,
                    height: 38,
                    activeBackgroundColor: 'white',
                    inActiveBackgroundColor: 'white'
                  }}
                />
              )}
              {item == 2 && (
                <ScrollView>
                  {service.map((item, index) => {
                    return (
                      <View style={{
                        flexDirection: 'row', backgroundColor: 'white', borderRadius: 12,
                        marginBottom: service.length - 1 == index ? 12 : 4, padding: 4
                      }}>
                        <View style={{ height: 120, marginRight: 15 }}>
                          <FastImage
                            style={{ width: 70, height: 70, borderRadius: 10 }}
                            source={{
                              uri: item.icon,
                              priority: FastImage.priority.high
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
                          <View style={{ height: 90 }}>
                            <Text style={{ marginBottom: 2 }} sx={{
                              "@base": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                              "@sm": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                              "@md": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                            }}>
                              {item.name}
                            </Text>
                            <Text numberOfLines={2} sx={glueAndroid.Global_textLight}>
                              {item.note}
                            </Text>
                            <Text sx={glueAndroid.Global_textBaseBold} style={{ color: '#009BD4' }}>
                              Lihat Selengkapnya
                            </Text>
                          </View>
                          <View style={{
                            flex: 1, flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <View>
                              <Text sx={glueAndroid.Global_textBaseBold}>
                                {toCurrency(item.price)}
                              </Text>
                              <Text sx={glueAndroid.Global_textLight}>
                                Per Unit
                              </Text>
                            </View>
                            {service.length > 1 && (
                              <NumericInput
                                // initValue={service.length > 1 ? item.qty : params.choosen == item.id ? "1" : item.qty}
                                onLimitReached={(isMax, msg) => console.warn(isMax, msg)}
                                value={this.state.value}
                                totalHeight={35}
                                editable={false}
                                minValue={service.length <= 1 ? 1 : 0}
                                maxValue={service.length <= 1 ? 1 : 30}
                                valueType='real'
                                rounded
                                rightButtonBackgroundColor='#009BD4'
                                leftButtonBackgroundColor='#009BD4'
                                textStyle={{ fontWeight: 'bold' }}
                                iconStyle={{ color: 'white' }}
                                iconSize={24}
                                borderColor={'#009BD4'}
                                onChange={(value) => this.onChangeQty(value, index)}
                                containerStyle={{
                                  borderRadius: 10,
                                }}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </ScrollView>
              )}
            </View>
          )}
        />

        <HStack alignItems="center" safeAreaBottom shadow={6}>
          <Pressable
            key={"submitlayanan"}
            style={{ width: '100%' }}
            onPress={() => {
              console.warn("tes")
            }}>
            {({ pressed }) => {
              return (
                <View style={{
                  flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 18,
                  borderTopLeftRadius: 18, borderTopRightRadius: 18,
                  backgroundColor: pressed ? '#d0dfea' : '#009BD4'
                }}>
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={{ color: '#fff' }}>
                    {this.state.quantity} item
                  </Text>
                </View>
              )
            }}
          </Pressable>
        </HStack>

        <Actionsheet
          isOpen={this.state.actionsheet}
          onClose={() => {
            this.setState({ actionsheet: false })
          }}>
          <ActionsheetBackdrop />
          <ActionsheetContent w="$full" zIndex={-1}
            padding={0}
            bg='white'
            sx={{
              "@base": {
                height: height
              },
              "@sm": {
                height: height - (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)
              },
              "@md": {
                height: height - (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight)
              },
            }}>
            <ActionsheetDragIndicatorWrapper borderRadius={0}>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <View style={{ flex: 1 }}>
              <View style={{
                flex: 1, alignSelf: 'flex-start', padding: 16, width: width, marginTop: 12
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text sx={{
                      "@base": {
                        fontFamily: "Poppins-SemiBold",
                        fontSize: "$lg",
                      },
                      "@sm": {
                        fontFamily: "Poppins-SemiBold",
                        fontSize: "$lg",
                      },
                      "@md": {
                        fontFamily: "Poppins-SemiBold",
                        fontSize: "$lg",
                      },
                    }}>
                      Lokasi
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}>
                      Tentukan Lokasi Perbaikan
                    </Text>
                  </View>
                  <Pressable
                    key={"editlokasi"}
                    // style={{ width: '100%' }}
                    onPress={() => {
                      this.setState({ actionsheet: false });
                      navigation.navigate({
                        name: "Location",
                        params: {
                          // onSelect: this.onSelect,
                          latitude: this.state.latitude,
                          longitude: this.state.longitude,
                          mapRegion: this.state.mapRegion
                        }
                      });
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          paddingHorizontal: 18, paddingVertical: 4, borderRadius: 4,
                          backgroundColor: pressed ? '#bdeeff' : '#009BD4'
                        }}>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ color: 'white' }}>
                            Ubah
                          </Text>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
                <Pressable
                  key={"submitlayanan"}
                  style={{ width: '100%' }}
                  onPress={() => {
                    this.setState({ selectedLokasiIndex: 0 })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', padding: 10, marginTop: 10, alignItems: 'center',
                        backgroundColor: this.state.selectedLokasiIndex == 0 ? '#009BD433' : '#fff',
                        borderWidth: 1, borderRadius: 8, borderColor: '#009BD4'
                      }}>
                        <View style={{ flex: 0.9 }}>
                          <Text
                            sx={{
                              "@base": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                              "@sm": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                              "@md": {
                                fontFamily: "Poppins-SemiBold",
                                fontSize: "$lg",
                              },
                            }}
                            style={{
                              display: this.state.formattedAddress != '' ? "flex" : "none"
                            }}>
                            {this.state.featureName != '' ? this.state.featureName : ""}
                          </Text>
                          <Text sx={glueAndroid.Global_textLight} numberOfLines={2}>
                            {this.state.formattedAddress != '' ? this.state.formattedAddress : "Belum Set Lokasi"}
                          </Text>
                        </View>
                        {this.state.selectedLokasiIndex == 0 && (
                          <View style={{ flex: 0.1, alignItems: 'center' }}>
                            <CheckCircleIcon size={18} color='black' />
                          </View>
                        )}
                      </View>
                    )
                  }}
                </Pressable>
                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <Divider w={40} mr={10} />
                  <Text sx={glueAndroid.Global_textBaseBold}>
                    Atau
                  </Text>
                  <Divider w={40} ml={10} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text
                      sx={{
                        "@base": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                        "@sm": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                        "@md": {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: "$lg",
                        },
                      }}>
                      Daftar Alamat Tersimpan
                    </Text>
                    <Text sx={glueAndroid.Global_textLight}>
                      Pilih Lokasi Perbaikan dari Daftar
                    </Text>
                  </View>
                  <Pressable
                    key={"editlokasi"}
                    // style={{ width: '100%' }}
                    onPress={() => {
                      console.warn("tes")
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          paddingHorizontal: 18, paddingVertical: 4, borderRadius: 4,
                          backgroundColor: pressed ? '#bdeeff' : '#009BD4'
                        }}>
                          <Text sx={glueAndroid.Global_textBaseBold} style={{ color: 'white' }}>
                            Tambah
                          </Text>
                        </View>
                      )
                    }}
                  </Pressable>
                </View>
                {this.state.list_contact.length == 0 ? (
                  <Text sx={glueAndroid.Global_textLight} numberOfLines={2}>
                    Tidak ada alamat tersimpan
                  </Text>
                ) : (
                  <FlatList
                    data={this.state.list_contact}
                    showsVerticalScrollIndicator={false}
                    style={{
                      backgroundColor: '#fff',
                      paddingTop: 10,
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <Pressable
                          key={"daftaralamat" + index}
                          style={{ width: '100%' }}
                          onPress={() => {
                            this.setState({ selectedLokasiIndex: index + 1 })
                          }}>
                          {({ pressed }) => {
                            return (
                              <View style={{
                                marginVertical: 4,
                                borderWidth: 1,
                                borderColor: '#009BD4',
                                borderRadius: 10,
                                marginBottom: this.state.list_contact.length == index + 1 ? 80 : 4,
                                backgroundColor: this.state.selectedLokasiIndex == index + 1 ? '#009BD433' : '#fff'
                              }}>
                                <View style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center'
                                }}>
                                  <View style={{
                                    flexDirection: 'row',
                                    alignSelf: 'flex-start',
                                    marginTop: 10,
                                  }}>
                                    <View style={{
                                      flex: 0.9,
                                      flexDirection: 'row'
                                    }}>
                                      <View style={{
                                        paddingVertical: 4, paddingHorizontal: 10,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                        backgroundColor: '#fada3c',
                                      }}>
                                        <Text sx={glueAndroid.Global_textBaseBold}>
                                          {item.label}
                                        </Text>
                                      </View>
                                      {item.is_primary == 1 && (
                                        <View style={{
                                          marginLeft: 10,
                                          paddingVertical: 4, paddingHorizontal: 10,
                                          borderRadius: 10,
                                          backgroundColor: '#e3e2de',
                                        }}>
                                          <Text sx={glueAndroid.Global_textBaseBold}>
                                            Utama
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                    <Menu
                                      placement="left top"
                                      trigger={({ ...triggerProps }) => {
                                        return (
                                          <View style={{
                                            flex: 0.1, justifyContent: 'center'
                                          }}>
                                            <CircleEllipsis {...triggerProps} size={24} color={'black'} />
                                          </View>
                                        )
                                      }}
                                      selectionMode="single"
                                      onSelectionChange={(keys) => {
                                        if (keys.currentKey === "edit" + index) {
                                          console.warn("tes" + index)
                                        }
                                      }}
                                      closeOnSelect={true}
                                    >
                                      <MenuItem key={"edit" + index} textValue="Edit">
                                        <Text sx={glueAndroid.Global_textBaseBold}>
                                          Edit
                                        </Text>
                                      </MenuItem>
                                    </Menu>
                                  </View>
                                  <View style={{
                                    flexDirection: 'row',
                                  }}>
                                    <View style={{
                                      flex: 0.9
                                    }}>
                                      <View style={{
                                        paddingTop: 10,
                                        padding: 20,
                                      }}>
                                        <Text sx={glueAndroid.Global_textBaseBold}>
                                          {item.name}
                                        </Text>
                                        <Text sx={glueAndroid.Global_textLight}>
                                          {item.phone}
                                        </Text>
                                        <Text sx={glueAndroid.Global_textBaseBold}>
                                          Alamat
                                        </Text>
                                        <Text sx={glueAndroid.Global_textLight}>
                                          {item.address}
                                        </Text>
                                        {item.note_address != '' && item.note_address != null && (
                                          <Text sx={glueAndroid.Global_textBaseBold}>
                                            ({item.note_address})
                                          </Text>
                                        )}
                                      </View>
                                    </View>
                                    <View style={{
                                      flex: 0.1,
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                    }}>
                                      {this.state.selectedLokasiIndex == index + 1 && (
                                        <View style={{
                                          flexDirection: 'row', marginRight: 16,
                                          justifyContent: 'center',
                                        }}>
                                          <CheckCircleIcon size={18} color='black' />
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            )
                          }}
                        </Pressable>
                      )
                    }}>
                  </FlatList>
                )}
              </View>
              <Pressable
                key={"gantilokasi"}
                // style={{ width: '100%', flex: 0.1, backgroundColor: 'white' }}
                style={{
                  position: 'absolute',
                  bottom: 0, marginBottom: 20
                }}
                onPress={() => {
                  console.warn("tes")
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#81defc' : '#bdeeff'
                    }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: '#009BD4', width: '100%', textAlign: 'center' }}>
                        Ganti Lokasi
                      </Text>
                    </View>
                  )
                }}
              </Pressable>
            </View>
          </ActionsheetContent>
        </Actionsheet>
      </Box >
    );
  }
}

ListOrder.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ListOrder);