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
        textAlign: 'center'
    },
    optionUnselected: {
        fontFamily: Fonts.PoppinsLight,
        fontSize: moderateScale(16),
        color: 'black',
        textAlign: 'center'
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

export default function RadioButtonText({ data, selected, onSelect, margin = 6, padding = 10 }) {
    const [userOption, setUserOption] = useState(null);
    const [initSelected, setInitSeledted] = useState(selected);
    const selectHandler = (value) => {
        setInitSeledted(null);
        onSelect(value);
        setUserOption(value.label);
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
                                item.label === userOption ? styles.selected : styles.unselected,
                            {
                                flex: 0.5,
                                margin: margin,
                                padding: padding
                            }
                        ]}
                        onPress={() => selectHandler(item)}
                    >
                        <Text style={
                            initSelected == index ? styles.optionSelected :
                                item.label === userOption ? styles.optionSelected : styles.optionUnselected}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View >
    );
}