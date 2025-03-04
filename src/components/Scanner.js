// Import necessary modules and components
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  useFrameProcessor
} from 'react-native-vision-camera';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Import utility functions from 'utils'
import {
  formatWifiData,
  getCountryOfOriginFromBarcode,
  openExternalLink,
} from './utils';

// Define the ScannerScreen component
export default function Scanner({ route, navigation, params }) {
  // State variables
  const [torchOn, setTorchOn] = useState(false);
  const [enableOnCodeScanned, setEnableOnCodeScanned] = useState(true);

  // Camera permission hooks
  const {
    hasPermission: cameraHasPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();

  // Get the camera device (back camera)
  const device = useCameraDevice('back');

  // Handle camera permission on component mount
  useEffect(() => {
    handleCameraPermission();
  }, []);

  // Use the code scanner hook to configure barcode scanning
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes) => {
      // Check if code scanning is enabled
      if (enableOnCodeScanned) {
        setEnableOnCodeScanned(false);
        let value = codes[0]?.value;
        let type = codes[0]?.type;

        console.warn(codes[0]);

        // Handle QR code
        if (type === 'qr') {
          try {
            // const response = await axios.get("/test-qr/" + value);
            const response = await axios.get("/test-qr/" + value);
            if (params.mode) {
              console.warn("route");

              const resetAction = CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'Home',
                    params: {
                      menu: params.menu
                    }
                  },
                  {
                    name: "QRProduct",
                    params: {
                      menu: params.menu,
                      old_data: params.product,
                      data: response.data
                    }
                  }
                ],
              });
              navigation.dispatch(resetAction);
            } else {
              console.warn("common");
              const resetAction = CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'Home',
                    params: {
                      menu: params.menu
                    }
                  },
                  {
                    name: "QRProduct",
                    params: {
                      menu: params.menu,
                      data: response.data
                    }
                  }
                ],
              });
              navigation.dispatch(resetAction);
            }
          } catch (error) {
            //showLoading(false);
            console.error(error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: error.message,
              visibilityTime: 2000,
              // autoHide: false,
              onPress: () => {
                Toast.hide();
              }
            });
          }
          // openExternalLink(value).catch((error) => {
          //   showAlert('Detail', formatWifiData(value), false);
          // });
        } else {
          // Handle other barcode types
          const countryOfOrigin = getCountryOfOriginFromBarcode(value);

          console.log(`Country of Origin for ${value}: ${countryOfOrigin}`);
          showAlert(value, countryOfOrigin);
        }

        // Disable code scanning to prevent rapid scans
        setEnableOnCodeScanned(false);
      }
    },
  });

  // Handle camera permission
  const handleCameraPermission = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      alert(
        'Camera permission is required to use the camera. Please grant permission in your device settings.'
      );

      // Optionally, open device settings using Linking API
      Linking.openSettings();
    }
  };

  // Show alert with customizable content
  const showAlert = (
    value = '',
    countryOfOrigin = '',
    showMoreBtn = true
  ) => {
    Alert.alert(
      value,
      countryOfOrigin,
      showMoreBtn
        ? [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'More',
            onPress: () => {
              setTorchOn(false);
              setEnableOnCodeScanned(true);
              openExternalLink(
                'https://www.barcodelookup.com/' + value
              );
            },
          },
        ]
        : [
          {
            text: 'Cancel',
            onPress: () => setEnableOnCodeScanned(true),
            style: 'cancel',
          },
        ],
      { cancelable: false }
    );
  };

  // Round button component with image
  const RoundButtonWithImage = () => {
    return (
      <TouchableOpacity
        onPress={() => setTorchOn((prev) => !prev)}
        style={styles.buttonContainer}>
        <View style={styles.button}>
          {/* <Image
            source={
              torchOn
                ? require('./assets/flashlight_on.png')
                : require('./assets/torch_off.png')
            }
            style={styles.buttonImage}
          /> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render content based on camera device availability
  if (device == null)
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ margin: 10 }}>Camera Not Found</Text>
      </View>
    );

  // Return the main component structure
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <RoundButtonWithImage /> */}
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        torch={torchOn ? 'on' : 'off'}
        onTouchEnd={() => setEnableOnCodeScanned(true)}

      />
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 20,
  },
  button: {
    backgroundColor: '#FFF', // Button background color
    borderRadius: 50, // Make it round (half of the width and height)
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 25, // Adjust the width and height of the image as needed
    height: 25,
  },
});
