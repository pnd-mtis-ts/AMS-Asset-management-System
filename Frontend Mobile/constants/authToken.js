import * as SecureStore from "expo-secure-store";

// To store a token
export const storeToken = async (token) => {
  try {
    console.log(token);
    await SecureStore.setItemAsync("token", token);
  } catch (e) {
    console.error("Failed to save the token to SecureStore", e);
  }
};

// To retrieve a token
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    console.log(token);
    return token;
  } catch (e) {
    console.error("Failed to fetch the token from SecureStore", e);
    return null;
  }
};
