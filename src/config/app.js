import {
	StyleSheet
} from 'react-native';

// Development
// export const baseURL = "http://192.168.18.38:8000";
// export const baseURL = "http://192.168.100.122:8000";
// export const baseURL = "https://purchasing.filament.my.id";
// export const baseURL = "https://test.manunggaljasa.com";
export const baseURL = "https://meppo-app.com";
export const customData = require('../../env.json');
//export const baseURL = customData.API_URL;
export const versi = "4.0.0";
export const apiURL = baseURL + "/api";
export const API = baseURL + "/api";
export const fcmLegacyServerKey = customData.fcmLegacyServerKey;
export const twitterConsumerKey = customData.twitterConsumerKey;
export const twitterConsumerSecret = customData.twitterConsumerSecret;
export const Fonts = {
	Poppins: 'Poppins-Regular',
	PoppinsItalic: 'Poppins-Italic',
	PoppinsLight: 'Poppins-Light',
	PoppinsLightItalic: 'Poppins-LightItalic',
	PoppinsSemiBold: 'Poppins-SemiBold',
	PoppinsSemiBoldItalic: 'Poppins-SemiBoldItalic',
	PoppinsBold: 'Poppins-Bold',
	PoppinsBoldItalic: 'Poppins-BoldItalic',
	PoppinsExtraBold: 'Poppins-ExtraBold',
	PoppinsExtraBoldItalic: 'Poppins-ExtraBoldItalic',
	PanggilTukangFonts: 'Rounds-Black',
}
export const styles = StyleSheet.create({
	errorText: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsLight,
		color: "#e74c3c"
	},
	containerStyle: {
		flexDirection: 'row',
		flex: 1,
		padding: 10,
		paddingLeft: 15,
		backgroundColor: '#fff'
	},
	lastItemStyle: {
		flexDirection: 'row',
		flex: 1,
		padding: 10,
		paddingLeft: 15,
		backgroundColor: '#fff'
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		overflow: 'hidden',
	},
	modalView: {
		margin: 50,
		backgroundColor: "white",
		borderRadius: 5,
		padding: 15,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		textAlign: "center",
		fontSize: 14,
		fontFamily: Fonts.PoppinsSemiBold,
	},
	imageStyle: {
		width: 50,
		height: 50,
		marginRight: 20
	},
	textStyle: {
		flex: 2,
		justifyContent: 'center'
	},
	priceStyle: {
		backgroundColor: '#ddd',
		width: 80,
		alignItems: 'center',
		marginTop: 3,
		borderRadius: 3
	},
	counterStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	SwiperDotBg: {
		bottom: 30,
	},
	SwiperItem: {
		flex: 1, marginHorizontal: 30, marginVertical: 10
	},
	textTitle: {
		fontSize: 16,
		fontFamily: Fonts.PoppinsSemiBold,
		color: '#000'
	},
	textStatus: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsSemiBold,
		color: '#FFFFFF'
	},
	textBoldRegular: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsSemiBold,
	},
	textLightRegular: {
		fontSize: 14,
		fontFamily: Fonts.PoppinsLight,
	},
	textLightSmall: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsLight,
	},
	textBoldItalic: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsSemiBoldItalic,
	},
	textRegularItalic: {
		fontSize: 12,
		fontFamily: Fonts.PoppinsItalic,
	}
});