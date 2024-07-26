import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert(
      `Hasil Data Scan`,
      `Barcode dengan No.AIN : ${data}\n Berhasil di scan`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel pressed'),
          style: 'cancel'
        },
        {
          text: 'Detail',
          onPress: () => navigation.navigate('Detail', { data }),
        }
      ]
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleOverlay}>
          <View style={styles.scanBox} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
  },
  middleOverlay: {
    flex: 2,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
  },
  // scanBox: {
  //   width: 250,
  //   height: 250,
  //   borderWidth: 2,
  //   // borderColor: 'red',
  //   borderRadius: 10,
  //   backgroundColor: 'transparent',
  //   position: 'relative',
  // },
});
