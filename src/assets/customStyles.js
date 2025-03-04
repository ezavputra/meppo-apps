import { Dimensions, PixelRatio, Platform, StyleSheet } from "react-native";
import { Fonts } from "../config/app";
const { height } = Dimensions.get("window");

export function normalize(size) {
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
  }
}

export function paddingHome() {
  if (Platform.OS === "ios") {
    return 20;
  } else {
    return 0;
  }
}

const customStyles = StyleSheet.create({
  mini: {
    fontSize: normalize(10),
    color: "#1E5985",
  },
  small: {
    fontSize: normalize(13),
    color: "#1E5985",
    fontFamily : Fonts.PoppinsRegular
  },
  smalldanger:{
    fontSize: normalize(13),
    color: "red",
    fontFamily : Fonts.PoppinsRegular
  },
  smallbold: {
    fontSize: normalize(13),
    color: "#1E5985",
    fontFamily : Fonts.PoppinsSemiBold
    },
  standard :{
    fontSize: normalize(14),
    color: "#000",
    fontFamily : Fonts.Poppins
  },  
  regular :{
    fontSize: normalize(12),
    color: "#000",
    fontFamily : Fonts.Poppins
  },
  fontTitle :{
    fontSize: normalize(20),
    color: "#000",
    fontFamily : Fonts.PoppinsSemiBold
  }, 
  standardwhite :{
    fontSize: normalize(15),
    color: "#fff",
    fontFamily : Fonts.PoppinsRegular
  },  
  standardbold :{
    fontSize: normalize(14),    
    fontFamily : Fonts.PoppinsSemiBold
  }, 
  medium: {
    fontFamily : Fonts.PoppinsSemiBold,
    fontSize: normalize(15),
    color: "#1E5985",
  },
  mediumbold: {
    fontSize: normalize(15),
    color: "#000",
    fontFamily : Fonts.PoppinsSemiBold
  },
  large: {
    fontSize: normalize(18),
    color: "#1E5985",
    fontFamily: Fonts.Poppins
  },
  largebold: {
    fontSize: normalize(18),
    color: "#000",
    fontFamily: Fonts.PoppinsSemiBold
  },
  xlarge: {
    fontSize: normalize(22)
  },
  xxlarge: {
    fontSize: normalize(24),
    color: "#1E5985",
  },
  xxxlarge: {
    fontSize: normalize(26),
    color: "#1E5985",
  },
  monster: {
    fontSize: normalize(32),
    color: "#1E5985",
  },
  topPaddingHomeSlider: {
    paddingTop: paddingHome()
  },
  splash: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    
  },
  container: {
    backgroundColor: "#FFF",
  },
  buttonHomeLeft: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    margin: "2%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    width: "46%",
  },
  buttonHomeRight: {
    flex: 0.8,
    flexDirection: "column",
    borderRadius: 10,
    left: 10,
    height: height * 0.20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  containerMap: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  cover: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80
  }
});

export default customStyles;
