import * as React from "react";
import {Dimensions} from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  View, Text,
} from 'react-native';
import { List } from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import {moderateScale} from "react-native-size-matters";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").width;

const Accordion = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  // const {
  //   openAccordion,
  //   title,
  //   subtitle,
  //   rightTitle
  // } = this.props;

  return (
    <List.Section title="Accordions">
      <List.Accordion
        title="Uncontrolled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion>

      {/* <List.Accordion
        title="Controlled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={handlePress}>
        <List.Item title="First item" />
        <List.Item title="Second item" />
      </List.Accordion> */}
    </List.Section>
  );
};

Accordion.propTypes = {
  openAccordion: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  rightTitle: PropTypes.string
};

Accordion.defaultProps = {
  openAccordion: false,
};

export default Accordion;
