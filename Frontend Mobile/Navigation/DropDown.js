import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { getToken } from '../constants/authToken';
import Dropdown from '../Navigation/DropDown'; // Pastikan jalur impor ini sesuai

const AssetRelocationForm = () => {
  const [transDesc, setTransDesc] = useState('');
  const [idNoEB, setIdNoEB] = useState('');
  const [items, setItems] = useState([
    { FixedIDNo: '', NewLocation: '', NewEmployeeResponsible: '' },
  ]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = await getToken();
      try {
        const response = await axios.get('http://localhost:5000/location', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLocations(response.data.data);
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
        FixedIDNo: parseInt(item.FixedIDNo, 10),
        NewLocation: item.NewLocation,
        NewEmployeeResponsible: item.NewEmployeeResponsible,
      })),
    };

    const token = await getToken();

    axios.post('http://localhost:5000/asset-relocation', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Success:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TransDesc</Text>
      <TextInput
        style={styles.input}
        value={transDesc}
        onChangeText={setTransDesc}
      />

      <Text style={styles.label}>IDNoEB</Text>
      <TextInput
        style={styles.input}
        value={idNoEB}
        keyboardType="numeric"
        onChangeText={setIdNoEB}
      />

      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.label}>FixedIDNo (Item {index + 1})</Text>
          <TextInput
            style={styles.input}
            value={item.FixedIDNo}
            keyboardType="numeric"
            onChangeText={(value) => handleItemChange(index, 'FixedIDNo', value)}
          />

          <Text style={styles.label}>NewLocation (Item {index + 1})</Text>
          <Dropdown
            label="Select Location"
            name="NewLocation"
            options={locations}
            selectedOption={item.NewLocation}
            onOptionSelect={(name, value) => handleItemChange(index, name, value)}
            placeholder="Select a location"
          />

          <Text style={styles.label}>NewEmployeeResponsible (Item {index + 1})</Text>
          <TextInput
            style={styles.input}
            value={item.NewEmployeeResponsible}
            onChangeText={(value) => handleItemChange(index, 'NewEmployeeResponsible', value)}
          />
        </View>
      ))}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
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
  itemContainer: {
    marginTop: 20,
  },
});

export default AssetRelocationForm;
