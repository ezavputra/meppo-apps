import React from "react";
import { useBackHandler } from '@react-native-community/hooks';
import { HStack, Icon, Pressable, Text, VStack, View } from "@gluestack-ui/themed";
import ModalBottom from "./ModalBottom";
import { Dimensions } from 'react-native';
import { glueAndroid } from "../config/style-android";
import * as RootNavigation from './RootNavigation';
import { CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;

const BottomTabs = ({
  bottomTabs, active, isHome
}: any) => {
  const [activeTab, setActiveTab] = React.useState(active);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionsheetVisible, setActionsheetVisible] = React.useState(false);

  useBackHandler(() => {
    setActiveTab(active);
    // let the default thing happen
    return false;
  });

  return (
    <>
      <View
        alignContent="center"
        position="absolute"
        backgroundColor="transparent"
        elevation={15}
        bottom={0}
        w="100%"
        flexDirection="row"
        display={active == "Home" || active == "Profile" || active == "Orders" ? "flex" : "none"}
        sx={{
          "@base": {
            padding: isHome ? 0 : 20
          },
          "@sm": {
            padding: isHome ? 0 : 30
          },
          "@md": {
            padding: isHome ? 0 : 30
          },
        }}
      >
        {bottomTabs.map((tab: any, index: any) => {
          return (
            <Pressable
              key={tab.label}
              onPress={() => {
                if (tab.label !== "Listing" && tab.label !== "Filter") {
                  setActiveTab(tab.label);
                  let routes = [];
                  if (tab.label == "Home") {
                    routes = [
                      { name: "Home", }
                    ];
                  } else {
                    routes = [
                      { name: "Home", },
                      { name: tab.label, },
                    ];
                  }
                  const resetAction = CommonActions.reset({
                    index: routes.length == 1 ? 0 : 1,
                    routes: routes
                  });
                  if (RootNavigation.getCurrentRouteName() != tab.label) {
                    if (tab.label != "Home") {
                      RootNavigation.dispatch(resetAction);
                    } else {
                      RootNavigation.goBack();
                    }
                  }
                }
                if (tab.label === "Listing") {
                  setModalVisible(true);
                }
                if (tab.label === "Filter") {
                  setActionsheetVisible(true);
                }
              }}
              disabled={tab.disabled}
              opacity={tab.disabled ? 0.5 : 1}
              sx={{
                "@base": {
                  width: (windowWidth / bottomTabs.length) - (isHome ? 0 : 20)
                },
                "@sm": {
                  width: (windowWidth / bottomTabs.length) - (isHome ? 0 : 30)
                },
                "@md": {
                  width: (windowWidth / bottomTabs.length) - (isHome ? 0 : 30)
                },
              }}
              style={{ overflow: 'hidden' }}
            >
              {({ pressed }) => {
                return (
                  <VStack
                    // py="$1.5"
                    // px={10}
                    // borderTopStartRadius={index == 0 ? 10 : 0}
                    // borderBottomStartRadius={index == 0 ? isHome ? 0 : 10 : 0}
                    // borderTopEndRadius={index == bottomTabs.length - 1 ? 10 : 0}
                    // borderBottomEndRadius={index == bottomTabs.length - 1 ? isHome ? 0 : 10 : 0}
                    elevation={3}
                  // alignItems="center" 
                  // bg={pressed ? "$coolGray200" : "transparent"}
                  >
                    <LinearGradient
                      colors={[
                        active === tab.label ? pressed ? "#e6e6e6" : "#80bed5" :
                          pressed ? "#e6e6e6" : "white",
                        active === tab.label ? pressed ? "#e6e6e6" : "white" :
                          pressed ? "#e6e6e6" : "white",
                        pressed ? "#e6e6e6" : "white"
                      ]}
                      style={{
                        flex: 1,
                        elevation: 10,
                        padding: 8,
                        alignItems: 'center',
                        borderRadius: 10,
                        borderTopLeftRadius: index == 0 ? 10 : 0,
                        borderBottomLeftRadius: index == 0 ? isHome ? 0 : 10 : 0,
                        borderTopRightRadius: index == bottomTabs.length - 1 ? 10 : 0,
                        borderBottomRightRadius: index == bottomTabs.length - 1 ? isHome ? 0 : 10 : 0
                      }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <Icon
                        as={tab.icon}
                        color={
                          active === tab.label ? "black" : "$textLight400"
                        }
                        size={"lg"}
                      />
                      <Text
                        mt={5}
                        size="xs"
                        fontFamily={
                          active === tab.label ? "Poppins-SemiBold" : "Poppins-Regular"
                        }
                        color={
                          active === tab.label ? "$textLight900" : "$textLight400"
                        }
                        sx={{
                          _dark: {
                            color:
                              active === tab.label
                                ? "$textDark100"
                                : "$textLight400",
                          },
                        }}
                      >
                        {tab.label}
                      </Text>
                    </LinearGradient>
                  </VStack>
                );
              }}
            </Pressable>
          );
        })}
      </View>
      {modalVisible && (
        <ModalBottom
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      {actionsheetVisible && (
        <ModalBottom
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
  );
};

export default BottomTabs;