import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Pagination = ({ perPage, setPerPage, fetchData }) => {
  const handleChangePerPage = (value) => {
    setPerPage(value);
    fetchData(); // Ambil data ulang dengan perubahan perPage
  };

  return (
    <View style={styles.paginationContainer}>
      <Text>Show:</Text>
      <Picker
        selectedValue={perPage}
        style={{ height: 20, width: 100 }}
        onValueChange={(itemValue) => handleChangePerPage(itemValue)}
      >
        <Picker.Item label="5" value={5} />
        <Picker.Item label="10" value={10} />
        <Picker.Item label="20" value={20} />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 1,
    alignItems: "center",
  },
});

export default Pagination;
