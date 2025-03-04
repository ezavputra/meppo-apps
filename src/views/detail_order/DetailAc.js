import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, TouchableOpacity, Animated, BackHandler, FlatList } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import _ from "lodash";
import { glueAndroid } from "../../config/style-android";
import { setSettings, setLoading, setUserSession } from "../../store/actionCreators";
import { baseURL, Fonts, versi } from "../../config/app";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, ScrollView, Pressable, Icon,
  Modal, ModalBackdrop, ModalContent, ModalBody, ModalHeader, ModalCloseButton,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
  AvatarGroup, Avatar, AvatarBadge, AvatarImage, AvatarFallbackText,
} from "@gluestack-ui/themed";
import {
  Info, ArrowLeft, XCircle
} from "lucide-react-native";
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, TabBar, SceneMap, TabBarItem, TabBarIndicator } from 'react-native-tab-view';
import BiayaPerbaikan from './BiayaPerbaikan';
import Timeline from 'react-native-simple-timeline';
import Svg, { Circle, SvgUri, SvgFromUri } from "react-native-svg";
// import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator();

class DetailAc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      tabIndex: 0,
      tabWidth: 100,
      modal: false,
      order_step: null,
      actionsheet: false,
      detail: null,
      photos: null,
      detailAc: {},
      botHeight: 0,
      routes: [
        { key: 'biaya_perbaikan', title: 'Biaya Order', width: 100 },
        { key: 'history', title: 'History', width: 130 },
      ]
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    this.setState({
      routes: [
        { key: 'biaya_perbaikan', title: 'Biaya Order', width: 100 }
      ]
    });

    this.fetchData();
  }

  async fetchData() {
    const { navigation, settings, showLoading, me } = this.props;
    const { params = {} } = this.props.route;
    const { order_id } = params;

    showLoading(true);

    try {
      const response = await axios.get(`/order/detail/${order_id}`);
      const { data: detail } = response.data;

      const contactWA = _.find(settings, { key: "CONTACT_WHATSAPP" }).value;

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

      if (detail.status_id == 8) {
        this.setState(prevState => ({
          routes: [
            ...prevState.routes,
            {
              key: 'history', title: 'History', width: 130
            }
          ]
        }));
      }

      showLoading(false);
      this.setState({
        detailAc: {
          photos: detail.photos == null ? null : photos,
          photosize: detail.photosize == null ? null : photosize,
          contactWA,
        },
        photos: detail.photos == null ? null : photos,
        detail,
        done: true,
        order_step: step
      });
      console.warn(detail);
    } catch (error) {
      showLoading(false);
      console.warn(error);
    }
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

  renderBottom(detail) {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
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
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          this.setState({ botHeight: height });
        }}>
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
        <Pressable
          onPress={() => {
            this.setState({ actionsheet: true });
          }}>
          {({ pressed }) => {
            return (
              <View style={{
                width: '100%', padding: 8, marginTop: 5, borderRadius: 10,
                // borderColor: '#80cdea', borderWidth: 2, 
                // backgroundColor: pressed ? '#80cdea' : 'white'
              }}>
                <Text sx={glueAndroid.Global_textBaseBold} style={{
                  textAlign: 'center',
                  color: pressed ? '#b3e1f2' : '#009BD4'
                }}>Tap untuk lengkap</Text>
              </View>
            )
          }}
        </Pressable>
      </View>
    )
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
    const { navigation } = this.props;
    const { detail } = this.state;

    // If data finish load
    return (
      <>
        <View style={{ flex: 1, backgroundColor: '#b1d9f5' }}>
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

            {detail != null && (
              <>
                <View style={{
                  padding: 16,
                }}>
                  <View style={{
                    flexDirection: 'row'
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
                    <SvgUri
                      style={{
                        alignSelf: "center",
                        marginLeft: 15,
                        marginRight: 10
                      }}
                      width={30} height={30}
                      uri={detail.category.icon}
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
                    backgroundColor: detail.status_color,
                    marginHorizontal: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 8
                  }}>
                  <Text
                    sx={glueAndroid.Global_textBaseBold}
                    style={{
                      color: 'white'
                    }}>
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
                        color: 'white', marginRight: 8
                      }}>
                      {detail.status_name}
                    </Text>
                    <Pressable
                      onPress={() => {
                        this.setState({ modal: true })
                      }}>
                      {({ pressed }) => {
                        return (
                          <Info size={20} color={pressed ? '#000' : '#fff'} />
                        )
                      }}
                    </Pressable>
                  </View>
                </View>

                <TabView
                  renderTabBar={(props) => this.renderTabBar(props, this.state.routes)}
                  navigationState={{
                    index: this.state.tabIndex,
                    routes: this.state.routes
                  }}
                  renderScene={
                    SceneMap(
                      {
                        biaya_perbaikan: () => <BiayaPerbaikan
                          detail={detail}
                          botHeight={this.state.botHeight} />,
                        history: () => <Timeline
                          detail={detail}
                          botHeight={this.state.botHeight} />
                      }
                    )
                  }
                  onIndexChange={(index) => this.setState({ tabIndex: index })}
                  initialLayout={{ width: width }}
                />
              </>
            )}
          </LinearGradient>
        </View>

        <Modal
          isOpen={this.state.modal}
          onClose={() => {
            this.setState({ modal: false })
          }}
        >
          <ModalBackdrop />
          <ModalHeader>
            <View flex={1} flexDirection='row' justifyContent='space-between'>
              <View></View>
              <Pressable
                key={"closemodal"}
                onPress={() => {
                  this.setState({ modal: false })
                }}>
                <XCircle color="white" size={24} />
              </Pressable>
            </View>
          </ModalHeader>
          <ModalContent>
            <View w={'100%'} h={400} p={24}>
              <Text sx={glueAndroid.Global_midTextBold}
                style={{
                  marginBottom: 10
                }}>History Order</Text>
              <View marginBottom={20}>
                <Timeline
                  data={this.state.order_step}
                  customStyle={{
                    flatlistContainer: {
                      paddingBottom: 50
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
              </View>
            </View>
          </ModalContent>
        </Modal>

        <Actionsheet
          isOpen={this.state.actionsheet}
          onClose={() => {
            this.setState({ actionsheet: false })
          }}>
          <ActionsheetBackdrop />
          <ActionsheetContent w="$full" zIndex={-1}
            padding={0}
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
            {/* <ActionsheetDragIndicatorWrapper  borderRadius={0}> */}
            {/* <ActionsheetDragIndicator /> */}
            {detail != null && (
              <View w="$full" sx={{
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
                <Text
                  style={{ color: 'black', marginLeft: 10 }}
                  sx={glueAndroid.Global_bigTextBold}>
                  #{detail.order_no}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#cfcfcf",
                    marginTop: 10,
                    marginBottom: 5,
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

                <ScrollView w="$full" height={"90%"} showsVerticalScrollIndicator={false}>
                  <View>
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
              </View>
            )}
            {/* </ActionsheetDragIndicatorWrapper> */}
          </ActionsheetContent>
        </Actionsheet>

        {detail != null && (
          this.renderBottom(detail)
        )}
      </>
    );
  }
}

DetailAc.propTypes = {
  settings: PropTypes.object,
  navigation: PropTypes.object,
  saveSettings: PropTypes.func,
  showLoading: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken, settings }) => ({
  settings,
  accessToken,
  me: userSession,
});

const mapDispatchToProps = (dispatch) => ({
  saveSession: (user) => dispatch(setUserSession(user)),
  saveAccessToken: (token) => dispatch(setAccessToken(token)),
  saveSettings: (user) => dispatch(setSettings(user)),
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailAc);