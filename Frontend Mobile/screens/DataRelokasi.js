import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getToken } from "../constants/authToken";
import { Octicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function DataRelokasi({ navigation }) {
  const [master, setMaster] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchData = async (page) => {
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token available");
        return;
      }

      setLoading(true);

      const response = await axios.get(`${apiUrl}/asset-relocation-item`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          _page: page,
          _limit: perPage,
        },
      });
      console.log(response.data);

      if (page === 1) {
        const result = response.data.data;
        const invertedData = result.reverse();
        setMaster(invertedData);
      } else {
        setMaster((prevMaster) => [...prevMaster, ...response.data.data]);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchDataOnFocus = async () => {
        await fetchData(1);
      };

      fetchDataOnFocus();

      return () => {
        // Cleanup logic, if any
      };
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchData(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return master;
    }

    const filteredData = master.filter((item) =>
      item.AssetRelocation.TransNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderUserCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.AssetRelocation.TransNo}</Text>
        <Text style={styles.title2}>{item.Fixed.FixedAssetName}</Text>
        <Text style={styles.email}>{formatDate(item.RelocationDate)}</Text>
        <Text style={styles.website}>{item.Fixed.Location.LocationName}</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('DetailRelokasi', { ID: item.RelocationID })}
        >
          <Text style={styles.fabText}>
            <AntDesign name="rightcircle" size={20} color="blue" />
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Octicons name="search" size={24} color="black" />
      </View>
      <FlatList
        data={handleSearch()}
        keyExtractor={(item, index) => item.RelocationID.toString() + index}
        renderItem={renderUserCard}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            {loading && <ActivityIndicator size="large" />}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 30,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title2: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "#666",
    marginBottom: 5,
  },
  website: {
    color: "blue",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  fab: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginTop: 1,
  },
  pagination: {
    width: "90%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
