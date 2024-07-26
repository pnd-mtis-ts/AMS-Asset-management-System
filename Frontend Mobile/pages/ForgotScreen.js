import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native-web';

const ForgotScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} >lupa sandi silahkan hubungin Tim IT</Text>
    </View>
  )
}

export default ForgotScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
});