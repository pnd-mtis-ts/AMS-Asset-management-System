import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from "axios";
import { getToken } from "../constants/authToken";
import { Ionicons } from '@expo/vector-icons';

export default function DetailDataAsset({ route, navigation }) {
  const { FixedIDNo } = route.params;

  const [master, setMaster] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token available");
        return;
      }

      const response = await axios.get(`${apiUrl}/fixed/${FixedIDNo}`, {
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

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token available");
        return;
      }

      const response = await axios.get(`${apiUrl}/asset-relocation-item/fixed/${FixedIDNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const result = response.data.data;
      const invertedData = result.reverse();
      setHistory(invertedData);
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

  useEffect(() => {
    fetchData();
    fetchHistory();
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

  if (!history) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Data not found</Text>
      </View>
    );
  }

  // const handleRefresh = async () => {
  //   setRefreshing(true);
  //   setCurrentPage(1);
  //   await fetchData(1);
  //   setRefreshing(false);
  // };


  const mainData = [
    { label: "AIN", value: master?.FixedNo },
    { label: "EntityName", value: master?.EntityRelations?.EntityName || "N/A" },
    { label: "AccNo", value: master?.AccNo },
    { label: "Currency", value: master?.Currency },
    { label: "Name FixedGroup", value: master?.FixedGroup?.Name || "N/A" },
    { label: "EBCode", value: master?.EntitasBisni?.EBCode || "N/A" },
    { label: "LocationName", value: master?.Location?.LocationName || "N/A" },
  ];

  const mainHstry = history.map((item, index) => ({
    key: `${index}`,
    data: [
      { label: "Transaction No", value: item?.AssetRelocation?.TransNo },
      { label: "New Location", value: item?.Fixed?.Location?.LocationName || "N/A" },
      { label: "New Employee", value: item?.NewEmployeeResponsible },
      { label: "Relocation Date", value: formatDate(item?.RelocationDate) },
    ]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
      <Text style={styles.title}>
          Detail :
        </Text>
        <ScrollView style={styles.detailsScroll}>
          <View style={styles.card}>
            {mainData.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.label}>{item.label}:</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate('Relokasi', { FixedIDNo: master.FixedIDNo, IDNoEB: master.IDNoEB, FixedNo: master.FixedNo, EBCode: master.EntitasBisni?.EBCode || null })}
            >
              <Text style={styles.fabText}>
                <Ionicons name="location-sharp" size={15} />
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
      </View>
      <View style={styles.historyContainer}>
      <Text style={styles.title}>
          History :
        </Text>
        <ScrollView style={styles.historyScroll}>
          {mainHstry.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.sectionHeader}>History {index + 1}</Text>
              {item.data.map((detail, idx) => (
                <View key={idx} style={styles.itemContainer}>
                  <Text style={styles.label}>{detail.label}:</Text>
                  <Text style={styles.value}>{detail.value}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F065",
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  historyContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,  // Adjust if needed to separate from the details section
  },
  detailsScroll: {
    flex: 1,
  },
  historyScroll: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: "right",
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
    borderWidth: 1,
    borderColor: "black",
  },
  fab: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E79D5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
