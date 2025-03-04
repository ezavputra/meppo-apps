"use strict";
import { Image, TouchableWithoutFeedback, View } from "react-native";
import React, { Component } from "react";
import PropTypes from "prop-types";

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.rating ? this.props.rating : 0,
      max: this.props.max ? this.props.max : 5,
      iconWidth: this.props.iconWidth ? this.props.iconWidth : 36,
      iconHeight: this.props.iconHeight ? this.props.iconHeight : 36,
      iconSelected: this.props.iconSelected
        ? this.props.iconSelected
        : require("./../assets/img/icon_star_selected.png"),
      iconUnselected: this.props.iconUnselected
        ? this.props.iconUnselected
        : require("./../assets/img/icon_star_unselected.png"),
      editable: this.props.editable != null ? this.props.editable : true
    };
  }

  _onRate(rating) {
    this.setState({ rating });
    if (this.props.onRate) {
      this.props.onRate(rating);
    }
  }

  render() {
    const icons = [];
    for (let i = 1; i <= this.state.max; i++) {
      icons.push(
        <TouchableWithoutFeedback
          disabled={!this.state.editable}
          key={i}
          style={{ height: this.state.iconHeight, width: this.state.iconWidth }}
          onPress={() => this._onRate(i)}
        >
          <Image
            style={{
              height: this.state.iconHeight,
              width: this.state.iconWidth,
              marginLeft: 3,
              marginRight: 3
            }}
            source={
              this.state.rating >= i
                ? this.state.iconSelected
                : this.state.iconUnselected
            }
          />
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View style={[this.props.style, { flexDirection: "row" }]}>{icons}</View>
    );
  }
}

Rating.propTypes = {
  onRate: PropTypes.isInteger,
  rating: PropTypes.isInteger,
  max: PropTypes.isInteger,
  iconWidth: PropTypes.isInteger,
  iconHeight: PropTypes.isInteger,
  iconSelected: PropTypes.object,
  iconUnselected: PropTypes.object,
  editable: PropTypes.bool,
  style: PropTypes.object
};

export default Rating;
