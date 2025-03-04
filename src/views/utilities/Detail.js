import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, TouchableOpacity, Animated, BackHandler, FlatList } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import _ from "lodash";
import { glueAndroid } from "../../config/style-android";
import { setSettings, setLoading, setUserSession, setUI } from "../../store/actionCreators";
import { baseURL, Fonts, versi } from "../../config/app";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, ScrollView, Pressable, Icon,
  Modal, ModalBackdrop, ModalContent, ModalBody, ModalHeader, ModalCloseButton,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
  AvatarGroup, Avatar, AvatarBadge, AvatarImage, AvatarFallbackText,
  Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionTitleText, AccordionIcon,
  AccordionContent, AccordionContentText
} from "@gluestack-ui/themed";
import { Info, ArrowLeft, XCircle } from "lucide-react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, TabBar, SceneMap, TabBarItem, TabBarIndicator } from 'react-native-tab-view';
import Timeline from 'react-native-simple-timeline';
import Skeleton from 'react-native-reanimated-skeleton';
import FastImage from 'react-native-fast-image';
import BiayaPerbaikan from './BiayaPerbaikan';

const { width, height } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator();

class Detail extends Component {
  constructor(props) {
    super(props);
    const { params = {} } = this.props.route;
    const { boxHeight, detail } = params;

    this.state = {
      index: 0,
      tabIndex: 0,
      tabWidth: 100,
      actionbar: 0,
      botHeight: boxHeight,
      order_step: null,
      detail: detail,
      photos: null,
      backClickCount: 0,
      bottomsheetheight: 0
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings, detail } = this.props;

    this.fetchData();
    this._unsubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    const { navigation } = this.props;
    if (this.state.backClickCount == 0) {
      navigation.goBack();
    } else {
      this.bottom.snapToIndex(0);
    }
    return true;
  }

  async fetchData() {
    const { navigation, settings, showLoading, me } = this.props;
    const { params = {} } = this.props.route;
    const { order_id } = params;

    showLoading(true);

    try {
      const response = await axios.get(`/order/detail/${order_id}`);
      const { data: detail } = response.data;

      // const contactWA = _.find(settings, { key: "CONTACT_WHATSAPP" }).value;

      let photoList = null;
      let photosize = null;
      let photos = null;

      if (detail.photos != null) {
        photoList = detail.photos.split(",");
        photosize = photoList.length;

        // const [images, setImages] = useState(photoList);
        photos = photoList.map((item, index) => {
          return {
            source: {
              uri: baseURL + "/attachments/foto_kerusakan/original/" + item
            },
            thumbs: {
              uri: baseURL + "/attachments/foto_kerusakan/thumbs/" + item
            }
          };
        });
      }

      let step = [];
      detail.order_step.forEach(element => {
        step.push({
          id: element.id,
          status: element.title,
          date: element.day + " " + element.time + " WIB"
        })
      });

      this.setState({
        photos: detail.photos == null ? null : photos,
        detail,
        done: true,
        order_step: step
      });

      console.warn(detail);
      showLoading(false);
    } catch (error) {
      showLoading(false);
      console.warn(error);
    }
  }

  renderDetail(title, content) {
    return (
      <View style={{
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#cfcfcf",
        overflow: 'hidden'
      }}>
        <View style={{
          padding: 10, borderBottomWidth: 1, borderColor: "#cfcfcf",
          backgroundColor: '#f1f1f1'
        }}>
          <Text sx={glueAndroid.Global_textBaseBold}>{title}</Text>
        </View>
        <View style={{ padding: 10 }}>
          {content}
        </View>
      </View>
    )
  }

  render() {
    const { navigation, settings, showLoading, me } = this.props;
    const { detail } = this.state;

    // If data finish load
    return (
      <>
        <LinearGradient
          // colors={["#80bed5", 'transparent']}
          colors={[detail.status_color + "66", detail.status_color + "66", 'white']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View>
            <View style={{ height: 40 }}></View>

            <View
              style={{
                padding: 16,
              }}
              sx={{
                "@base": {
                  height: 60,
                },
                "@sm": {
                  height: 60,
                },
                "@md": {
                  height: 60,
                },
              }}
            >
              <View style={{
                flexDirection: 'row', marginBottom: 16
              }}>
                <Pressable
                  style={{
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  {({ pressed }) => {
                    return (
                      <ArrowLeft size={28} color={pressed ? '#fff' : '#000'} />
                    )
                  }}
                </Pressable>
                <FastImage
                  style={{
                    width: 30, height: 30,
                    alignSelf: "center",
                    marginLeft: 10,
                    // marginRight: 5
                  }}
                  source={{
                    uri: detail.category.icon,
                    priority: FastImage.priority.high
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={{ color: 'black', marginLeft: 10 }}
                  sx={glueAndroid.Global_bigTextBold}>
                  {detail.order_no}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: "#FFFFFFB3", borderColor: detail.status_color, borderWidth: 2,
                marginHorizontal: 16,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 8
              }}>
              <Text
                sx={glueAndroid.Global_textBase}>
                Status Order :
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  sx={glueAndroid.Global_textBaseBold}
                  style={{
                    marginRight: 8
                  }}>
                  {detail.status_name}
                </Text>
                <Pressable
                  onPress={() => {
                    this.setState({ modal: true })
                  }}>
                  {({ pressed }) => {
                    return (
                      <Info size={20} color={pressed ? '#fff' : '#000'} />
                    )
                  }}
                </Pressable>
              </View>
            </View>

            <ScrollView>

              <Accordion
                m="$5"
                width="90%"
                size="md"
                variant="filled"
                type="single"
                isCollapsible={true}
                isDisabled={false}
              >
                {/* <AccordionItem value={value}> */}
                <AccordionItem value="a">
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => {
                        return (
                          <>
                            <AccordionTitleText>B</AccordionTitleText>
                            {isExpanded ? (
                              <AccordionIcon as={Info} ml="$3" />
                            ) : (
                              <AccordionIcon as={Info} ml="$3" />
                            )}
                          </>
                        )
                      }}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>
                      C
                    </AccordionContentText>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <View style={{ backgroundColor: "#ccebf6", margin: 16, padding: 16, elevation: 4, borderRadius: 10 }}>
                <Text sx={glueAndroid.Global_textBaseBold} style={{ textAlign: 'justify', color: detail.status_color2 }}>
                  {detail.status_id == 8 ? detail.status_message2 : detail.status_message}
                </Text>
              </View>
            </ScrollView>

          </View>
        </LinearGradient>

        <BottomSheet
          ref={ref => this.bottom = ref}
          index={0}
          snapPoints={[150, height - 60]}
          onChange={(index) => this.setState({ backClickCount: index })}
        >
          <Skeleton
            containerStyle={{
              flex: 1, width: width
            }}
            isLoading={detail == null ? true : false}
            animationType="pulse"
            layout={[
              { key: '1', width: '100%', height: '100%' },
            ]}
          >
            <View
              style={{
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
              }}
            >
              <View style={{
                flexDirection: 'row',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#cfcfcf",
                padding: 16
              }}>
                {detail.order_tukang != null ? (
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
                    alt={detail.order_tukang.tukang.photo_tukang}
                    borderRadius="$full"
                    source={{
                      uri: detail.order_tukang.tukang.photo_tukang,
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
                    alt={detail.id + 'no_tukang'}
                    borderRadius="$full"
                    source={require("./../../assets/img/no_tukang.png")}
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
                    {detail.order_tukang != null ? (
                      detail.order_tukang.tukang.fullname
                    ) : (
                      "Belum Mendapatkan Tukang"
                    )}
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView w="$full" height={"90%"} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 16 }}>
                {detail.contact != null && (
                  this.renderDetail("Order Untuk",
                    <View
                      style={{ flex: 1, flexDirection: "column" }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        marginTop: 20,
                      }}>
                        <View style={{
                          padding: 10,
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                          backgroundColor: '#fada3c',
                        }}>
                          <Text sx={glueAndroid.Global_textBaseBold}>{detail.contact.label}</Text>
                        </View>
                        {detail.contact.is_primary == 1 && (
                          <View style={{
                            marginLeft: 10,
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: '#e3e2de',
                          }}>
                            <Text sx={glueAndroid.Global_textBaseBold}>Utama</Text>
                          </View>
                        )}
                      </View>
                      <View style={{
                        paddingTop: 10,
                        padding: 20,
                      }}>
                        <Text sx={glueAndroid.Global_textBaseBold}>{detail.contact.name}</Text>
                        <Text sx={glueAndroid.Global_textBase}>({detail.contact.phone})</Text>
                        <Text sx={glueAndroid.Global_textBaseBold}>Alamat:</Text>
                        <Text sx={glueAndroid.Global_textBase}>({detail.contact.address})</Text>
                        {detail.contact.note_address != '' && detail.contact.note_address != null && (
                          <Text sx={glueAndroid.Global_textBase}>({detail.contact.note_address})</Text>
                        )}
                      </View>
                    </View>
                  ))
                }
                {detail.contact == null && (
                  this.renderDetail("Lokasi",
                    <View>
                      <Text sx={glueAndroid.Global_textBase}>{detail.location_name}</Text>
                      {detail.note_address != 'undefined' && (
                        <Text sx={glueAndroid.Global_textLight}>{detail.note_address}</Text>
                      )}
                    </View>
                  ))
                }
                {this.renderDetail("Tipe Bangunan",
                  <Text sx={glueAndroid.Global_textBase}>{detail.type_bangunan}</Text>
                )}
                {this.renderDetail("Waktu Kunjungan",
                  <Text sx={glueAndroid.Global_textBase}>
                    {detail.date_survey_req + ', ' + detail.time_survey_req + ' WIB'}
                  </Text>
                )}
                {this.state.photos != null && (
                  this.renderDetail("Foto Kerusakan",
                    <FlatList
                      horizontal
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      legacyImplementation={false}
                      data={this.state.photos}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 1,
                            borderRadius: 10,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                imageIndex: index,
                                isImageViewVisible: true,
                              });
                            }}
                            style={{ borderRadius: 5, paddingRight: 5 }}
                          >
                            <Image
                              alt={"kerusakan" + index}
                              style={{ width: 80, borderRadius: 10 }}
                              source={item.thumbs}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )
                )}
                {this.renderDetail("Detail Keluhan",
                  <Text sx={glueAndroid.Global_textBase}>{detail.notes}</Text>
                )}
                {this.renderDetail("Tambahan Tangga",
                  <Text sx={glueAndroid.Global_textBase}>
                    {detail.stairs === 1 ? 'Perlu' : 'Tidak Perlu'}
                  </Text>
                )}
                <View marginBottom={80}></View>
              </View>
            </ScrollView>
          </Skeleton>
        </BottomSheet>
      </>
    );
  }
}

Detail.propTypes = {
  settings: PropTypes.object,
  navigation: PropTypes.object,
  saveSettings: PropTypes.func,
  showLoading: PropTypes.func,
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
  saveUI: (strings) => dispatch(setUI(strings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail);