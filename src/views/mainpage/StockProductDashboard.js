import React, { Component } from 'react';
import { StatusBar, Dimensions, Platform, ImageBackground, ToastAndroid, BackHandler, KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../config/style-ios";
import { glueAndroid } from "../../config/style-android";
import { setSettings } from "../../store/actionCreators";
import Section from "../../components/Section";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, Pressable, Icon, FlatList, ScrollView,
  Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon, CheckboxGroup
} from "@gluestack-ui/themed";
// import BottomTabs from "../../new-components/BottomTabs";
import {
  PencilIcon, TrashIcon, ArrowLeft, Cog, X,
  ChevronDownIcon,
  CheckIcon, PlusIcon,
  ChevronRight, SearchIcon
} from "lucide-react-native";
import { CommonActions } from '@react-navigation/native';
import CarouselPager from 'react-native-carousel-pager';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from "react-native-svg";
import Skeleton from 'react-native-reanimated-skeleton';
import Toast from 'react-native-toast-message';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Formik } from "formik";
import FormField from "../../new-components/FormControlContainer";
import NumericInput from 'react-native-numeric-input';

const { width, height } = Dimensions.get("window");
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class StockProductDashboard extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { params = {} } = this.props.route;

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
      data: [],
      check_stock: [],
      modalAdd: false,
      product: [],
      product_selected: params.product_selected,
      date: date + "-" + month + "-" + year
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
    const { navigation, params } = this.props;
    try {
      let parameter = {
        option: 'summary'
      }
      const response = await axios.post("/get-datatable", parameter);
      this.setState({
        product: response.data.result,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getProduct(id) {
    const { navigation, params } = this.props;
    let response;
    try {
      const response = await axios.post("/stock_product/" + id);
      // console.warn(response);
      this.setState({
        product: response.data.results.product,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onAddItem() {
    const { navigation, route } = this.props;

    navigation.goBack();
    route.params.onAddItem({
      product_selected: this.state.product_selected
    });
  }

  render() {
    const { navigation, me } = this.props;
    const { params = {} } = this.props.route;

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
                <Text numberOfLines={1} sx={glueAndroid.Global_textBaseBold} style={{
                  marginLeft: 16,
                  fontSize: 24, lineHeight: 32
                }}>
                  Stock Product
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', backgroundColor: '#013597', padding: 6 }}>
            <View style={{
              flexDirection: 'row', marginTop: 5
            }}>
              <View style={{ flex: 0.2 }}>
                <Text sx={glueAndroid.Global_textTitle} style={{ color: 'white', marginTop: 5, paddingLeft: 16 }}>
                  Code
                </Text>
              </View>
              <View style={{ flex: 0.35 }}>
                <Text sx={glueAndroid.Global_textTitle} style={{ color: 'white', marginTop: 5, textAlign: 'center' }}>
                  Product
                </Text>
              </View>
              <View style={{ flex: 0.2, alignItems: 'center' }}>
                <Text sx={glueAndroid.Global_textTitle} style={{ color: 'white', marginTop: 5 }}>
                  Limit
                </Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'center' }}>
                <Text sx={glueAndroid.Global_textTitle} style={{ color: 'white', marginTop: 5 }}>
                  Remaining
                </Text>
              </View>
            </View>
          </View>

          <FlatList
            data={this.state.product}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#fff'
            }}
            renderItem={({ item, index }) => {
              var date = new Date().getDate();
              var month = new Date().getMonth() + 1;
              var year = new Date().getFullYear();

              if (date.toString().length == 1) {
                date = "0" + date;
              }
              if (month.toString().length == 1) {
                month = "0" + month;
              }

              item.effective_date = year + '-' + month + '-' + date;
              item.qty = item.limit_stock;

              return (
                <View style={{
                  padding: 16,
                  borderBottomWidth: 1, borderColor: '#bfc2c',
                  backgroundColor: item.final_stock <= 5 ? 'red' :
                    item.final_stock >= 6 && item.final_stock <= 15 ? '#fcba03' : 'black',
                  justifyContent: 'space-between',
                  marginBottom: this.state.product.length == index + 1 ? 100 : 0
                }}>
                  <View style={{
                    flexDirection: 'row', marginTop: 5
                  }}>
                    <View style={{ flex: 0.2 }}>
                      <Text sx={glueAndroid.Global_textTitle}
                        style={{
                          color: item.final_stock <= 5 ? 'white' :
                            item.final_stock >= 6 && item.final_stock <= 15 ? 'black' : 'black',
                          paddingRight: 18
                        }}>
                        {item.product_code}
                      </Text>
                    </View>
                    <View style={{ flex: 0.35 }}>
                      <Text sx={glueAndroid.Global_textTitle}
                        style={{
                          color: item.final_stock <= 5 ? 'white' :
                            item.final_stock >= 6 && item.final_stock <= 15 ? 'black' : 'black',
                        }}>
                        {item.product_name}
                      </Text>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textTitle}
                        style={{
                          color: item.final_stock <= 5 ? 'white' :
                            item.final_stock >= 6 && item.final_stock <= 15 ? 'black' : 'black',
                        }}>
                        {item.limit_stock}
                      </Text>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                      <Text sx={glueAndroid.Global_textTitle}
                        style={{
                          color: item.final_stock <= 5 ? 'white' :
                            item.final_stock >= 6 && item.final_stock <= 15 ? 'black' : 'black',
                        }}>
                        {item.final_stock}
                      </Text>
                    </View>
                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                      <CheckboxGroup
                        value={this.state.check_stock}
                        onChange={(keys) => {
                          this.setState({
                            check_stock: keys
                          });
                        }}
                      >
                        <Checkbox value={item}>
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                          <CheckboxLabel></CheckboxLabel>
                        </Checkbox>
                      </CheckboxGroup>
                    </View>
                  </View>
                </View>
              )
            }}>
          </FlatList>
        </Box>

        <View style={{
          position: 'absolute', bottom: 0, width: '100%'
        }}>
          <Pressable
            onPress={async () => {
              if (this.state.check_stock.length == 0) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Tidak ada item yang dipilih',
                  position: 'bottom',
                  visibilityTime: 2000,
                  // autoHide: false,
                  onPress: () => {
                    Toast.hide();
                  }
                });
              } else {
                let formData = {
                  "purchase_request_for": 'head-office',
                  "purchase_type": 53,
                  "code": 'from_dashboard',
                  // "effective_date": year + '-' + month + '-' + date,
                  "notes": 'PR From Dashboard',
                  "document_status_id": 2,
                  "remarks_id": 25,
                  "department_id": 2,
                  "division_id": 3,
                  "warehouse_id": 1,
                  "product_selected": this.state.check_stock,
                  "user_id": me.id
                };
                console.warn(formData);
                const response = await axios.post("/purchase_request/save", formData, {
                  headers: {
                    accept: "multipart/form-data"
                  }
                });
                // console.warn(response.data);
                const success = response.data.status;

                if (success) {
                  Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: 'Berhasil create PR',
                    position: 'bottom',
                    visibilityTime: 2000,
                    // autoHide: false,
                    onPress: () => {
                      Toast.hide();
                    }
                  });
                  navigation.goBack();
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Tidak berhasil create PR',
                    position: 'bottom',
                    visibilityTime: 2000,
                    // autoHide: false,
                    onPress: () => {
                      Toast.hide();
                    }
                  });
                }
              }
            }}>
            {({ pressed }) => {
              return (
                <View style={{
                  flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10, marginBottom: 20,
                  backgroundColor: pressed ? '#306fe3' : '#013597', alignItems: 'center', justifyContent: 'center'
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <PlusIcon size={18} color='white' />
                    <Text sx={glueAndroid.Global_textBaseBold}
                      style={{ color: 'white', marginLeft: 10 }}>
                      Create PR ({this.state.check_stock.length} Item)
                    </Text>
                  </View>
                </View>
              )
            }}
          </Pressable>
        </View>
      </>
    );
  }
}

StockProductDashboard.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(StockProductDashboard);