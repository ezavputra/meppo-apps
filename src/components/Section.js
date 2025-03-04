import React, { Component } from "react";
import { ImageBackground, Animated, Dimensions, Linking } from "react-native";
import { CommonActions } from '@react-navigation/native';
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Image, Text, View, Pressable, ScrollView
} from "@gluestack-ui/themed";
import {
  ChevronRightCircle
} from "lucide-react-native";
import { glueAndroid } from "../config/style-android";
import LinearGradient from 'react-native-linear-gradient';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

class Section extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
      scrollX: new Animated.Value(0)
    };
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

  child() {
    const {
      seemore, items, style, color, widthImage, direction,
      title, textColor, imgBg, imgHead, category,
      subtitle, tag, heightImage, id
    } = this.props;

    var opacityImg = this.state.scrollX.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0]
    });

    var leftImg = this.state.scrollX.interpolate({
      inputRange: [0, 160],
      outputRange: [0, -80]
    });

    return (
      <View key={id + "-section"} style={[style]}>
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
          <View style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: imgBg == null ? null : 'rgba(0,0,0,0.6)',
          }}>
            <View style={{ alignSelf: 'flex-start' }}>
              {title != null && (
                <Text
                  sx={glueAndroid.Global_textTitle}
                  style={{
                    color: textColor == 'dark' ? 'black' : 'white',
                    flexWrap: 'wrap',
                    lineHeight: 30
                  }}>
                  {title}
                </Text>
              )}
              {subtitle != null && (
                <Text
                  sx={glueAndroid.Global_textLight}
                  style={{
                    color: textColor == 'dark' ? 'black' : 'white',
                  }}>
                  {subtitle}
                </Text>
              )}
              {tag != null && (
                <Text
                  sx={glueAndroid.Global_textLightItalicXs}
                  style={{
                    color: textColor == 'dark' ? 'black' : 'white',
                  }}>
                  {tag}
                </Text>
              )}
            </View>
          </View>
          {title && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignSelf: 'flex-end' }}>
                <Pressable
                  key={id + "-pressall"}
                  style={{
                    borderRadius: 10,
                    paddingRight: 12,
                  }}
                  onPress={seemore}>
                  {({ pressed }) => {
                    return (
                      <View style={{
                        borderRadius: 10,
                        paddingHorizontal: 8,
                        marginVertical: 20,
                        backgroundColor: pressed ? '#999999' : '#d0dfea'
                      }}>
                        <Text sx={glueAndroid.Global_textBoldItalicXs}
                          style={{ color: 'black' }}>
                          Lihat Semua
                        </Text>
                      </View>
                    )
                  }}
                </Pressable>
              </View>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {imgHead != null && (
            <Animated.View style={{
              position: 'absolute',
              left: leftImg,
              opacity: opacityImg,
            }}>
              <Image source={imgHead}
                alt={'imghead' + id}
                sx={{
                  "@base": {
                    width: heightImage[0],
                    height: heightImage[0],
                    marginLeft: 10,
                    marginVertical: 10,
                  },
                  "@sm": {
                    width: heightImage[1],
                    height: heightImage[1],
                    marginLeft: 10,
                    marginVertical: 10,
                  },
                  "@md": {
                    width: heightImage[2],
                    height: heightImage[2],
                    marginLeft: 10,
                    marginVertical: 10,
                  },
                }}
                resizeMode='stretch'
              />
            </Animated.View>
          )}
          <ScrollView
            horizontal={direction == 'row' ? true : false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={
              Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { x: this.state.scrollX } }
                  }
                ],
                {
                  useNativeDriver: false  // <- Native Driver used for animated events
                }
              )
            }
            style={{
              zIndex: 999,
            }}
            contentContainerStyle={{
              paddingLeft: imgHead != null ? 16 : 0,
              paddingRight: imgHead != null ? width / 2 : 0
            }}
            sx={{
              "@base": {
                paddingLeft: imgHead != null ? heightImage[0] : 0
              },
              "@sm": {
                paddingLeft: imgHead != null ? heightImage[1] : 0,
              },
              "@md": {
                paddingLeft: imgHead != null ? heightImage[2] : 0
              },
            }}>
            <View
              flexDirection={direction}
              paddingHorizontal={direction == 'row' ? 0 : 10}>
              {items.map((item, index) => {
                return (
                  <Pressable
                    key={id + "-presscat" + index}
                    onPress={() => {
                      this.openLink(item.url)
                    }}
                    sx={{
                      "@base": {
                        paddingVertical: 0
                      },
                      "@sm": {
                        paddingVertical: direction == 'row' ? 0 : 10
                      },
                      "@md": {
                        paddingVertical: direction == 'row' ? 0 : 0
                      },
                    }}>
                    {category == 'article' ? (
                      <View
                        borderRadius={10}
                        marginHorizontal={direction == 'row' ? 10 : 0}
                        marginVertical={direction == 'row' ? 0 : 10}
                        flex={1}
                        flexDirection={direction == 'row' ? "column" : 'row'}
                        style={{
                          elevation: direction == 'row' ? 3 : 0,
                          overflow: 'hidden',
                          marginBottom: 5,
                          backgroundColor: 'white'
                        }}
                        sx={{
                          "@base": {
                            width: direction == 'row' ? "$72" : '$full',
                          },
                          "@sm": {
                            width: direction == 'row' ? width / 1.5 : '$full',
                          },
                          "@md": {
                            width: direction == 'row' ? width / 2 : '$full',
                          },
                        }}>
                        <Image source={item.icon}
                          alt={id + index}
                          sx={{
                            "@base": {
                              width: direction == 'row' ? "$full" : "$32",
                              height: "$24",
                            },
                            "@sm": {
                              width: direction == 'row' ? "$full" : "$64",
                              height: "$40",
                            },
                            "@md": {
                              width: "$full",
                              height: "$32",
                            },
                          }}
                          resizeMode='stretch'
                        />
                        <View style={{
                          flex: 1,
                          paddingVertical: direction == 'row' ? 10 : 0
                        }}
                          sx={{
                            "@base": {
                              padding: 10,
                            },
                            "@sm": {
                              padding: 14
                            },
                            "@md": {
                              padding: 10
                            },
                          }}>
                          {item.title && (
                            <Text
                              sx={glueAndroid.Global_textLightItalicXs}
                              style={{
                                color: textColor == 'dark' ? 'black' : 'white',
                              }}>
                              {item.title}
                            </Text>
                          )}
                          {item.title && (
                            <Text
                              flexWrap="wrap"
                              sx={{
                                "@base": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: direction == 'row' ? "$md" : "$lg",
                                },
                                "@sm": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: direction == 'row' ? "$xl" : "$2xl",
                                  lineHeight: 30,
                                },
                                "@md": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: "$lg",
                                },
                              }}
                              style={{
                                color: textColor == 'dark' ? 'black' : 'white',
                              }}>
                              {item.title}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      ////////  Non Article  //////////
                      <View sx={{
                        "@base": {
                          width: widthImage[0],
                          // height: heightImage[0],
                          margin: direction == 'row' ? 10 : 0,
                        },
                        "@sm": {
                          width: widthImage[1],
                          // height: heightImage[1],
                          margin: direction == 'row' ? 10 : 0,
                        },
                        "@md": {
                          width: widthImage[2],
                          margin: direction == 'row' ? 10 : 0,
                        },
                      }}>
                        <Image
                          alt={id + index}
                          source={item.icon}
                          borderRadius={10}
                          sx={{
                            "@base": {
                              width: widthImage[0],
                              height: heightImage[0],
                            },
                            "@sm": {
                              width: widthImage[1],
                              height: heightImage[1],
                            },
                            "@md": {
                              width: widthImage[2],
                              height: heightImage[2],
                            },
                          }}
                          resizeMode='stretch'
                        />
                        <View style={{
                          flex: 1, paddingTop: item.title ? 10 : 0,
                          paddingVertical: item.title ? 10 : 0
                        }}>
                          {item.title && (
                            <Text
                              flexWrap="wrap"
                              sx={{
                                "@base": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: direction == 'row' ? "$md" : "$lg",
                                  paddingBottom: direction == 'row' ? 0 : 10
                                },
                                "@sm": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: direction == 'row' ? "$xl" : "$2xl",
                                  paddingTop: direction == 'row' ? 10 : 15
                                },
                                "@md": {
                                  fontFamily: "Poppins-SemiBold",
                                  fontSize: "$lg",
                                },
                              }}
                              style={{
                                color: textColor == 'dark' ? 'black' : 'white',
                              }}>
                              {item.title}
                            </Text>
                          )}
                          {item.tag && (
                            <Text
                              sx={glueAndroid.Global_textLightItalicXs}
                              style={{
                                color: textColor == 'dark' ? 'black' : 'white',
                              }}>
                              {item.tag}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </Pressable>
                )
              })}
              {title != null && (
                <Pressable
                  key={id + "-presstitle"}
                  onPress={() => {
                    navigation.navigate({
                      name: 'Intro'
                    });
                  }}
                  style={{ display: direction == 'row' ? 'flex' : "none" }}>
                  {({ pressed }) => {
                    return (
                      <View
                        borderRadius={10}
                        flex={1}
                        flexDirection="column"
                        sx={{
                          "@base": {
                            width: "$24",
                            // height: heightImage[0],
                            margin: direction == 'row' ? category == 'article' ? 0 : 10 : 0,
                            marginVertical: category == 'article' ? 0 : 10,
                            marginRight: 20
                          },
                          "@sm": {
                            width: "$24",
                            height: heightImage[1],
                            margin: direction == 'row' ? category == 'article' ? 0 : 10 : 0,
                            marginVertical: category == 'article' ? 0 : 10,
                            marginRight: 20
                          },
                          "@md": {
                            width: "$24",
                            height: heightImage[2],
                            margin: direction == 'row' ? category == 'article' ? 0 : 10 : 0,
                            marginVertical: category == 'article' ? 0 : 10,
                            marginRight: 20
                          },
                        }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: pressed ? '#999999' : '#d0dfea'
                        }}
                      >
                        <Text sx={glueAndroid.Global_textBaseBold}
                          textAlign="center"
                          color="black"
                          marginBottom={10}>
                          Lihat Semua
                        </Text>
                        <ChevronRightCircle size={24} color="black" />
                      </View>
                    )
                  }}
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }

  render() {
    const {
      seemore, items, style, color, widthImage, direction,
      title, textColor, imgBg, imgHead, category,
      subtitle, tag, heightImage, id
    } = this.props;

    var opacityImg = this.state.scrollX.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0]
    });

    var leftImg = this.state.scrollX.interpolate({
      inputRange: [0, 160],
      outputRange: [0, -80]
    });

    return (
      <LinearGradient
        colors={color}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {imgBg == null ? (
          <View>
            {this.child()}
          </View>
        ) : (
          <ImageBackground
            resizeMode={'stretch'} // or cover
            source={{ uri: imgBg }}
          >
            {this.child()}
          </ImageBackground>
        )}

      </LinearGradient >
    );
  }
}

Section.propTypes = {
  imgHead: PropTypes.any,
  items: PropTypes.array,
  widthImage: PropTypes.array,
  heightImage: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  tag: PropTypes.string,
  imgBg: PropTypes.string,
  textColor: PropTypes.string,
  color: PropTypes.array,
  style: PropTypes.object,
  direction: PropTypes.string,
  category: PropTypes.string,
  id: PropTypes.string,
  seemore: PropTypes.func
};

Section.defaultProps = {
  // caption: "Tambah foto",
  // isFullWidth: false,
  // withoutPick: false,
  // withoutRemove: false
};

export default Section;
