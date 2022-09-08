import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import {  List, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { 
  signOut as signOutAction,
} from '../actions/login';

const More = ({ navigation, signOut, selectedGarageId, selectedGarage, user}) => {

  const onLogOut = async () => {
    signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 35 }}>
        { selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages - {user.name}</Text> : <Text style={styles.garageNameTitle}>{selectedGarage?.garage_name} - {user.name}</Text> }
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  customSurface: {
    padding: 15,
    flexDirection: "column",
    flex: 1,
  },
  garageNameTitle: {
    textAlign: 'center', 
    fontSize: 17, 
    fontWeight: '500', 
    color: colors.white, 
    paddingVertical: 7, 
    backgroundColor: colors.secondary,
    position: 'absolute',
    top: 0,
    zIndex: 5,
    width: '100%',
    flex: 1,
    left: 0, 
    right: 0
  },
})

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(signOutAction()),
});

const mapStateToProps = state => ({
  user: state.user.user,
  selectedGarageId: state.garage.selected_garage_id,
  selectedGarage: state.garage.selected_garage,
})

export default connect(mapStateToProps, mapDispatchToProps)(More);