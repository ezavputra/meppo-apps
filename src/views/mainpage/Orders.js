import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, RefreshControl } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings, setLoading, setUserSession, setUI } from "../../store/actionCreators";
import PropTypes from "prop-types";
import {
  Text, View, FlatList, Pressable, Image,
  AvatarGroup, Avatar, AvatarBadge, AvatarImage, AvatarFallbackText
} from "@gluestack-ui/themed";
import LinearGradient from 'react-native-linear-gradient';
import {
  PackageOpen, Info
} from "lucide-react-native";
import LottieView from 'lottie-react-native';
import Svg, { Circle, SvgUri, SvgFromUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get("window");

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      orders: [],
      isLoading: true,
      isRefresh: false,
      boxHeight: 0
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, showLoading } = this.props;

    this.fetchData();
  }

  async fetchData() {
    const { showLoading, me, statusID } = this.props;
    this.setState({ isLoading: true });
    try {
      let options = {
        limit: 10,
        page: 1,
        sort: {
          order: "id",
          direction: "desc"
        },
        filter: {
          customer_id: me.customer.id,
          status_id: statusID
        }
      };
      const response = await axios.post("/orders", options);
      const { data: orders, metadata: pagination } = response.data;

      this.setState({
        orders: orders,
        isLoading: false
      });

    } catch (error) {
      this.setState({ isLoading: false });
      console.error(error.response);
    }
  }

  onRefreshHandler() {
    this.setState({ isRefresh: true });
    this.fetchData();
    this.setState({ isRefresh: false });
  }

  renderAvatar(item) {
    return (
      item.order_tukang ? (
        <Image
          alt={item.order_tukang.tukang.photo_tukang}
          size="xs"
          borderRadius="$full"
          source={{
            uri: item.order_tukang.tukang.photo_tukang,
          }}
        />
      ) : (
        <Image
          alt={item.id + 'no_tukang'}
          size="xs"
          borderRadius="$full"
          source={require("./../../assets/img/no_tukang.png")}
        />
      )
    )
  }

  renderTukangName(item) {
    return (
      <View style={{ justifyContent: 'center', marginBottom: 10 }}>
        <Text
          sx={glueAndroid.Global_textBaseBold}
          style={[{
            marginLeft: parseInt(item.status_id) != 0 || parseInt(item.status_id) != 7 ? 10 : 0,
          }]}>
          {item.order_tukang ? item.order_tukang.tukang.fullname : "Belum Mendapatkan Tukang"}
        </Text>
        <Text
          sx={glueAndroid.Global_textBase}
          style={[{
            marginLeft: parseInt(item.status_id) != 0 || parseInt(item.status_id) != 7 ? 10 : 0,
          }]}>
          Tgl. Survey : {item.date_survey_req}, {item.time_survey_req} WIB
        </Text>
      </View>
    )
  }

  renderTukangNameDone(item) {
    return (
      <Text
        sx={glueAndroid.Global_textBaseBold}
        style={{
          marginBottom: 10,
          marginLeft: 10,
          textAlignVertical: 'center',
        }}>
        {item.order_tukang ? item.order_tukang.tukang.fullname : "No Name"}
      </Text>
    )
  }

  renderNotAc(item) {
    return (
      parseInt(item.status_id) >= 1 && (parseInt(item.status_id) <= 8)) && (
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, paddingHorizontal: 10 }}>
          {(parseInt(item.status_id) != 21 && parseInt(item.status_id) != 24) && (
            this.renderAvatar(item)
          )}
          {(parseInt(item.status_id) != 6 && parseInt(item.status_id) != 21 && parseInt(item.status_id) != 24) && (
            this.renderTukangName(item)
          )}
          {(parseInt(item.status_id) == 6) && (
            this.renderTukangNameDone(item)
          )}
        </View>
      )
  }

  renderAc(item) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, paddingHorizontal: 10 }}>
        {(parseInt(item.status_id) >= 5 && parseInt(item.status_id) != 7 &&
          parseInt(item.status_id) < 21) && (
            this.renderAvatar(item)
          )}
        {(parseInt(item.status_id) != 6 && parseInt(item.status_id) != 21 && parseInt(item.status_id) != 24) && (
          this.renderTukangName(item)
        )}
        {(parseInt(item.status_id) == 6) && (
          this.renderTukangNameDone(item)
        )}
      </View>
    )
  }

  render() {
    const { navigation, showLoading, me, statusID, saveUI, UISet } = this.props;
    const { orders, isLoading, isRefresh } = this.state;

    return (
      <View style={{
        flex: 1,
        // backgroundColor: '#ebf6fd'
        backgroundColor: '#b1d9f5'
      }}>
        {this.state.isLoading && (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
            <View style={{ width: width, alignItems: 'center', justifyContent: 'center' }}>
              <LottieView style={{ width: 150, height: 150 }}
                source={require(`../../assets/anim/empty.json`)}
                autoPlay={true} loop={true}
                colorFilters={[
                  { keypath: 'Document', color: 'black' },
                  { keypath: 'Blue Lines', color: '#445CDA' },
                  { keypath: 'Line', color: 'black' },
                  { keypath: 'Circle', color: 'black' },
                ]}
              />
              <Text sx={glueAndroid.Global_textBaseBold}>
                Loading data
              </Text>
            </View>
          </View>
        )}

        {!this.state.isLoading && (
          this.state.orders.length == 0 ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
              <View style={{ width: width, alignItems: 'center', justifyContent: 'center' }}>
                <PackageOpen size={50} />
                {statusID == 6 ? (
                  <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={[{ marginBottom: 20 }]}>
                      Belum Ada Order Selesai
                    </Text>
                    <Pressable
                      key={"orderdone"}
                      style={{ borderRadius: 10 }}
                      onPress={() => {
                        this.onRefreshHandler();
                      }}
                    >
                      {({ pressed }) => {
                        return (
                          <View style={{
                            flexDirection: 'row',
                            backgroundColor: pressed ? '#e6e6e6' : '#009BD4',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 10
                            // justifyContent: 'center'
                          }}>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: pressed ? 'black' : 'white' }}>
                              Tap untuk Refresh
                            </Text>
                          </View>
                        )
                      }}
                    </Pressable>
                  </View>
                ) : (
                  <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={[{ marginBottom: 20 }]}>
                      Belum Ada Order
                    </Text>
                    <Pressable
                      key={"orderprogress"}
                      style={{ borderRadius: 10 }}
                      onPress={() => {
                        this.onRefreshHandler();
                      }}
                    >
                      {({ pressed }) => {
                        return (
                          <View style={{
                            flexDirection: 'row',
                            backgroundColor: pressed ? '#e6e6e6' : '#009BD4',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 10
                            // justifyContent: 'center'
                          }}>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: pressed ? 'black' : 'white' }}>
                              Tap untuk Refresh
                            </Text>
                          </View>
                        )
                      }}
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <FlatList
              data={this.state.orders}
              style={{
                padding: 10,
                paddingTop: 20
              }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefresh}
                  onRefresh={() => this.onRefreshHandler()}
                />
              }
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    key={"orderprogress"}
                    style={{
                      borderRadius: 10,
                      marginBottom: index == orders.length - 1 ? 100 : 20,
                      backgroundColor: 'white'
                    }}
                    onPress={() => {
                      const resetAction = CommonActions.reset({
                        index: 2,
                        routes: [
                          { name: "Home", },
                          { name: "Orders", },
                          {
                            // name: "DetailAc",
                            name: "Detail",
                            params: {
                              detail: item,
                              order_id: item.id,
                              boxHeight: this.state.boxHeight
                            }
                          },
                        ]
                      });
                      navigation.dispatch(resetAction);
                    }}
                  >
                    {({ pressed }) => {
                      return (
                        <View style={{
                          alignSelf: 'stretch',
                          justifyContent: 'center',
                          borderRadius: 10,
                          padding: 10,
                          backgroundColor: pressed ? '#e6e6e6' : 'white'
                        }}>
                          <View style={{
                            flexDirection: 'row',
                          }}>
                            <Skeleton
                              containerStyle={{ width: 45, marginRight: 10 }}
                              isLoading={this.state.isLoading}
                              animationType="pulse"
                              layout={[
                                { key: '1', width: '100%', height: 45, marginHorizontal: 10 }
                              ]}
                            >
                              <FastImage
                                style={{ width: 45, height: 45 }}
                                source={{
                                  uri: item.category.icon,
                                  priority: FastImage.priority.high
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </Skeleton>
                            <View style={{ flex: 1 }}>
                              <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 2
                              }}>
                                <Text sx={glueAndroid.Global_textBaseBold}>
                                  #{item.order_no ? item.order_no : item.id}
                                </Text>
                                <Text sx={glueAndroid.Global_textBaseBold}>
                                  {item.tgl_create} {item.bulan_create} {item.tahun_create}
                                </Text>
                              </View>
                              <Text sx={glueAndroid.Global_textBase} isTruncated={true}
                                style={{
                                  marginBottom: 6
                                }}>
                                {item.location_name}
                              </Text>
                              <View style={{
                                flexDirection: 'row',
                              }}>
                                <Text sx={glueAndroid.Global_textBaseBold}
                                  style={{
                                    color: 'white',
                                    backgroundColor:
                                      parseInt(item.status_id) == 4 ? (
                                        (item.surveys.status == 1 && item.status_color) ||
                                        (item.surveys.status == 3 && item.status_color3)
                                      ) : (
                                        item.status_color
                                      ),
                                    paddingVertical: 1,
                                    paddingHorizontal: 8,
                                    borderRadius: 4
                                  }}>
                                  {item.status_name}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {(parseInt(item.status_id) < 21 || parseInt(item.status_id) == 32) && (
                            <View style={{
                              alignSelf: 'center',
                              width: width - 100,
                              marginTop: 10,
                              borderWidth: 0.5,
                              borderColor: "#e6e6e6"
                            }} />
                          )}

                          {(item.category_id != '003') && (
                            this.renderNotAc(item)
                          )}
                          {(item.category_id == '003') && (
                            this.renderAc(item)
                          )}

                          {(parseInt(item.status_id) == 0 || parseInt(item.status_id) == 7) && (
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#f9f69f',
                              padding: 6,
                              borderRadius: 10,
                              marginTop: 5
                            }}>
                              <Info color={'black'} />
                              <Text
                                sx={glueAndroid.Global_textBaseBold}
                                style={[{
                                  marginLeft: 5
                                }]}>
                                {"Bayar sebelum " + item.batas_pembayaran}
                              </Text>
                            </View>
                          )}
                        </View>
                      )
                    }}
                  </Pressable>
                )
              }}
              keyExtractor={item => item.id}>
            </FlatList>
          )
        )}
      </View>
    );
  }
}

Orders.propTypes = {
  navigation: PropTypes.object,
  showLoading: PropTypes.func,
  saveSettings: PropTypes.func,
};

const mapStateToProps = ({ userSession, accessToken, UISet }) => ({
  accessToken,
  me: userSession,
  UISet
});

const mapDispatchToProps = (dispatch) => ({
  saveSession: (user) => dispatch(setUserSession(user)),
  saveAccessToken: (token) => dispatch(setAccessToken(token)),
  saveSettings: (user) => dispatch(setSettings(user)),
  showLoading: (isOpen) => dispatch(setLoading(isOpen)),
  saveUI: (strings) => dispatch(setUI(strings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);