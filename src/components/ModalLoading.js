import React from "react";
import { ActivityIndicator, Modal, Image } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

const Layer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  width: 128px;
  height: 128px;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 4px;
`;

export const ModalLoading = ({ isOpen }) => (
  <Modal
    visible={isOpen}
    animationType="fade"
    transparent
    onRequestClose={() => {
    }}
  >
    <Layer>
      <Container>
        <Image
          source={require("../assets/img/logo-loading.gif")}
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
          }}
        />
      </Container>
    </Layer>
  </Modal>
);

ModalLoading.propTypes = {
  isOpen: PropTypes.bool
};

export const mapStateToProps = ({ loading }) => ({ isOpen: loading });

export default connect(mapStateToProps)(ModalLoading);
