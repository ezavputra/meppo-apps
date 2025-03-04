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
  Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon, CheckboxGroup,
  Actionsheet, ActionsheetBackdrop, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetContent,
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X, CheckIcon, PlusIcon, Cog, Calendar
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FormField from "../../new-components/FormControlContainer";
import { Formik } from "formik";
import DatePicker from 'react-native-date-picker';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class RequestQuotationChoose extends Component {
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
      max_delivery: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: [],
      item_pr: [],
      item_pr_product: [],
      item_pr_temp: [],
      showModal: false,
      check_pr: [],
      modalAddPR: false,
      refresh: false,
      rfq_detail: 0
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
    try {
      let post = {
        status: 56,
        purchase_for: 'head-office'
      }
      const response = await axios.post("/purchase_request/show_pr", post);
      this.setState({
        data: response.data.results,
        filtered_data: response.data.results,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onSuccessAdd = async (data) => {
    this.fetchData();
  }

  async onAddItem() {
    const { navigation, route } = this.props;
    let done = 0;
    let count = 1;

    try {
      if (this.state.item_pr.length == 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Item PR masih kosong",
          visibilityTime: 2000,
          position: 'bottom',
          // autoHide: false,
          onPress: () => {
            Toast.hide();
          }
        });
      } else {
        this.state.item_pr.forEach(element => {
          if (element.estimated_price == "" || element.max_delivery == "") {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: "Ada estimated price / max delivery yang belum diisi",
              visibilityTime: 2000,
              position: 'bottom',
              // autoHide: false,
              onPress: () => {
                Toast.hide();
              }
            });
          } else {
            if (count == this.state.item_pr.length) {
              done = 1;
            }
          }
          count++;
        });
      }

      let items_parent = [];
      let rfq_count = 0;
      let items_count = 0;
      this.state.item_pr.forEach(element => {
        if (rfq_count == element.rfq_detail) {
          if (items_count == 0) {
            let items = {
              'rfq_detail': element.rfq_detail,
              'items': [element]
            };
            items_parent.push(items);
            items_count++;
          } else {
            items_parent.at(element.rfq_detail).items.push(element);
          }
        } else {
          let items = {
            'rfq_detail': element.rfq_detail,
            'items': [element]
          };
          items_parent.push(items);
          items_count++;
        }
        rfq_count = element.rfq_detail;
      });

      console.warn(items_parent);

      if (done == 1) {
        navigation.goBack();
        route.params.onAddItem({
          product_selected: items_parent
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { navigation, me } = this.props;
    const { params = {} } = this.props.route;
    let estimated_price = "";
    let max_delivery = this.state.max_delivery;
    let rfq_detail = Number(this.state.rfq_detail);

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
                  Purchase Request
                </Text>
              </View>
            </Pressable>
          </View>

          <FlatList
            data={this.state.item_pr}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
              marginBottom: 80
            }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  key={"item_pr" + index}
                  style={{
                    marginVertical: 5,
                    marginBottom: index + 1 == this.state.item_pr.length ? 100 : 0
                  }}
                  onPress={() => {
                    this.setState({
                      index_selected: index
                    });
                    this.setState({ modalSet: true });
                  }}>
                  {({ pressed }) => {
                    item.estimated_price = item.estimated_price != undefined ? item.estimated_price : estimated_price;
                    item.max_delivery = item.max_delivery != undefined ? item.max_delivery : max_delivery;
                    return (
                      <View style={{
                        flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                        borderWidth: 1, borderColor: 'black', backgroundColor: pressed ? '#bdeeff' : '#fff',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <View>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ width: '100%' }}>
                            {item.product.name}
                          </Text>
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.6 }}>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginTop: 5 }}>
                                Qty : {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.qty} {item.product.product_unit.name}
                                </Text>
                              </Text>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%' }}>
                                Code PR : {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.code_pr}
                                </Text>
                              </Text>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%' }}>
                                Est. Required : {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.effective_date}
                                </Text>
                              </Text>
                            </View>
                            <View style={{ flex: 0.4 }}>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginTop: 5 }}>
                                Estimated Price : {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.estimated_price}
                                </Text>
                              </Text>
                              <Text sx={glueAndroid.Global_textBaseBold}
                                style={{ width: '100%', marginTop: 5 }}>
                                Max Delivery : {"\n"}
                                <Text sx={glueAndroid.Global_textLight}
                                  style={{ width: '100%' }}>
                                  {item.max_delivery}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <ChevronRight size={28} color='black' />
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              )
            }}>
          </FlatList>

          <Formik
            innerRef={form => (this.formikadd = form)}
            initialValues={{
              estimated_price: "",
              max_delivery: "",
            }}
            // validate={this.validateadd}
            onSubmit={(values, actions) => this.submitadd(values, actions, this.props)}
          >
            {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => {
              const isError = field => touched[field] && errors[field];
              return (
                <View>

                </View>
              )
            }}
          </Formik>

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
                </ScrollView>
                <Pressable
                  onPress={() => {
                    let filtered;
                    filtered = this.state.data.filter(item =>
                      item.code.toLowerCase().includes(no_doc.toLowerCase()),
                    );
                    this.setState({
                      filtered_data: filtered,
                      showModal: false
                    })
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#81defc' : '#bdeeff', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <SearchIcon size={18} color='#009BD4' />
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#009BD4', marginLeft: 10 }}>
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

          <Modal
            isOpen={this.state.modalSet}
            onClose={() => {
              this.setState({ modalSet: false })
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <View w={'100%'} h={400} p={16}>
                <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                  <View style={{ flexDirection: 'row' }}>
                    <Cog size={18} color='black' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'black', marginLeft: 10 }}>
                      Set Value
                    </Text>
                  </View>
                  <Pressable
                    key={"closemodal"}
                    onPress={() => {
                      this.setState({ modalSet: false })
                    }}>
                    <X color="black" size={24} />
                  </Pressable>
                </View>
                <ScrollView style={{ paddingVertical: 10 }}>
                  <FormField
                    type="number"
                    fieldName="estimated_price"
                    label="Estimated Price"
                    defaultValue={estimated_price}
                    onChangeText={(text) => {
                      estimated_price = text;
                    }}
                  />
                  <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                    style={{ marginBottom: 4 }}>
                    Max Delivery
                  </Text>
                  <Pressable
                    onPress={() => {
                      this.setState({ dateopen: true })
                    }}>
                    {({ pressed }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10, borderWidth: 1,
                          borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                          backgroundColor: pressed ? '#00000066' : '#fff', justifyContent: 'center'
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Calendar size={18} color='#009BD4' />
                            <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                              style={{ color: '#009BD4', marginLeft: 10 }}>
                              {this.state.max_delivery}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                </ScrollView>
                <Pressable
                  onPress={() => {
                    let item_selected = this.state.item_pr.at(this.state.index_selected);
                    item_selected.estimated_price = estimated_price;
                    item_selected.max_delivery = this.state.max_delivery;
                    this.setState({ refresh: !this.state.refresh, max_delivery: this.state.date_now });
                    this.setState({ modalSet: false });
                  }}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        flexDirection: 'row', marginVertical: 4, padding: 12, borderRadius: 10,
                        backgroundColor: pressed ? '#306fe3' : '#013597', justifyContent: 'center'
                      }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text sx={glueAndroid.Global_textBaseBold}
                            style={{ color: '#fff', marginLeft: 10 }}>
                            Submit
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </ModalContent>
          </Modal>

          <Actionsheet
            isOpen={this.state.modalAddPR}
            onClose={() => {
              this.setState({ modalAddPR: false })
            }}>
            <ActionsheetBackdrop />
            <ActionsheetContent w="$full" zIndex={-1}
              padding={0}
              bg='white'>
              <ActionsheetDragIndicatorWrapper borderRadius={0} marginBottom={10}>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <View flexDirection='row' justifyContent='space-between' alignItems='true' width={"100%"} paddingHorizontal={16}>
                <View style={{ flexDirection: 'row' }}>
                  <Cog size={18} color='black' />
                  <Text sx={glueAndroid.Global_textBaseBold}
                    style={{ color: 'black', marginLeft: 10 }}>
                    Add PR
                  </Text>
                </View>
                <Pressable
                  key={"closemodal"}
                  onPress={() => {
                    this.setState({ modalAddPR: false })
                  }}>
                  <X color="black" size={24} />
                </Pressable>
              </View>
              <FlatList
                data={this.state.filtered_data}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  paddingTop: 10,
                }}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      key={"materialreq" + index}
                      style={{
                        marginVertical: 5,
                        marginBottom: index + 1 == this.state.filtered_data.length ? 20 : 0
                      }}
                      onPress={() => {
                        item.detail.forEach(element => {
                          element.code_pr = item.code;
                          // element.estimated_price = 10000;
                          element.rfq_detail = rfq_detail;
                          this.state.item_pr.push(element);
                        });
                        console.warn(rfq_detail);
                        rfq_detail += 1;
                        this.setState({ refresh: !this.state.refresh, rfq_detail: rfq_detail });
                        // this.onAddItem(item)
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
                                  Dep. {item.department.name}
                                </Text>
                                <Text sx={glueAndroid.Global_textBaseBold}
                                  style={{ width: '100%' }}>
                                  Request{"\n"}
                                  Tgl :
                                  <Text sx={glueAndroid.Global_textLight}
                                    style={{ width: '100%' }}>
                                    {" "}{item.date}
                                  </Text>
                                </Text>
                              </View>
                            </View>
                            <View>
                              <PlusIcon size={28} color='black' />
                            </View>
                          </View>
                        )
                      }}
                    </Pressable>
                  )
                }}>
              </FlatList>
            </ActionsheetContent>
          </Actionsheet>

          <View style={{
            position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white'
          }}>
            <Pressable
              onPress={() => {
                this.setState({ modalAddPR: true })
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10,
                    backgroundColor: pressed ? '#81defc' : '#bdeeff', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: '#009BD4' }}>
                      Add PR
                    </Text>
                    <PlusIcon size={18} color='#009BD4' />
                  </View>
                )
              }}
            </Pressable>
            <Pressable
              onPress={() => {
                this.onAddItem();
              }}>
              {({ pressed }) => {
                return (
                  <View style={{
                    flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                    backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ color: 'white' }}>
                        Submit PR Item
                      </Text>
                    </View>
                  </View>
                )
              }}
            </Pressable>
          </View>

          <DatePicker
            modal
            mode='date'
            open={this.state.dateopen}
            date={this.state.dateInit}
            minimumDate={new Date()}
            onConfirm={(date) => {
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();

              if (day.toString().length == 1) {
                day = "0" + day;
              }
              if (month.toString().length == 1) {
                month = "0" + month;
              };

              this.setState({
                dateInit: date,
                max_delivery: day + "-" + month + "-" + year,
                selectedDate: year + "-" + month + "-" + day,
                dateopen: false
              });
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

RequestQuotationChoose.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestQuotationChoose);