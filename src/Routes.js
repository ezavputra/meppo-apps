import React, { useState, useRef, useEffect } from 'react';
import {
   Dimensions
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { connect } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Tabbar from "@mindinventory/react-native-tab-bar-interaction";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import LottieView from 'lottie-react-native';
import BottomTabs from "./new-components/BottomTabs";
import { navigationRef } from "./new-components/RootNavigation";
import {
   User,
   Home as HomeIcon,
   ScrollText,
} from "lucide-react-native";
import { Fonts } from "./config/app";

import SplashScreen from './views/SplashScreen';
import QRScanner from './views/utilities/QRScanner';
import QRProduct from './views/utilities/QRProduct';
import IntroPage from './views/login_page/IntroPage';
import Login from './views/login_page/Login';
import UpdateAccount from './views/UpdateAccount';
import UpdatePage from './views/UpdatePage';

import Home from './views/mainpage/Home';
import StockProductDashboard from './views/mainpage/StockProductDashboard';
import MaterialRequest from './views/material_request/MaterialRequest';
import MaterialRequestDetail from './views/material_request/MaterialRequestDetail';
import MaterialRequestDetailAdd from './views/material_request/MaterialRequestDetailAdd';
import MRDContainer from './views/material_request/MRDContainer';
import MaterialRequestAdd from './views/material_request/MaterialRequestAdd';

import PRContainer from './views/purchase_request/PRContainer';
import PurchaseRequest from './views/purchase_request/PurchaseRequest';
import PurchaseRequestAdd from './views/purchase_request/PurchaseRequestAdd';
import PurchaseRequestDetailAdd from './views/purchase_request/PurchaseRequestDetailAdd';

import PurchaseOrder from './views/purchase_order/PurchaseOrder';
import PurchaseOrderDetail from './views/purchase_order/PurchaseOrderDetail';
import PurchaseOrderAdd from './views/purchase_order/PurchaseOrderAdd';
import PurchaseOrderChoose from './views/purchase_order/PurchaseOrderChoose';
import PurchaseOrderDetailPR from './views/purchase_order/PurchaseOrderDetailPR';

import GoodReceipt from './views/good_receipt/GoodReceipt';
import GoodReceiptDetail from './views/good_receipt/GoodReceiptDetail';
import GoodReceiptChoose from './views/good_receipt/GoodReceiptChoose';
import GoodReceiptAdd from './views/good_receipt/GoodReceiptAdd';

import MaterialUsage from './views/material_usage/MaterialUsage';
import MaterialUsageAdd from './views/material_usage/MaterialUsageAdd';
import MaterialRequestUsage from './views/material_usage/MaterialRequestUsage';
import MaterialUsageDetailMR from './views/material_usage/MaterialUsageDetailMR';

import MaterialReceipt from './views/material_receipt/MaterialReceipt';
import MaterialReceiptDetail from './views/material_receipt/MaterialReceiptDetail';
import MaterialReceiptAdd from './views/material_receipt/MaterialReceiptAdd';
import MaterialReceiptChoose from './views/material_receipt/MaterialReceiptChoose';

import AdjustmentStock from './views/adjustment_stock/AdjustmentStock';
import AdjustmentStockAdd from './views/adjustment_stock/AdjustmentStockAdd';
import AdjustmentStockDetailAdd from './views/adjustment_stock/AdjustmentStockDetailAdd';

import StockProduct from './views/stock_product/StockProduct';

import Curation from './views/curation/Curation';
import CurationAdd from './views/curation/CurationAdd';
import CurationDetail from './views/curation/CurationDetail';
import CurationChoose from './views/curation/CurationChoose';

import Quotation from './views/quotation/Quotation';
import QuotationDetail from './views/quotation/QuotationDetail';
import QuotationDelivery from './views/quotation/QuotationDelivery';
import GenerateQuotation from './views/quotation/GenerateQuotation';
import GenerateQuotationChoose from './views/quotation/GenerateQuotationChoose';
import VendorRequestQuotation from './views/quotation/VendorRequestQuotation';
import VendorRequestQuotationView from './views/quotation/VendorRequestQuotationView';
import RequestQuotation from './views/quotation/RequestQuotation';
import RequestQuotationChoose from './views/quotation/RequestQuotationChoose';
import RequestQuotationAdd from './views/quotation/RequestQuotationAdd';
import RequestQuotationDetail from './views/quotation/RequestQuotationDetail';

import GoodsReceiptReport from './views/report/GoodsReceiptReport';
import DeliveryReport from './views/report/DeliveryReport';
import TransactionReport from './views/report/TransactionReport';

import Profile from './views/mainpage/Profile';
import OrdersContainer from './views/mainpage/OrdersContainer';
import Orders from './views/mainpage/Orders';
import Notification from './views/mainpage/Notification';
import HomeBegin from './views/mainpage/HomeBegin';
import HomeMain from './views/mainpage/HomeMain';
import SeeMoreContent from './views/mainpage/SeeMoreContent';

import ListOrder from './views/order_page/ListOrder';
import Location from './views/order_page/Location';

import Detail from './views/utilities/Detail';
import Chat from './views/utilities/Chat';

import DetailAc from './views/detail_order/DetailAc';
import DetailNonAc from './views/detail_order/DetailNonAc';

const { width, height } = Dimensions.get("window");
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// const TopTab = createMaterialTopTabNavigator();

const CustomTab = ({ focused, color, size, route }) => {

   const ref = useRef(null);
   let filePath, colorFilter;

   //on focus change the anim will play
   useEffect(() => {
      if (focused && ref.current) {
         ref.current?.play();
      }
   });

   switch (route.name) {
      case 'Home':
         filePath = require(`./assets/anim/2-home.json`);
         colorFilter = [
            { keypath: 'Home', color: focused ? "black" : "grey" },
            { keypath: 'Door', color: focused ? "black" : "grey" },
         ];
         break;
      case 'Order':
         filePath = require(`./assets/anim/2-receipt.json`);
         colorFilter = [
            { keypath: 'Lines', color: focused ? "black" : "grey" },
            { keypath: 'Paper', color: focused ? "black" : "grey" },
         ];
         break;
      case 'Inbox':
         filePath = require(`./assets/anim/2-transaction.json`);
         colorFilter = [
            { keypath: 'Arrows', color: focused ? "black" : "grey" },
            { keypath: 'Rectangle', color: focused ? "black" : "grey" }
         ];
         break;
      case 'Profil':
         filePath = require(`./assets/anim/2-profile.json`);
         colorFilter = [
            { keypath: 'Ellipse', color: focused ? "black" : "grey" },
            { keypath: 'Person', color: focused ? "black" : "grey" }
         ];
         break;
   }

   return (
      <LottieView
         ref={ref}
         loop={false}
         source={filePath}
         autoPlay={false}
         colorFilters={colorFilter} />
   );
};

const config = {
   initialRouteName: 'Main',
   screens: {
      Main: {
         initialRouteName: 'Home',
         screens: {
            Order: 'order',
         }
      },
      Splash: {
         path: 'splash'
      },
      DetailAc: {
         path: 'ac/:order_id/:no_order/:status_id/:withAnimation'
      },
      DetailNonAc: {
         path: 'nonac/:order_id/:no_order/:status_id/:withAnimation'
      },
      PaymentStatus: {
         path: 'ps/:category_id/:order_id/:no_order/:status_id/:withAnimation'
      },
      RedirectPage: {
         path: 'redirect/:res'
      }
   }
}

class Routes extends React.PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         activePage: "Home",
         screen: null
      };
   }

   BottomTabsNav() {
      return (
         <Tab.Navigator
            initialRouteName="Main"
            screenOptions={({ route }) => ({
               tabBarActiveTintColor: 'black',
               tabBarIcon: ({ focused, color, size }) => (
                  <CustomTab focused={focused} color={color} size={size} route={route}></CustomTab>
               ),
               tabBarStyle: {
                  height: 65,
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  position: 'absolute',
                  overflow: 'hidden'
               }
            })}
         // tabBar={props => <TabBarAnimated1 {...props} />}
         >
            <Tab.Screen
               name="Home"
               component={Home}
               // component={HomeAlt}
               initialParams={{
                  nextScreen: 'ProfileMain',
               }}
               options={{
                  tabBarLabelStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 12
                  },
                  tabBarLabel: 'Home',
                  headerShown: false
               }}
            />
            <Tab.Screen
               name="Order"
               component={TabOrder}
               options={{
                  tabBarLabelStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 12,
                  },
                  tabBarLabel: 'Order',
                  headerShown: true,
                  // tabBarIcon: ({ focused, color, size }) => (
                  //    <CustomTab focused={focused} color={color} size={size} route={route}></CustomTab>
                  //    // <Icon
                  //    //    name={focused ? "home" : "home-outline"}
                  //    //    color={color}
                  //    //    size={size}
                  //    // />
                  // ),
                  headerTitle: 'Transaksi Order',
                  headerTitleAlign: 'center',
                  headerTintColor: '#FFF',
                  headerShadowVisible: true,
                  headerStyle: {
                     backgroundColor: '#009BD4'
                  },
                  headerTitleStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 16,
                     color: '#FFF'
                  },
               }}
            />
            <Tab.Screen
               name="Inbox"
               component={OnProgress}
               // component={PaymentStatus}
               options={{
                  tabBarLabelStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 12,
                  },
                  tabBarLabel: 'Inbox',
                  headerShown: true,
                  headerTitle: 'Inbox',
                  headerTitleAlign: 'center',
                  headerTintColor: '#FFF',
                  headerShadowVisible: true,
                  headerStyle: {
                     backgroundColor: '#009BD4'
                  },
                  headerTitleStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 16,
                     color: '#FFF'
                  },
               }}
            />
            <Tab.Screen
               name="Profil"
               component={ProfileMain}
               options={{
                  tabBarLabelStyle: {
                     fontFamily: Fonts.PoppinsSemiBold,
                     fontSize: 12,
                  },
                  tabBarLabel: 'Profil',
                  headerShown: false,
               }}
            />
         </Tab.Navigator>
      );
   }

   render() {
      const { me, navigation } = this.props;

      return (
         <NavigationContainer
            ref={navigationRef}
            linking={{
               prefixes: ["meppogen://"],
               config
            }}>
            <Stack.Navigator
               screenListeners={{
                  state: (e) => {
                     let size = e.data.state.routes.length;
                     // Do something with the state
                     this.setState({
                        // screen: e.data.state.routes[0].name,
                        activePage: e.data.state.routes[size - 1].name,
                     });
                  },
               }}>
               <Stack.Group screenOptions={{ animation: 'simple_push', animationDuration: 5000 }}>

                  {/* Meppo */}
                  <Stack.Screen
                     name="Splash"
                     component={SplashScreen}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Intro"
                     component={IntroPage}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Login"
                     component={Login}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Home"
                     component={Home}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="StockProductDashboard"
                     component={StockProductDashboard}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialRequest"
                     component={MaterialRequest}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialRequestAdd"
                     component={MaterialRequestAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialRequestDetail"
                     component={MaterialRequestDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialRequestDetailAdd"
                     component={MaterialRequestDetailAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MRDContainer"
                     component={MRDContainer}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="PRContainer"
                     component={PRContainer}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseRequest"
                     component={PurchaseRequest}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseRequestAdd"
                     component={PurchaseRequestAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseRequestDetailAdd"
                     component={PurchaseRequestDetailAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="QRScanner"
                     component={QRScanner}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="QRProduct"
                     component={QRProduct}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="DeliveryReport"
                     component={DeliveryReport}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="TransactionReport"
                     component={TransactionReport}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GoodsReceiptReport"
                     component={GoodsReceiptReport}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="PurchaseOrder"
                     component={PurchaseOrder}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseOrderDetail"
                     component={PurchaseOrderDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseOrderAdd"
                     component={PurchaseOrderAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseOrderChoose"
                     component={PurchaseOrderChoose}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="PurchaseOrderDetailPR"
                     component={PurchaseOrderDetailPR}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="GoodReceipt"
                     component={GoodReceipt}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GoodReceiptDetail"
                     component={GoodReceiptDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GoodReceiptChoose"
                     component={GoodReceiptChoose}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GoodReceiptAdd"
                     component={GoodReceiptAdd}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="MaterialUsage"
                     component={MaterialUsage}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialUsageAdd"
                     component={MaterialUsageAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialUsageDetailMR"
                     component={MaterialUsageDetailMR}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialRequestUsage"
                     component={MaterialRequestUsage}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="MaterialReceipt"
                     component={MaterialReceipt}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialReceiptDetail"
                     component={MaterialReceiptDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialReceiptAdd"
                     component={MaterialReceiptAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="MaterialReceiptChoose"
                     component={MaterialReceiptChoose}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="AdjustmentStock"
                     component={AdjustmentStock}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="AdjustmentStockAdd"
                     component={AdjustmentStockAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="AdjustmentStockDetailAdd"
                     component={AdjustmentStockDetailAdd}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="StockProduct"
                     component={StockProduct}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="Curation"
                     component={Curation}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="CurationDetail"
                     component={CurationDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="CurationAdd"
                     component={CurationAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="CurationChoose"
                     component={CurationChoose}
                     options={{
                        headerShown: false
                     }} />

                  <Stack.Screen
                     name="Quotation"
                     component={Quotation}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="QuotationDelivery"
                     component={QuotationDelivery}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="QuotationDetail"
                     component={QuotationDetail}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GenerateQuotation"
                     component={GenerateQuotation}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="GenerateQuotationChoose"
                     component={GenerateQuotationChoose}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="VendorRequestQuotation"
                     component={VendorRequestQuotation}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="VendorRequestQuotationView"
                     component={VendorRequestQuotationView}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="RequestQuotation"
                     component={RequestQuotation}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="RequestQuotationAdd"
                     component={RequestQuotationAdd}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="RequestQuotationChoose"
                     component={RequestQuotationChoose}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="RequestQuotationDetail"
                     component={RequestQuotationDetail}
                     options={{
                        headerShown: false
                     }} />

                  {/* PT */}
                  <Stack.Screen
                     name="SeeMoreContent"
                     component={SeeMoreContent}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="UpdateAccount"
                     component={UpdateAccount}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="UpdatePage"
                     component={UpdatePage}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Chat"
                     component={Chat}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Notification"
                     component={Notification}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Profile"
                     component={Profile}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="HomeMain"
                     component={HomeMain}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="ListOrder"
                     component={ListOrder}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="Location"
                     component={Location}
                     options={{
                        headerShown: false
                     }} />
                  <Stack.Screen
                     name="OrdersChild"
                     component={Orders}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="Orders"
                     component={OrdersContainer}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="Detail"
                     component={Detail}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="DetailAc"
                     component={DetailAc}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="DetailNonAc"
                     component={DetailNonAc}
                     options={{
                        headerShown: false,
                     }} />
                  <Stack.Screen
                     name="HomeBegin"
                     component={HomeBegin}
                     options={{
                        headerShown: false,
                        // headerTitleAlign: 'center',
                        // headerStyle: {
                        //    backgroundColor: '#009BD4',
                        // },
                     }} />
               </Stack.Group>
            </Stack.Navigator>
            {/* <BottomTabs
               bottomTabs={[
                  {
                     icon: HomeIcon,
                     label: "Home",
                  },
                  {
                     icon: ScrollText,
                     label: "Orders",
                  },
                  {
                     icon: User,
                     label: "Profile",
                  },
               ]}
               active={this.state.activePage}
               // navi={this.state.screen}
               isHome={true}
            /> */}
         </NavigationContainer>
      );
   }
}

const mapStateToProps = ({ userSession, accessToken }) => ({
   accessToken,
   me: userSession
});

const mapDispatchToProps = (dispatch) => ({
   saveSession: (user) => dispatch(setUserSession(user)),
   saveAccessToken: (token) => dispatch(setAccessToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes)