import React, { Component } from "react";
import { ImageBackground, Animated, Dimensions, Linking } from "react-native";
import { CommonActions } from '@react-navigation/native';
import PropTypes from "prop-types";
import {
  Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionTitleText, AccordionIcon,
  AccordionContent, AccordionContentText
} from "@gluestack-ui/themed";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

class AccCon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: 1,
      scrollX: new Animated.Value(0)
    };
  }

  render() {
    // const {
    //   seemore, items, style, color, widthImage, direction,
    //   title, textColor, imgBg, imgHead, category,
    //   subtitle, tag, heightImage, id
    // } = this.props;

    return (
      <Accordion
        m="$5"
        width="90%"
        size="md"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
      >
        {/* <AccordionItem value={value}> */}
        <AccordionItem value="a">
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText>B</AccordionTitleText>
                    {/* {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} ml="$3" />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} ml="$3" />
                    )} */}
                  </>
                )
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <AccordionContentText>
              C
            </AccordionContentText>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText>B</AccordionTitleText>
                    {/* {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} ml="$3" />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} ml="$3" />
                    )} */}
                  </>
                )
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <AccordionContentText>
              C
            </AccordionContentText>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
}

AccCon.propTypes = {
  // imgHead: PropTypes.any,
};

AccCon.defaultProps = {
  // caption: "Tambah foto",
  // isFullWidth: false,
  // withoutPick: false,
  // withoutRemove: false
};

export default AccCon;
