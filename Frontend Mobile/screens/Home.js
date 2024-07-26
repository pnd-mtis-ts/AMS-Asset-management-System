import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  
  // Animation for the scan icon
  const animation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolating the animation value to move the text up and down
  const animatedTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Adjust these values to control the range of movement
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.View style={{ transform: [{ translateY: animatedTranslateY }] }}>
          <Text style={styles.text}>Silahkan Scan Dibawah Ini</Text>
        </Animated.View>
        <Text style={styles.arrow}>▼</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate("Scan")}
          >
            <View style={styles.iconBackground}>
              <AntDesign name="scan1" size={60} color="white" />
            </View>
          </TouchableOpacity>
         
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  floatingButton: {
    backgroundColor: "#3cb371",
    borderRadius: 30,
    padding: 10,
  },
  iconBackground: {
    backgroundColor: "#3cb371",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 30,
    color: "#000",
    marginTop: 10,
  },
});
