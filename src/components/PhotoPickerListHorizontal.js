import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PhotoPicker from "../components/PhotoPicker";
import { View } from 'react-native';

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${({marginTop}) => marginTop || 0}px;
  margin-horizontal: -5px;
`;

class PhotoPickerListHorizontal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
  }

  render() {
    const {
      items,
      onPickItem,
      onRemoveItem,
      isFullWidth,
      marginTop,
      withoutPick,
      withoutRemove
    } = this.props;

    return (
      <View style={this.props.style}>
        {items.map((item, index) => (
          <PhotoPicker
            key={index}
            source={item ? {uri: item.uri} : null}
            isFullWidth={isFullWidth}
            onPress={item ? item.onPress : null}
            onPick={uri => onPickItem(uri, index)}
            onRemove={uri => onRemoveItem(index)}
            withoutPick={withoutPick}
            withoutRemove={withoutRemove}
            style={this.props.stylePicker}
          />
        ))}
      </View>
    );
  }
}

PhotoPickerListHorizontal.propTypes = {
  items: PropTypes.array,
  onPickItem: PropTypes.func,
  onRemoveItem: PropTypes.func,
  isFullWidth: PropTypes.bool,
  marginTop: PropTypes.number,
  withoutPick: PropTypes.bool,
  withoutRemove: PropTypes.bool,
  style: PropTypes.object,
  stylePicker: PropTypes.object
};

PhotoPickerListHorizontal.defaultProps = {
  caption: "Tambah foto",
  isFullWidth: false,
  withoutPick: false,
  withoutRemove: false
};

export default PhotoPickerListHorizontal;
