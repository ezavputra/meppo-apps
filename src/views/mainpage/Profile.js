import React, { Component } from 'react';
import { CommonActions } from '@react-navigation/native';
import { StatusBar, Dimensions, Platform, Linking, StyleSheet, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import axios from 'axios';
import { stylesIos } from "../../config/style-ios";
import _ from "lodash";
import moment from "moment";
import { glueAndroid } from "../../config/style-android";
import { baseURL, Fonts, versi } from "../../config/app";
import PropTypes from "prop-types";
import {
  Box, Image, Text, View, ScrollView, Pressable,
  AvatarGroup, Avatar, AvatarBadge, AvatarImage, AvatarFallbackText,
  Modal, ModalBackdrop, ModalContent, ModalBody, ModalHeader, ModalCloseButton,
} from "@gluestack-ui/themed";
import { List } from 'react-native-paper';
import {
  ChevronRight, UserCog, Info, BookText, Star, Users, Instagram, Facebook, Globe2, Phone, Youtube, LogOut, Apple, Smartphone,
  XCircle
} from "lucide-react-native";
import NavigationService from "../../../NavigationService";
import Clipboard from '@react-native-clipboard/clipboard';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  setAccessToken,
  setAlert,
  setLoading,
  setUserSession,
  setSettings,
  setOrderPaymentSurveyCount,
} from "../../store/actionCreators";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: "#e74c3c",
    marginLeft: 4
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center'
  },
  containerStyle: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
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
    fontSize: 14,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  textLightRegular: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsLight,
  },
  textLightSmall: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsLight,
  }
});

class Notification extends Component {
  constructor(props) {
    super(props);
    const { me } = this.props;

    this.state = {
      currentSlideIndex: 0,
      modalStart: false,
      profilepicture: baseURL + "/attachments/foto_user/original/" + me.photo
    };
  }

  // Mount User Method
  async componentDidMount() {
    const { navigation, me, saveSession } = this.props;

  }

 async saveimage(payloads) {
    const { me, saveSession } = this.props;
    try {
       console.warn(payloads);
      const response = await axios.post("/customer/updatephoto", payloads,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'multipart/form-data',
          }
        });
      this.setState({
        profilepicture: baseURL + "/attachments/foto_user/original/" + response.data.data.photo
      });
      me.photo = response.data.data.photo;
      saveSession(me);
    } catch (error) {
      console.error(error);
    }
  }

  getSocialSignIn(social_id) {
    if (social_id.length > 16) {
      if (social_id.includes(".")) {
        return (
          <React.Fragment>
            <Smartphone style={{ color: '#000', marginRight: 10 }} />
            <Text style={[styles.textTitle, { fontSize: 12 }]}> Telah connect dengan Apple ID</Text>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Smartphone style={{ color: '#000', marginRight: 10 }} />
            <Text style={[styles.textTitle, { fontSize: 12 }]}> Telah connect dengan Google</Text>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          <Smartphone style={{ color: '#000', marginRight: 10 }} />
          <Text style={[styles.textTitle, { fontSize: 12 }]}> Telah connect dengan Facebook</Text>
        </React.Fragment>
      )
    }
  }

  renderButton(key, text, pressedbg, bg, textcolor, action) {
    return (
      <Pressable
        key={key}
        style={{
          marginTop: 8
        }}
        onPress={action}>
        {({ pressed }) => {
          return (
            <View style={{
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 6,
              backgroundColor: pressed ? pressedbg : bg
            }}>
              <Text sx={glueAndroid.Global_textBaseBold}
                style={{
                  color: textcolor
                }}>
                {text}
              </Text>
            </View>
          )
        }}
      </Pressable>
    )
  }

  render() {
    const { navigation, me } = this.props;

    // If data finish load
    return (
      <View style={{ flex: 1, backgroundColor: '#e6f5fb' }}>
        <StatusBar backgroundColor={'rgba(52, 52, 52, 0)'} barStyle="dark-content" translucent />

        <View style={{ height: 40 }}>
        </View>

        <View
          style={{
            flexDirection: 'row',
            margin: 16,
            padding: 16,
            borderRadius: 10,
            backgroundColor: '#009BD4'
          }}>
          <Pressable
            onPress={() => {
              this.setState({ modalStart: true });
            }}>
            {({ pressed }) => {
              return (
                <Avatar bgColor="$amber600" size="lg" borderRadius="$full">
                  <AvatarFallbackText>{me.customer.fullname}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: this.state.profilepicture,
                    }}
                  />
                </Avatar>
              )
            }}
          </Pressable>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: 10
          }}>
            <Text sx={glueAndroid.Global_textBaseBold}
              style={{
                textTransform: 'capitalize',
                color: 'white'
              }}>
              {me.customer.fullname}
            </Text>
            <View>
              <Text sx={glueAndroid.Global_textLightItalic}
                style={{
                  color: 'white'
                }}>
                {me.customer.phone}
              </Text>
              <Text sx={glueAndroid.Global_textLightItalic}
                style={{
                  color: 'white'
                }}>
                {me.email}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={{ marginVertical: 15, marginBottom: 500 }}>
            <List.Section>
              <List.Subheader style={[styles.textTitle]}>Info</List.Subheader>
              <List.Item
                title="Edit Profil"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <UserCog {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() =>
                  this.props.navigation.navigate("UpdateAccount")
                }
              />
              <List.Item
                title="Info Aplikasi"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Info {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => Linking.openURL("https://panggiltukang.id/info-aplikasi")}
              />
              <List.Item
                title="Kebijakan Layanan"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <BookText {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => Linking.openURL("https://panggiltukang.id/kebijakan-layanan")}
              />
              <List.Item
                title="Beri Ulasan PanggilTukang"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Star {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() =>
                  Linking.openURL("market://details?id=com.panggiltukangcustomer")
                }
              />
            </List.Section>
            <List.Section>
              <List.Subheader style={[styles.textTitle]}>Media Sosial</List.Subheader>
              <List.Item
                title={"Referral : " + me.referral_id}
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Users {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => {
                  Clipboard.setString(me.referral_id);
                  ToastAndroid.show("Berhasil Copy", ToastAndroid.SHORT);
                }}
              />
              <List.Item
                title="Follow Us on Instagram"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Instagram {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={
                  () => Linking.canOpenURL("instagram://user?username=panggiltukangid")
                    .then((canOpen) => {
                      if (canOpen) {
                        Linking.openURL("instagram://user?username=panggiltukangid");
                      } else {
                        Linking.openURL("https://www.instagram.com/panggiltukangid");
                      }
                    })
                }
              />
              <List.Item
                title="Subscribe Our Facebook"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Facebook {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => Linking.openURL("fb://page/1966729986691004")}
              />
              <List.Item
                title="Web PanggilTukang"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Globe2 {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => Linking.openURL("https://panggiltukang.id")}
              />
              <List.Item
                title="WhatsApp CS PanggilTukang"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Phone {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() =>
                  Linking.openURL('whatsapp://send?text=Halo%20CS%20PanggilTukang,%20%0A%0ANama%20:%20' + me.customer.fullname +
                    '%0AEmail%20:%20' + me.email + '%0AAlamat%20:%20' + me.customer.address + '&phone=' + CSPhone)
                }
              />
              <List.Item
                title="Watch Us on YouTube"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <Youtube {...props} />}
                right={props => <ChevronRight {...props} />}
                onPress={() => Linking.openURL("https://www.youtube.com/channel/UCi0e6zvLdr6fPK3Inawq_QA")}
              />
            </List.Section>

            <List.Section>
              <List.Subheader
                style={[styles.textTitle, { alignSelf: 'flex-end' }]}
              >
                Versi {versi}
              </List.Subheader>
              <List.Item
                title="Logout"
                titleStyle={[styles.textTitle]}
                style={{ marginHorizontal: 15 }}
                left={props => <LogOut {...props} />}
                onPress={() => NavigationService.logout(navigation)}
              />
            </List.Section>
            <View style={{
              marginVertical: 10, alignItems: 'center', marginHorizontal: 15,
              justifyContent: 'center', flexDirection: 'row'
            }}>
              {this.getSocialSignIn(me.social_id)}
            </View>
          </View>
        </ScrollView>

        <Modal
          isOpen={this.state.modalStart}
          onClose={() => {
            this.setState({ modalStart: false })
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            <View style={{
              padding: 16,
              backgroundColor: 'white'
            }}>
              <Pressable
                key={"closemodal"}
                style={{
                  alignSelf: 'flex-end'
                }}
                onPress={() => {
                  this.setState({ modalStart: false })
                }}>
                <XCircle color='black' />
              </Pressable>
              <View style={{
                marginTop: 10,
                alignItems: 'center',
                backgroundColor: 'white'
              }}>
                <Avatar mb={20} bgColor="$amber600" size="2xl" borderRadius="$full">
                  <AvatarFallbackText>{me.customer.fullname}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: this.state.profilepicture,
                    }}
                  />
                </Avatar>
                {this.renderButton(
                  "imagepicker", "Ganti Dari Gallery", "#66c3e5", "#009BD4", 'white',
                  () => {
                    const options = {
                      mediaType: 'photo',
                      includeBase64: false,
                      maxHeight: height,
                      maxWidth: width,
                    };

                    launchImageLibrary(options, (response) => {
                      if (response.didCancel) {
                        console.log('User cancelled image picker');
                      } else if (response.error) {
                        console.log('Image picker error: ', response.error);
                      } else {
                        let imageUri = response.uri || response.assets?.[0]?.uri;

                        // const date = moment(new Date()).format("YYYYMMDDHmm");
                        // const photoPayloads = {
                        //   photo: {
                        //     uri: imageUri,
                        //     type: 'image/*',
                        //     name: date + "_" + me.customer.id
                        //   }
                        // };

                        const formData = new FormData();
                        const date = moment(new Date()).format("YYYYMMDDHmm");
                        // var file = date + '_' + response.fileName.replace('rn_image_picker_lib_temp_', '');

                        const photoPayloads = {
                          uri: imageUri,
                          type: 'image/*',
                          name: date + "_" + me.customer.id
                        };
                        formData.append(`photo`, photoPayloads);

                        this.saveimage(formData);
                        // this.setState({
                        //   profilepicture: imageUri
                        // });
                      }
                    });
                  }
                )}
                {this.renderButton(
                  "camera", "Ganti Dari Camera", "#66c3e5", "#009BD4", 'white',
                  () => {
                    const options = {
                      mediaType: 'photo',
                      includeBase64: false,
                      maxHeight: height,
                      maxWidth: width,
                    };

                    launchCamera(options, response => {
                      if (response.didCancel) {
                        console.log('User cancelled camera');
                      } else if (response.error) {
                        console.log('Camera Error: ', response.error);
                      } else {
                        let imageUri = response.uri || response.assets?.[0]?.uri;
                        // setSelectedImage(imageUri);
                        console.warn(imageUri);
                      }
                    });
                  }
                )}
                {this.renderButton(
                  "closemodal", "Tutup", "#e6f5fb", "white", 'black',
                  () => {
                    this.setState({ modalStart: false })
                  }
                )}
              </View>
            </View>
          </ModalContent>
        </Modal>
      </View>
    );
  }
}

Notification.propTypes = {
  saveSettings: PropTypes.func,
  saveSession: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);