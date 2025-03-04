import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, Heading, ScrollView,
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  EditIcon
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon,
  Calendar,
  CheckIcon,
  XIcon,
  PaperclipIcon,
  FileTextIcon,
  FileIcon,
  File,
  FileEditIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";
import DatePicker from 'react-native-date-picker';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class MaterialRequestUsage extends Component {
  constructor(props) {
    super(props);

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    if (date.toString().length == 1) {
      date = "0" + date;
    }
    if (month.toString().length == 1) {
      month = "0" + month;
    }

    this.state = {
      reason: '',
      mode: 'start',
      approval_mode: '',
      approval_code: '',
      data: [],
      filtered_data: [],
      dateopen: false,
      dateInit: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      startSearchDate: date + "-" + month + "-" + year,
      endSearchDate: date + "-" + month + "-" + year,
      showModal: false,
      modalApprove: false,
      revisi_state: 'off',
      approval_state: 'off',
      detail_selected: null,
      btnApproveState: false
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, accessToken, saveSettings } = this.props;

    this.fetchData();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  async fetchData() {
    const { params = {} } = this.props.route;

    try {
      const response = await axios.post("/material_request");
      this.setState({
        data: response.data.results,
        filtered_data: response.data.results,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getDetail(id) {
    try {
      const response = await axios.post("/material_request_detail/" + id);
      console.warn(response.data.results);
      this.setState({
        btnApproveState: true,
        detail_selected: response.data.results
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendApprove(mode) {
    const { navigation, me, accessToken, saveSettings } = this.props;

    try {
      // console.warn(this.state.reason);
      let response;
      let formData = this.state.item_selected;
      formData.user_id = me.id;
      formData.material_request_details = this.state.detail_selected;
      console.warn(formData);
      if (mode == 'Reject') {
        formData.reason = this.state.reason;
        if (this.state.reason != '') {
          response = await axios.post("/material_request/reject/" + formData.id, formData, {
            headers: {
              accept: "multipart/form-data"
            }
          });
        }
        if (me.role.name == "Tech Support") {
          response = await axios.post("/material_request/reject/" + formData.id, formData, {
            headers: {
              accept: "multipart/form-data"
            }
          });
        }
      }
      if (mode == 'Approve') {
        response = await axios.post("/material_request/approve/" + formData.id, formData, {
          headers: {
            accept: "multipart/form-data"
          }
        });
      }
      const success = response.data.status;
      console.warn(response.data);
      if (success) {
        this.fetchData();
        this.setState({
          reason: '',
          modalApprove: false
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  async openLink(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'none',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#009BD4',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          // animations: {
          //   startEnter: 'slide_up',
          //   startExit: 'slide_none',
          //   endEnter: 'slide_none',
          //   endExit: 'slide_down'
          // },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        })
      }
      else Linking.openURL(url)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        visibilityTime: 2000,
        // autoHide: false,
        onPress: () => {
          Toast.hide();
        }
      });
    }
  }

  async onAddItem(item) {
    const { navigation, route } = this.props;

    try {
      const response = await axios.post("/material_request_detail/" + item.id);
      item.material_request_details = response.data.results;
      navigation.goBack();
      route.params.onAddItem({
        product_selected: [item]
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, me, accessToken, saveSettings } = this.props;
    const { params = {} } = this.props.route;
    let no_doc = "";

    // If data finish load
    return (
      <>
        <Box
          flex={1}
          sx={{
            _light: { bg: "white" },
            _dark: { bg: "black" },
          }}
        >
          <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="light-content" translucent />

          <View h={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
            style={{
              backgroundColor: '#013597'
            }} />

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
                  Pilih Material Request
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              this.setState({ showModal: true })
            }}>
            {({ pressed }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                  backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <SearchIcon size={18} color='#009BD4' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4', marginLeft: 10 }}>
                      Search
                    </Text>
                  </View>
                  <ChevronRight size={18} color='#009BD4' />
                </View>
              )
            }}
          </Pressable>

          <FlatList
            data={this.state.filtered_data}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  key={"materialreq" + index}
                  style={{
                    marginVertical: 5,
                    marginBottom: index + 1 == this.state.filtered_data.length ? 100 : 0
                  }}
                  onPress={() => {
                    this.onAddItem(item);
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                        borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <View>
                          <View>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ width: '100%' }}>
                              {item.code}
                            </Text>
                            <Text sx={glueAndroid.Global_textLightItalic}
                              style={{ width: '100%', marginBottom: 5 }}>
                              Dep. {item.department != null ? item.department.name : "-"}
                            </Text>
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ width: '100%' }}>
                              Request{"\n"}
                              Tgl :
                              <Text sx={glueAndroid.Global_textLight}
                                style={{ width: '100%' }}>
                                {" "}{item.request_date}
                              </Text>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%' }}>
                                {"\n"}Oleh :
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {" "}{item.user_activity.created.name}
                                </Text>
                              </Text>
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginBottom: 10 }}>
                            <PlusIcon size={24} color='black' />
                          </View>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )
            }}>
          </FlatList>

          <Modal
            isOpen={this.state.showModal}
            onClose={() => {
              this.setState({ showModal: false })
            }}
          // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={400} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <SearchIcon size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Search Filter
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ showModal: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView style={{ paddingVertical: 10 }}>
                  <FormField
                    type="text"
                    fieldName="No. Document"
                    label="No. Document"
                    onChangeText={(text) => {
                      no_doc = text;
                    }}
                  />
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={{ color: 'black', marginBottom: 10 }}>
                    Tanggal
                  </Text>
                  <Pressable
                    onPress={() => {
                      this.setState({ dateopen: true, dateInit: this.state.startDate, mode: 'start' })
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', padding: 12, borderRadius: 10,
                          backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Calendar size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              {this.state.startSearchDate}
                            </Text>
                          </View>
                          <ChevronRight size={18} color='#009BD4' />
                        </View>
                      )
                    }}
                  </Pressable>
                  <Pressable
                    style={{ marginTop: 5 }}
                    onPress={() => {
                      this.setState({ dateopen: true, dateInit: this.state.endDate, mode: 'end' })
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', padding: 12, borderRadius: 10,
                          backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Calendar size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              {this.state.endSearchDate}
                            </Text>
                          </View>
                          <ChevronRight size={18} color='#009BD4' />
                        </View>
                      )
                    }}
                  </Pressable>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    let filtered;
                    var date = new Date().getDate();
                    var month = new Date().getMonth() + 1;
                    var year = new Date().getFullYear();

                    if (date.toString().length == 1) {
                      date = "0" + date;
                    }
                    if (month.toString().length == 1) {
                      month = "0" + month;
                    }

                    filtered = this.state.data.filter(item =>
                      item.code.toLowerCase().includes(no_doc.toLowerCase()),
                    );

                    this.setState({
                      filtered_data: filtered,
                      dateInit: new Date(),
                      startSearchDate: date + "-" + month + "-" + year,
                      endSearchDate: date + "-" + month + "-" + year,
                      showModal: false
                    })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#81defc' : '#013597', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <SearchIcon size={18} color='white' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: 'white', marginLeft: 10 }}>
                            Search
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

          <DatePicker
            modal
            mode='date'
            open={this.state.dateopen}
            date={this.state.dateInit}
            onConfirm={(date) => {
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();

              if (day.toString().length == 1) {
                day = "0" + day;
              }
              if (month.toString().length == 1) {
                month = "0" + month;
              }

              this.setState({
                dateopen: false,
              });

              if (this.state.mode == 'start') {
                this.setState({
                  startDate: date,
                  startSearchDate: day + "-" + month + "-" + year
                });
              } else {
                this.setState({
                  endDate: date,
                  endSearchDate: day + "-" + month + "-" + year
                });
              }
            }}
            onCancel={() => {
              this.setState({
                dateopen: false
              })
            }}
          />

        </Box>
      </>
    );
  }
}

MaterialRequestUsage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialRequestUsage);