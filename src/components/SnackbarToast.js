import * as React from 'react';
import PropTypes from "prop-types";
import { Button, Snackbar } from 'react-native-paper';
import { connect } from "react-redux";

const SnackbarToast = ({ message, visibleSnack }) => {
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  // if (visibleSnack == true) {
  //   setVisible(visibleSnack);
  // }

  return (
    <Snackbar
      visible={true}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Tutup',
        onPress: onDismissSnackBar,
      }}>
      {message}
    </Snackbar>
  )
};

SnackbarToast.propTypes = {
  message: PropTypes.string,
  visibleSnack: PropTypes.bool
};

export default SnackbarToast;
