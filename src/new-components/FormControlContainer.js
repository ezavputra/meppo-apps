import React, { Component, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { CommonActions } from '@react-navigation/native';
import PropTypes from "prop-types";
import styled from "styled-components";
import { glueAndroid } from "../config/style-android";
import {
  FormControl, FormControlLabel, FormControlLabelText, FormControlHelper,
  FormControlHelperText, FormControlError, FormControlErrorText,
  Input, InputField, InputSlot, InputIcon, Textarea, TextareaInput, Pressable, View, Text
} from "@gluestack-ui/themed";
import {
  EyeIcon, EyeOffIcon
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

class FormControlContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
      scrollX: new Animated.Value(0),
      showPassword: false
    };
  }

  render() {
    const {
      label, helperText, errorText, type, defaultValue, onChangeText, styleInput, value,
      isError, fieldName, style, isDisabled, isReadOnly, isRequired, onPress, widthbox
    } = this.props;

    return (
      <FormControl
        size="lg"
        isDisabled={isDisabled}
        isInvalid={
          isError != null ?
            isError(fieldName) ? true : false
            : false
        }
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        style={[style, { marginVertical: 10, width: widthbox, marginRight: widthbox == '100%' ? 0 : 8 }]}
      >
        <FormControlLabel mb="$1">
          <FormControlLabelText sx={glueAndroid.Global_textBaseBold}>{label}</FormControlLabelText>
        </FormControlLabel>
        {type == "password" && (
          <Input textAlign="center">
            <InputField
              type={this.state.showPassword ? "text" : "password"}
              defaultValue={defaultValue}
              onChangeText={onChangeText} />
            <InputSlot pr="$3" onPress={() => {
              this.setState({ showPassword: !this.state.showPassword })
            }}>
              {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
              <InputIcon
                as={this.state.showPassword ? EyeIcon : EyeOffIcon}
                color="$darkBlue500"
              />
            </InputSlot>
          </Input>
        )}
        {type == "textarea" && (
          <Textarea
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            w="$full"
          >
            <TextareaInput
              sx={glueAndroid.Global_textBase}
              defaultValue={defaultValue}
              onChangeText={onChangeText}
            />
          </Textarea>
        )}
        {type != "textarea" && type != "password" && onPress == null && (
          <Input sx={{
            "@base": {
              h: 40
            },
            "@sm": {
              h: 60
            },
            "@md": {
              h: 60
            },
          }}
            style={styleInput}>
            <InputField
              sx={glueAndroid.Global_textBase}
              type={type}
              defaultValue={defaultValue}
              onChangeText={onChangeText}
              // value={value == "" ? defaultValue : value}
              pass
              autoCapitalize={type == 'email' ? "none" : "words"}
              keyboardType={type == 'number' ? 'number-pad' :
                type == 'phone' ? 'phone-pad' :
                  type == 'email' ? 'email-address' : 'default'}
            />
          </Input>
        )}
        {onPress != null && (
          <Pressable
            style={{
              width: '100%',
              elevation: 1
            }}
            onPress={onPress}>
            {({ pressed }) => {
              return (
                <View
                  sx={{
                    "@base": {
                      paddingVertical: 10,
                      paddingHorizontal: 11
                    },
                    "@sm": {
                      paddingVertical: 16,
                      paddingHorizontal: 11
                    },
                    "@md": {
                      paddingVertical: 16,
                      paddingHorizontal: 11
                    },
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: pressed ? '#eff2f3' : '#bfc2c2',
                    borderRadius: 5
                  }}>
                  <Text sx={glueAndroid.Global_textBase}>{defaultValue}</Text>
                </View>
              )
            }}
          </Pressable>
        )}
        <FormControlHelper>
          <FormControlHelperText sx={glueAndroid.Global_textLightItalicXs}>{helperText}</FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          {isError != null && (
            isError(fieldName) && (
              <FormControlErrorText sx={glueAndroid.Global_textBase}>
                {errorText}
              </FormControlErrorText>
            )
          )}
        </FormControlError>
      </FormControl >
    );
  }
}

FormControlContainer.propTypes = {
  type: PropTypes.any,
  defaultValue: PropTypes.any,
  style: PropTypes.any,
  styleInput: PropTypes.any,
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  fieldName: PropTypes.string,
  onChangeText: PropTypes.func,
  onPress: PropTypes.func,
  isError: PropTypes.func,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  widthbox: PropTypes.number,
  value: PropTypes.any
};

FormControlContainer.defaultProps = {
  defaultValue: "",
  value: "",
  type: "text",
  helperText: "",
  errorText: "",
  label: "",
  widthbox: "100%",
  onChangeText: null,
  onPress: null,
  isError: null,
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
};

export default FormControlContainer;
