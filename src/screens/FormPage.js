import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, View, TouchableOpacity, Alert } from 'react-native';


const FormPage = () => {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    gender: '',
  });

  return (
    <SafeAreaView>
      <View>
        <View>
          <TextInput
            placeholder="Name"
            defaultValue={formValue.name}
            onChangeText={(item) => setFormValue({
              ...formValue,
              name: item
            })}
          />
        </View>
        {/* <Text>Error</Text> */}

        <View>
          <TextInput
            placeholder="Email"
            defaultValue={formValue.email}
            onChangeText={(item) => setFormValue({
              ...formValue,
              email: item
            })}
          />
        </View>

      </View>

      <View>
        <TouchableOpacity onPress={() => Alert.alert("Form Value", JSON.stringify(formValue))}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FormPage;