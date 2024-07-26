// screens/Detail.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,ActivityIndicator,TouchableOpacity } from 'react-native';
import axios from "axios";
import { getToken } from "../constants/authToken";
import { ScrollView } from "react-native-gesture-handler";
// import { Ionicons } from '@expo/vector-icons';

export default function Detail({ route,navigation }) {
  const { ID } = route.params;

  const [master, setMaster] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // const handleEditAndNavigate = (master) => {
  //   const FixedIDNo = master?.FixedIDNo;
  //   if (FixedIDNo) {
  //     navigation.navigate("Relokasi", { FixedIDNo });
  //   }
  // };
  
  const fetchData = async (setMaster) => {
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token available");
        return;
      }

      const response = await axios.get(`${apiUrl}/asset-relocation/${ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setMaster(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const mainData = [
    { label: "TransNo", name: "TransNo", value: master?.TransNo },
    { label: "Description", name: "TransDesc", value: master?.TransDesc },
    { label: "TransDate", name: "TransDate", value:  formatDate(master?.TransDate) },
    { label: "RelocationDate", name: "TransDate", value:  formatDate(master?.AssetRelocationItems?.[0]?.RelocationDate) },
    // { label: "Entitas Bisnis", name: "IDNoEB", value: master?.Fixed?.FixedNo },
    { label: "Pengguna Awal", name: "PreviousEmployeeResponsible", value: master?.AssetRelocationItems?.[0]?.PreviousEmployeeResponsible || "N/A" },
    { label: "Pengguna Terbaru", name: "NewEmployeeResponsible", value: master?.AssetRelocationItems?.[0]?.NewEmployeeResponsible || "N/A" },
    { label: "Tempat Awal", name: "reviousLocationDetails", value: master?.AssetRelocationItems?.[0]?.PreviousLocationDetails?.LocationName},  
    { label: "Tempat Terbaru", name: "NewLocationDetails", value: master?.AssetRelocationItems?.[0]?.NewLocationDetails?.LocationName},  
  ];


  useEffect(() => {
    fetchData(setMaster);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!master) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Data not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} >
      <View style={styles.card} >
      {
        mainData.map((item,index) =>(
          <View key={index} style={styles.itemContainer} >
            <Text style={styles.label}>{item.label} :</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))
      }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  "#F0F0F065",
    padding: 5,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    flex: 1, // Flex 1 untuk label
  },
  value: {
    flex: 1, // Flex 1 untuk value
    textAlign: "right", // Value ditampilkan di sebelah kanan
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,  // Lebar border
    borderColor: "black",  // Warna border
    borderRadius: 8, 
  },
  fab: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E79D5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20, // jarak antara button dan data list
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});