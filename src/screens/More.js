import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {  List, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';


const More = ({ navigation }) => {

    return (
        <View style= {styles.customSurface}>

            <View style={{flex:1}}>
              <ScrollView>
                <List.Item
                  title="My Customers"
                  style={{paddingVertical:15}}
                  // description="Item description"
                  onPress={() => navigation.navigate("MyCustomers")}
                  left={() => (<Icon name="users" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="My Vendors"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="user-friends" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Order Search"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="search" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Settings"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="cogs" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Service Reminder"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="bell" solid style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Service Feedbacks"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="comments" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />

                <List.Item
                  title="Vehicle Search"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="car" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Insurance Due"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="business-time" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Report"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="exclamation-triangle" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Tally Export"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="file-invoice" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Cancelled Orders"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<Icon name="flag" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={21} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                <Divider />
                <List.Item
                  title="Log Out"
                  // description="Item description"
                  style={{paddingVertical:15}}
                  left={() => (<IconX name="logout" style={{marginRight:20, alignSelf:"center", width: 30}} color={colors.black} size={26} />)}
                  right={() => (<Icon name="caret-right" style={{marginRight:20, alignSelf:"center"}} color={colors.gray} size={18} />)}
                />
                {/* <Divider /> */}
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

export default More;