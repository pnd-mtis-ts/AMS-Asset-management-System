import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { getToken } from '../constants/authToken';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Relokasi = ({ route, navigation }) => {
  const { FixedIDNo, IDNoEB, FixedNo, EBCode } = route.params;
  const [transDesc, setTransDesc] = useState('');
  const [idNoEB, setIdNoEB] = useState(IDNoEB.toString());
  const [items, setItems] = useState([
    { FixedIDNo: FixedNo.toString(), NewLocation: '', NewEmployeeResponsible: '' },
  ]);
  const [locations, setLocations] = useState([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();
      try {
        const response = await axios.get(`${apiUrl}/location`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async () => {
    const data = {
      TransDesc: transDesc,
      IDNoEB: parseInt(idNoEB, 10),
      items: items.map(item => ({
        FixedIDNo: parseInt(FixedIDNo, 10),
        NewLocation: item.NewLocation,
        NewEmployeeResponsible: item.NewEmployeeResponsible,
      })),
    };

    const token = await getToken();

    try {
      const response = await axios.post(`${apiUrl}/asset-relocation`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigation.navigate('Data Relokasi',);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <SafeAreaView>
    <View style={styles.container}>
    <KeyboardAwareScrollView>
      <Text style={styles.label}>TransDesc</Text>
      <TextInput
        style={styles.input}
        value={transDesc}
        onChangeText={setTransDesc}
      />

      <Text style={styles.label}>IDNoEB</Text>
      <TextInput
        style={styles.inputFix}
        value={EBCode}
        keyboardType="numeric"
        onChangeText={setIdNoEB}
        editable={false} 
      />

      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.label}>FixedIDNo </Text>
          <TextInput
            style={styles.inputFix}
            value={item.FixedIDNo}
            keyboardType="numeric"
            onChangeText={(value) => handleItemChange(index, 'FixedIDNo', value)}
            editable={false}
          />

          <Text style={styles.label}>NewLocation </Text>
          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.NewLocation}
            onValueChange={(value) => handleItemChange(index, 'NewLocation', value)}
            style={styles.picker}
          >
            {locations.map((location) => (
              <Picker.Item key={location.LocID} label={location.LocationName} value={location.LocID} />
            ))}
          </Picker>
          </View>

          <Text style={styles.label}>NewEmployeeResponsible </Text>
          <TextInput
            style={styles.input}
            value={item.NewEmployeeResponsible}
            onChangeText={(value) => handleItemChange(index, 'NewEmployeeResponsible', value)}
          />
        </View>
      ))}

      <Button title="Submit" onPress={handleSubmit} />
      </KeyboardAwareScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  inputFix: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    fontWeight: 'bold'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',  // Untuk memastikan konten tidak melewati batas border
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  itemContainer: {
    marginTop: 20,
  },
});

export default Relokasi;
