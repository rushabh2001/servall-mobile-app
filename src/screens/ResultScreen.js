import React from 'react';
import { View } from 'react-native';
import { Button , Headline  } from 'react-native-paper';

  const ResultScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Headline>Result Screen</Headline>
          <Button
                style={{ margin: 15 }}
                icon="send"
                mode="contained"
                onPress={() => navigation.navigate('Services')}
            > Log out
            </Button>
        </View>
      );
   }

export default ResultScreen;