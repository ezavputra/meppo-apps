import React, { Component } from "react";
import { Dimensions } from "react-native";
import PropTypes from "prop-types";
import { glueAndroid } from "../config/style-android";
import {
  Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionTitleText, AccordionIcon,
  AccordionContent, AccordionContentText
} from "@gluestack-ui/themed";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

class AccordionContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const { value, title, content } = this.props;

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
      </Accordion>
    );
  }
}

AccordionContainer.propTypes = {
  value: PropTypes.any,
  title: PropTypes.string,
  content: PropTypes.string,
};

AccordionContainer.defaultProps = {
  // value: '',
  // title: '',
  // content: '',
};

export default AccordionContainer;
