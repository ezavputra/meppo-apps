import React, { FunctionComponent, ReactNode } from "react";
import { Animated, StyleSheet, View, ViewStyle, Text } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

export const NAV_HEADER_HEIGHT = 82;
export const NAV_TITLE_HEIGHT = 56;

export const NavBar: FunctionComponent = ({ children }) => {
  const { top: paddingTop } = useSafeArea();

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Animated.View style={[styles.titleContainer]}>{children}</Animated.View>
    </View>
  );
};

export const NavBarTitle = () => (
  <Text style={[styles.title, { color: '#009BD4' }]}>
    PANGGIL
    <Text style={[styles.title, { color: '#f9c015' }]}>
      TUKANG
    </Text>
  </Text>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    zIndex: 10,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: NAV_TITLE_HEIGHT,
    flexGrow: 1,
  },
  title: {
    fontSize: moderateScale(22),
    textAlign: "center",
    fontWeight: "bold",
  }
});
