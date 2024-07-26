import React, { useEffect, useState } from "react";
import { SimpleLineIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { View, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Home from "../screens/Home";
import DataAset from "../screens/DataAset";
import DataRelokasi from "../screens/DataRelokasi";
import Signout from "../screens/Signout";
import Settings from "../screens/Settings";
import User from "../assets/superadmin.png";
import { getToken } from "../constants/authToken";
import axios from "axios";

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log("No token available");
          return;
        }

        const response = await axios.get(`${apiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.User.name);
        setRole(response.data.role.name);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <SafeAreaView>
          <View
            style={{
              height: 220,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: "#111",
              borderBottomWidth: 1,
            }}
          >
            <Image
              source={User}
              style={{
                height: 110,
                width: 110,
                borderRadius: 65,
              }}
            />
            <Text
              style={{
                fontSize: 24,
                marginVertical: 5,
                fontWeight: "bold",
                color: "#111",
              }}
            >
              {username}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#111",
              }}
            >
              {role}
            </Text>
          </View>
          <DrawerItemList {...props} />
        </SafeAreaView>
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#3cb371",
          width: 230,
        },
        headerStyle: {
          backgroundColor: "#3cb371",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerLabelStyle: {
          color: "white",
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: () => (
            <SimpleLineIcons name="home" size={25} color="#111" />
          ),
        }}
        component={Home}
      />
      <Drawer.Screen
        name="Data Aset"
        options={{
          drawerLabel: "Data Aset",
          title: "Data Aset",
          drawerIcon: () => (
            <MaterialIcons name="data-exploration" size={25} color="#111" />
          ),
        }}
        component={DataAset}
      />
      <Drawer.Screen
        name="Data Relokasi"
        options={{
          drawerLabel: "Data Relokasi",
          title: "Data Relokasi",
          drawerIcon: () => (
            <MaterialIcons name="dataset" size={25} color="#111" />
          ),
        }}
        component={DataRelokasi}
      />

      <Drawer.Screen
        name="Settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: () => (
            <SimpleLineIcons name="settings" size={25} color="#111" />
          ),
        }}
        component={Settings}
      />
      <Drawer.Screen
        name="Signout"
        options={{
          drawerLabel: "Signout",
          title: "Signout",
          drawerIcon: () => <Entypo name="log-out" size={25} color="#ff0000" />,
        }}
        component={Signout}
      />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
