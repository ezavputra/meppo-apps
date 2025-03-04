import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import { toCurrency } from "../_helpers/formatter";
import { Fonts, versi, customData } from "../config/app";

const styles = StyleSheet.create({
  optionSelected: {
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: moderateScale(16),
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10
  },
  optionUnselected: {
    fontFamily: Fonts.PoppinsLight,
    fontSize: moderateScale(16),
    color: 'black',
    textAlign: 'center',
    marginTop: 10
  },
  unselected: {
    fontFamily: Fonts.PoppinsLight,
    backgroundColor: 'white',
    margin: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#009BD4',
    padding: 10,
  },
  selected: {
    fontFamily: Fonts.PoppinsSemiBold,
    backgroundColor: '#009BD4',
    margin: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#009BD4',
  },
});

export default function RadioButton({ data, onSelect }) {
  const [userOption, setUserOption] = useState(null);
  const [initSelected, setInitSeledted] = useState(0);
  const selectHandler = (value) => {
    setInitSeledted(null);
    onSelect(value);
    setUserOption(value.name);
  };
  return (
    <View style={{
      flexDirection: 'row',
      paddingHorizontal: 15
    }}>
      {data.map((item, index) => {
        return (
          <Pressable
            style={[
              initSelected == index ? styles.selected :
                item.name === userOption ? styles.selected : styles.unselected,
              {
                flex: 0.5
              }
            ]}
            onPress={() => selectHandler(item)}
          >
            <Image source={{ uri: item.photo }} resizeMode={"contain"}
              style={{
                width: '50%', height: 30, alignSelf: "center"
              }}
            />
            <Text style={
              initSelected == index ? styles.optionSelected :
                item.name === userOption ? styles.optionSelected : styles.optionUnselected}>
              {item.name}
            </Text>
            <Text style={[
              initSelected == index ? styles.optionSelected :
                item.name === userOption ? styles.optionSelected : styles.optionUnselected,
              {
                marginTop: 2,
                fontSize: moderateScale(12),
              }]}>
              {toCurrency(item.price)}
            </Text>
          </Pressable>
        );
      })}
    </View >
  );
}