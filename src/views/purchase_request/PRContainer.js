import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, TouchableOpacity, Animated } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
} from "@gluestack-ui/themed";
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, TabBar, SceneMap, TabBarItem, TabBarIndicator } from 'react-native-tab-view';
import {
  ArrowLeft, Check, Edit, PlusIcon, FileTextIcon,
  X
} from "lucide-react-native";
import PurchaseRequestDetail from './PurchaseRequestDetail';
import PurchaseRequestInfo from './PurchaseRequestInfo';
import PurchaseRequestRevisi from './PurchaseRequestRevisi';
import FormField from "../../new-components/FormControlContainer";

// import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator();

class PRContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      detail_selected: [],
      modalApprove: false,
      modalReject: false,
      can_approve: 0,
      can_reject: 0,
      can_edit: 0,
      index: 0,
      tabIndex: 0,
      tabWidth: 100,
      routes: [
        { key: 'info', title: 'Info', width: 100 },
        { key: 'detail', title: 'Detail', width: 130 },
        { key: 'revisi', title: 'History Revisi', width: 130 },
      ]
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    this.fetchData();
  }

  async fetchData() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;

    try {
      let menu_id = params.menu.id;
      const response = await axios.post("/menu/get_access/" + menu_id + "/" + me.role.id + "/" + params.item.document_status_id);
      this.setState({
        can_approve: response.data.results[0].can_approve,
        can_reject: response.data.results[0].can_reject,
        can_edit: response.data.results[0].can_edit
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.post("/purchase_request_detail/" + params.item.id);
      console.warn(response.data.results);
      this.setState({
        detail_selected: response.data.results
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  async sendApprove(mode) {
    const { navigation, me, accessToken, saveSettings, route } = this.props;
    const { params = {} } = this.props.route;

    try {
      // console.warn(this.state.reason);
      let response;
      let formData = params.item;
      formData.user_id = me.id;
      formData.purchase_request_details = this.state.detail_selected;
      console.warn(formData);
      if (mode == 'Reject') {
        formData.reason = this.state.reason;
        response = await axios.post("/purchase_request/reject/" + params.item.id, formData, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      if (mode == 'Approve') {
        response = await axios.post("/purchase_request/approve/" + params.item.id, formData, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      const success = response.data.status;
      console.warn(response.data);
      if (success) {
        navigation.goBack();
        route.params.onSuccessAdd();
      }
    } catch (error) {
      console.error(error);
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

  render() {
    const { navigation, route } = this.props;
    const { params = {} } = this.props.route;

    // If data finish load
    return (
      <>
        <View style={{ flex: 1, backgroundColor: '#f5fbfe' }}>
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
            style={{
              backgroundColor: '#013597'
            }} />

          <Box flex={1}>
            <View style={{ padding: 16 }}>
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
            </View>

            <TabView
              renderTabBar={(props) => this.renderTabBar(props, this.state.routes)}
              navigationState={{
                index: this.state.tabIndex,
                routes: this.state.routes
              }}
              renderScene={SceneMap({
                info: () => <PurchaseRequestInfo navigation={navigation} params={params} />,
                detail: () => <PurchaseRequestDetail navigation={navigation} params={params} />,
                revisi: () => <PurchaseRequestRevisi navigation={navigation} params={params} />,
              })}
              onIndexChange={(index) => this.setState({ tabIndex: index })}
              initialLayout={{ width: width }}
            />
          </Box>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%'
          }}>
            {this.state.can_edit == 1 && (
              <Pressable
                onPress={() => {
                  // console.warn(this.state.detail_selected)
                  navigation.navigate({
                    name: 'PurchaseRequestAdd',
                    params: {
                      onSuccessAdd: route.params.onSuccessAdd,
                      item_selected: params.item,
                      detail_selected: this.state.detail_selected,
                      mode: 'Revisi'
                    }
                  });
                }}>
                {({ pressed }) => {
                  return (
                    <View style={{
                      flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                      backgroundColor: pressed ? '#cf9d15' : '#fcba03', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Edit size={18} color='black' />
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ marginLeft: 10 }}>
                          Revisi
                        </Text>
                      </View>
                    </View>
                  )
                }}
              </Pressable>
            )}
            <View style={{
              flexDirection: 'row', flex: 1, width: '100%', marginBottom: 20
            }}>
              {this.state.can_reject == 1 && (
                <Pressable
                  style={{ flex: this.state.can_approve == 1 ? 0.5 : 1 }}
                  onPress={() => {
                    this.setState({ modalReject: true });
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#ed766f' : '#e63127', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <X size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Reject
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )}
              {this.state.can_approve == 1 && (
                <Pressable
                  style={{ flex: this.state.can_reject == 1 ? 0.5 : 1 }}
                  onPress={() => {
                    this.setState({ modalApprove: true })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#63b879' : '#399150', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Check size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Approve
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )}
            </View>
          </View>

          <Modal
            isOpen={this.state.modalReject}
            onClose={() => {
              this.setState({
                modalReject: false,
                reason: ''
              })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={400} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <FileTextIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Reject Material Request
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({
                        modalReject: false,
                        reason: ''
                      })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView style={{ paddingVertical: 10 }}>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginTop: 10 }}>
                      Reject material request ?
                    </Text>
                    <View>
                      <FormField
                        type="textarea"
                        defaultValue={""}
                        fieldName="reason"
                        label="Reason"
                        helperText="Isi Reason"
                        onChangeText={(text) => {
                          this.setState({ reason: text });
                        }}
                      />
                      {this.state.reason == '' && (
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ color: 'red' }}>
                          Reason harus diisi.
                        </Text>
                      )}
                    </View>
                  </View>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    this.sendApprove("Reject");
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#ed766f' : '#e63127', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <X size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Reject
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={this.state.modalApprove}
            onClose={() => {
              this.setState({
                modalApprove: false,
                reason: ''
              })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={300} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <FileTextIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Approve Material Request
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({
                        modalApprove: false,
                        reason: ''
                      })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginTop: 10 }}>
                      Approve material request ?
                    </Text>
                  </View>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    this.sendApprove("Approve");
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#63b879' : '#399150', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Check size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Approve
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

        </View>
      </>
    );
  }
}

PRContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PRContainer);