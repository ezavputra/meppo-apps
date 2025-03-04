import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const Fonts = {
    // Poppins:'Poppins-Regular',
    // PoppinsLight:'Poppins-Light',
    // PoppinsSemiBold:'Poppins-SemiBold',
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

export const stylesIos = {
    Intro_mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Intro_text: {
        fontFamily: Fonts.PoppinsLight,
        color: 'black',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        marginTop: -2,
        height: 60
    },
    Intro_title: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 22,
        color: '#555',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: -25
    },
    Intro_buttonCircle: {
        width: '100%',
        padding: 20,
        // height: 40,
        backgroundColor: '#009BD4',
        borderRadius: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    Intro_buttonCircleDone: {
        width: '100%',
        padding: 20,
        // backgroundColor: 'rgba(0, 0, 0, .2)',
        // elevation: 10,
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Login_ImgBackground: {
        backgroundColor: "#FFF",
        justifyContent: "center",
    },
    Login_LinearGrad: {
        justifyContent: "center"
    },
    Login_View1: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
    },
    Login_View2: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 5,
        paddingRight: 5,
    },
    Login_View3: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 100,
    },
    Login_title: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 24,
        marginHorizontal: 15,
        textAlign: "left",
        color: "#FFF",
    },
    Login_subtitle: {
        fontFamily: Fonts.PoppinsLight,
        fontStyle: "normal",
        fontWeight: "normal",
        marginHorizontal: 15,
        textAlign: "left",
        fontSize: 14,
        color: "#FFF",
    },
    Login_buttonView: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 25,
        margin: 10,
    },
    Login_buttonView1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Login_loginButton: {
        height: 50,
        backgroundColor: '#CF4332',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    Login_buttonText: {
        color: 'white',
        fontSize: 16,
        textTransform: 'uppercase',
        fontFamily: Fonts.PoppinsSemiBold,
        marginLeft: 10,
        fontSize: 16,
        color: 'white'
    },
    Login_bottomText: {
        color: "#fff",
        fontFamily: Fonts.PoppinsLight,
        textAlign: 'center',
        marginHorizontal: 10,
        fontSize: 12,
        marginTop: 20
    },
    Login_bottomText2: {
        color: "#009BD4",
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 12,
        textAlign: 'center',
    },
    Login_bottomText3: {
        color: "#fff",
        fontFamily: Fonts.PoppinsLight,
        fontSize: 12
    },

    UpdatePage_icon: {
        marginTop: 70,
        width: width,
        height: 200,
    },

    //Home 
    Home_slide: {
        flex: 1,
        height: 280,
        overflow: "hidden",
        // borderRadius: 10,
        // marginTop: 15,
        // marginLeft: 5,
        // marginBottom: 10,
    },
    Home_icon: {
        alignSelf: "center",
        width: 50,
        height: 40,
    },
    Home_containernews: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 80,
        padding: 5,
    },
    Home_horizontalnews: {
        marginLeft: 15,
        marginBottom: 10,
        marginTop: 15,
    },

    //Order City Not Found
    OCNF_primarybtn: {
        width: '100%',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    OCNF_primarypress: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
    },

    snackbar: {
        width: '100%',
        marginBottom: 30,
    },

    //Order Form
    OF_primarybtn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        marginTop: 20
    },
    OF_primarypress: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
    },
    OF_titleText: {
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#000',
        fontSize: 14,
    },
    OF_regularText: {
        fontFamily: Fonts.PoppinsLight,
        fontSize: 12,
    },

    //Order Main
    OM_qtyitem: {
        fontFamily: Fonts.PoppinsSemiBold,
        color: '#fff',
        paddingTop: 3,
        marginRight: 10,
    },
    OM_btnarrow: {
        fontSize: 24,
    },
    OM_priceperunit: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 14,
        color: '#000',
    },

    //Order Detail City
    ODC_primarybtn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5
    },
    ODC_waktumain: {
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ODC_waktuchild: {
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        // marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ODC_colwaktu: {
        paddingHorizontal: 20,
    },
    ODC_typedesc: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 12,
        color: '#000',
    },
    ODC_btnadd: {
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 2,
    },

    //Take Voucher
    TV_primarybtn: {
        flex: 0.2,
        height: 50,
        resizeMode: 'contain',
    },
    TV_checkcircle: {
        marginLeft: 20,
        color: "#29c22e",
        fontSize: 12,
    },
    TV_closeicon: {
        color: "#fff",
        fontSize: 12,
    },
    TV_couponname: {
        fontFamily: Fonts.PoppinsSemiBold,
        fontSize: 14,
        paddingLeft: 5,
        color: "#FFF",
        textTransform: 'uppercase',
        alignSelf: 'center',
    },
    TV_couponmain: {
        width: '100%',
        height: 60,
        justifyContent: "center",
        marginTop: 10,
    },


    //Detail AC
    DAC_tukangphoto: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    DAC_ratingicon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    }
};