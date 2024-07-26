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

export default function DataMaster({ navigation }) {
  const [master, setMaster] = useState([]);
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

      const response = await axios.get(`${apiUrl}/fixed?per_page=10&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (page === 1) {
        setMaster(response.data.data);
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
      item.FixedNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData;
  };

  const renderUserCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.FixedNo}</Text>
        <Text style={styles.title2}>{item.EntityRelations.EntityName}</Text>
        <Text style={styles.email}>{item.AccNo}</Text>
        <Text style={styles.username}>{item.FixedGroup ? item.FixedGroup.Name : "N/A"}</Text>
        <Text style={styles.website}>{item.EntitasBisni ? item.EntitasBisni.EBCode : "N/A"}</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('DetailDataAsset', { FixedIDNo: item.FixedIDNo })}
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
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Octicons name="search" size={24} color="black" />
      </View>
      <FlatList
        data={handleSearch()}
        keyExtractor={(item) => item.FixedIDNo.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            {loading && <ActivityIndicator size="large" color={''}/>}
          </View>
        )}
        renderItem={renderUserCard}
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
    borderRadius: 8,
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
  username: {
    fontStyle: "italic",
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
