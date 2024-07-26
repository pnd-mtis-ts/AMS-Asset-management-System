import React from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./Navigation/AuthNavigator";
import { useEffect, useState } from "react";
import SplashScreen from "./screens/SplashScreen";

function App() {
  const [isShowSplash, setisShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setisShowSplash(false);
    }, 1000);
  });
  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      )}
    </>
  );
}
export default App;
