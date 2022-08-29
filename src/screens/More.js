import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {  List, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { 
  signOut as signOutAction,
} from '../actions/login';

const More = ({ navigation, signOut}) => {

  const onLogOut = async () => {
    signOut();
  };

  return (
        <View style= {styles.customSurface}>
          <View style={{flex:1}}>
            <ScrollView>
              <List.Item
                title="My Customers"
                style={{paddingVertical:15}}
                onPress={() => navigation.navigate("MyCustomers")}
                left={() => (<Icon name="users" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
              />
              <Divider />
              <List.Item
                title="Order Search"
                style={{paddingVertical:15}}
                onPress={() => navigation.navigate("OrderSearch")}
                left={() => (<Icon name="search" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
              />
              <Divider />
              <List.Item
                title="Vehicle Search"
                onPress={() => navigation.navigate("VehicleSearch")}
                style={{paddingVertical:15}}
                left={() => (<Icon name="car" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
              />
              <Divider />
              {/* <List.Item
                title="Cancelled Orders"
                style={{paddingVertical:15}}
                left={() => (<Icon name="flag" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
              />
              <Divider /> */}
              <List.Item
                title="Log Out"
                onPress={() => onLogOut()}
                style={{paddingVertical:15}}
                left={() => (<IconX name="logout" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={26} />)}
                right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
              />
          </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customSurface: {
    padding: 15,
    flexDirection: "column",
    flex: 1,
  },
})

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(signOutAction()),
});

export default connect(null, mapDispatchToProps)(More);