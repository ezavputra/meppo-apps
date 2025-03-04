import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";
import ImagePicker from "react-native-image-picker";
import CropPicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { moderateScale } from "react-native-size-matters";

const widthScreen = Dimensions.get("window").width;

const Container = styled.TouchableOpacity`
  padding: 5px 7px;
`;

const StyledAddIcon = styled(Icon)`
  font-size: 32px;
`;

const StyledIcon = styled(Icon)`
  font-size: 14px;
`;

const FieldPhotoPicker = styled.View`
  background-color: white;
  border-radius: 10px;
  elevation: 4;
  padding: 18px;
  height: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale((widthScreen - (widthScreen <= 360 ? 30 : 46)) / 2)
      : 80}px;
  width: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale(widthScreen - (widthScreen <= 360 ? 30 : 46))
      : 80}px;
  align-self: flex-start;
  justify-content: center;
  align-items: center;
`;

const PhotoViewPicker = styled.View`
  border-radius: 10px;
  elevation: 4;
  align-self: flex-start;
  justify-content: center;
  align-items: center;
  height: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale((widthScreen - (widthScreen <= 360 ? 30 : 46)) / 2)
      : 80}px;
  width: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale(widthScreen - (widthScreen <= 360 ? 30 : 46))
      : 80}px;
  overflow: hidden;
  position: relative;
`;

const PhotoRemoveContainer = styled.TouchableOpacity`
  background-color: #e74c3c;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 5px;
  top: 5px;
  height: 17px;
  width: 17px;
`;

const PhotoView = styled.Image`
  height: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale((widthScreen - (widthScreen <= 360 ? 30 : 46)) / 2)
      : 100}px;
  width: ${({ isFullWidth }) =>
    isFullWidth
      ? moderateScale(widthScreen - (widthScreen <= 360 ? 30 : 46))
      : 100}px;
  resize-mode: cover;
`;

export class PhotoPicker extends Component {
  constructor(props) {
    super(props);

    this.pick = this.pick.bind(this);
  }

  pick() {
    const { onPick } = this.props;

    const options = {
      title: "Pilih Foto",
      takePhotoButtonTitle: "Ambil Foto...",
      mediaType: "photo",
      storageOptions: {
        privateDirectory: true,
        skipBackup: true,

        // path: 'Image_test_',
      },
      quality: 0.7,
      maxWidth: 500,
      maxHeight: 500,
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
        console.error(response.error);
      } else {
        // CropPicker.openCropper({
        //   path: response.uri,
        //   width: 320,
        //   height: 320,
        //   cropperToolbarTitle: "Crop Foto"
        // }).then(image => {
        // console.warn(response.uri);
        onPick(response.uri);
        // });
      }
    });
  }

  render() {
    const {
      source,
      onPress,
      onRemove,
      isFullWidth,
      withoutPick,
      withoutRemove
    } = this.props;

    return (
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={withoutPick ? 1 : 0.2}
        onPress={withoutPick || onPress ? onPress : this.pick}
      >
        {!source ? (
          <FieldPhotoPicker isFullWidth={isFullWidth}>
            <StyledAddIcon name="camera" color="#C4C4C4" />
          </FieldPhotoPicker>
        ) : (
          <PhotoViewPicker isFullWidth={isFullWidth}>
            <PhotoView isFullWidth={isFullWidth} source={source} />
            {!withoutRemove && (
              <PhotoRemoveContainer onPress={onRemove}>
                <StyledIcon name="close" color="white" />
              </PhotoRemoveContainer>
            )}
          </PhotoViewPicker>
        )}
      </TouchableOpacity>
    );
  }
}

PhotoPicker.propTypes = {
  source: PropTypes.object,
  onPick: PropTypes.func,
  onPress: PropTypes.func,
  onRemove: PropTypes.func,
  isFullWidth: PropTypes.bool,
  withoutPick: PropTypes.bool,
  withoutRemove: PropTypes.bool,
  style: PropTypes.object,
};

PhotoPicker.defaultProps = {
  withoutPick: false,
  withoutRemove: false
};

export default PhotoPicker;
