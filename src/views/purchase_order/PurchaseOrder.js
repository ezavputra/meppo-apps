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
  Modal, ModalBackdrop, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  ChevronRight, ArrowLeft, SearchIcon, X,
  PlusIcon, FileEditIcon, EyeIcon,
  WalletIcon, Calendar, Cog
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

class PurchaseOrder extends Component {
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
      payment_date: date + "-" + month + "-" + year,
      selectedDate: year + "-" + month + "-" + date,
      dateopen: false,
      dateInit: new Date(),
      date_now: date + "-" + month + "-" + year,
      data: [],
      filtered_data: [],
      showModal: false,
      modalSet: false,
      refresh: false,
      index_selected: 0,
      item_selected: null
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
      const response = await axios.post("/purchase_order");
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

  render() {
    const { navigation, me } = this.props;
    const { params = {} } = this.props.route;
    let payment_note = "";

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
                  Purchase Order
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

          <FlatList
            data={this.state.filtered_data}
            showsVerticalScrollIndicator={false}
            extraData={this.state.refresh}
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 10,
                  borderWidth: 1, borderColor: 'black', backgroundColor: '#fff',
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <View>
                    <View>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%' }}>
                        {item.code}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%' }}>
                        Tgl :{" "}{item.created_at}
                      </Text>
                      <Text sx={glueAndroid.Global_textBaseBold}
                        style={{ width: '100%' }}>
                        Rp. {item.grandtotal}
                      </Text>
                      <View style={{ marginTop: 4 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Status:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.document_status.name == "Receipt" ? "Closed" :
                            item.document_status.name == 'Approved Director' ? 'Approve' :
                              item.document_status.name == 'Rejected Director' ? 'Reject' : item.document_status.name}
                        </Text>
                      </View>
                      <View style={{ marginTop: 6 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Payment:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.payment_status == null ? "Proccess" : item.payment_status.name}
                        </Text>
                      </View>
                      <View style={{ marginTop: 6 }}>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{ width: '100%' }}>
                          Delivery:
                        </Text>
                        <Text sx={glueAndroid.Global_textBaseBold}
                          style={{
                            backgroundColor: "black",
                            paddingHorizontal: 8, paddingVertical: 4,
                            color: "white",
                            borderRadius: 8, alignSelf: 'flex-start'
                          }}>
                          {item.delivery_status == null ? "Pending" : item.delivery_status.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable
                      // key={"materialreq" + index}
                      style={{
                        marginVertical: 5, marginRight: 20
                      }}
                      onPress={async () => {
                        navigation.navigate({
                          name: 'PurchaseOrderDetail',
                          params: {
                            item: item,
                            menu: params.menu
                          }
                        });
                      }}>
                      {({ pressed }) => {
                        return (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <EyeIcon size={20} color='black' />
                          </View>
                        )
                      }}
                    </Pressable>
                    {item.payment_status_id == '84' && (
                      <Pressable
                        // key={"materialreq" + index}
                        style={{
                          marginVertical: 5
                        }}
                        onPress={async () => {
                          this.setState({ modalSet: true, index_selected: index, item_selected: item });
                        }}>
                        {({ pressed }) => {
                          return (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <WalletIcon size={20} color='black' />
                            </View>
                          )
                        }}
                      </Pressable>
                    )}
                  </View>
                </View>
              )
            }}>
          </FlatList>

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
                      Payment PO
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
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ marginBottom: 4 }}>
                      Vendor
                    </Text>
                    <Text sx={glueAndroid.Global_textBase}
                      style={{ marginBottom: 10 }}>
                      Payment Date
                    </Text>
                  </View>
                  <View>
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ marginBottom: 4 }}>
                      Amount
                    </Text>
                    <Text sx={glueAndroid.Global_textBase}
                      style={{ marginBottom: 10 }}>
                      Rp. 100000
                    </Text>
                  </View>
                  <Text sx={glueAndroid.Global_textBaseBold} numberOfLines={1}
                    style={{ marginBottom: 4 }}>
                    Payment Date
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
                              {this.state.payment_date}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  </Pressable>
                  <FormField
                    type="textarea"
                    fieldName="payment_note"
                    label="Payment Note"
                    defaultValue={payment_note}
                    onChangeText={(text) => {
                      payment_note = text;
                    }}
                  />
                </ScrollView>
                <Pressable
                  onPress={async () => {
                    let data = this.state.filtered_data.at(this.state.index_selected);
                    var vendors = {};

                    data.purchase_order_details.forEach(function (item) {
                      var vendorName = item.vendor.name;
                      var vendorId = item.vendor.id;
                      var subtotal = item.subtotal;
                      var curationDetailId = item.curation_detail_id;
                      var payment_status = item.document_status != null ? 'Paid' : 'Unpaid';

                      if (payment_status == 'Unpaid') {
                        if (!vendors[vendorName]) {
                          vendors[vendorName] = {
                            vendor_id: vendorId,
                            vendor_name: vendorName,
                            amount: subtotal,
                            curation_detail_id: curationDetailId,
                            payment_status: payment_status
                          };
                        } else {
                          vendors[vendorName].amount += subtotal;
                        }
                      }
                    });

                    let vendor_payment = [];
                    var i = 0;
                    for (var vendorName in vendors) {
                      var vendorData = vendors[vendorName];

                      vendor_payment.push(
                        {
                          vendor_id: vendorData.vendor_id,
                          curation_detail_id: vendorData.curation_detail_id,
                          payment_amount: vendorData.amount,
                          payment_date: this.state.payment_date,
                          payment_proof_of_transfer: null,
                          payment_note: payment_note
                        }
                      );

                      i++;
                    }

                    let parameter = {
                      user_id: me.id,
                      vendor_payment: vendor_payment
                    }

                    console.warn(parameter);
                    console.warn(this.state.item_selected.id);

                    const response = await axios.post("/vendor_payment/" + this.state.item_selected.id, parameter, {
                      headers: {
                        accept: "multipart/form-data"
                      }
                    });

                    const success = response.data.status;
                    console.warn(response.data);

                    if (success) {
                      payment_note = "";
                      this.fetchData();
                      this.setState({ payment_date: this.state.date_now });
                      this.setState({ modalSet: false });
                    }
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
                payment_date: day + "-" + month + "-" + year,
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

PurchaseOrder.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrder);