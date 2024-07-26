import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Alert } from "react-native";
import ROUTES from "../constants/route";

export default function Signout() {
  const navigation = useNavigation();

  useEffect(() => {
    const handleLogout = async () => {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Alert.alert("Logout Successful", "You have been logged out.");
          navigation.navigate(ROUTES.LOGIN);
        } else {
          const responseData = await response.json();
          Alert.alert("Logout Failed", responseData.message || "Failed to log out. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    };

    handleLogout();
  }, [navigation]);

  return null;
}
