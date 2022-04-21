import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Menu, Divider } from "react-native-paper"; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChooseGarage, More, MyCustomers, CustomerDetails, CustomerInfo } from "./index";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconX from "react-native-vector-icons/MaterialCommunityIcons";
import { colors }  from "../constants";

const MoreStack = createNativeStackNavigator();

const AllStack = ({ navigation }) => {

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
    
  return(
    <MoreStack.Navigator
        initialRouteName="More"  
        screenOptions={{
            tabBarActiveTintColor: colors.primary,
          }}
         
    >
      <MoreStack.Screen 
          name="More" 
          component={More}
          options={{
              headerRight: () => (
                  <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
                    <Button
                      onPress={() => navigation.navigate('ChooseGarage')}
                      style={styles.buttonStyle}
                      color={colors.secondary}
                      icon={ (color) => <Icon name={'edit'} size={16} color={colors.secondary}  /> }
                      uppercase={false} 
                    ><Text style={{fontSize:12, padding:0}}>Choose Garage</Text></Button>
                  </View>
                  ),
          }}
      />
      <MoreStack.Screen 
          name="ChooseGarage" 
          component={ChooseGarage} 
          options= {{
              title: "Choose Garage",
          }}
      />
      <MoreStack.Screen 
        name="AddGarage" 
        component={AddGarage} 
        options= {{
            title: "Add Garage",
        }}
      />
      <MoreStack.Screen 
        name="MyCustomers" 
        component={MyCustomers}
        options={{
          headerRight: () => (
            <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
              <Button
                onPress={() => navigation.navigate('CustomerInfo')}
                style={styles.buttonStyle}
                color={colors.secondary}
                icon={ (color) => <Icon name={'plus'} size={16} color={colors.secondary}  /> }
                uppercase={false} 
              ><Text style={{fontSize:12, padding:0}}>Add Customer</Text></Button>
            </View>
            ),
          title: "My Customer"
      }}
      />

      <MoreStack.Screen 
      name="CustomerDetails" 
      component={CustomerDetails}
      options={{
        headerRight: () => (
          <View style={{flexDirection: "row",justifyContent: "flex-end",  alignItems: "center"}}>
            <IconX name={"circle-double"} size={26} color={colors.black} style={[styles.topbarButton, {marginRight: 10} ]} />
            
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<IconX name={"dots-vertical"} size={26} color={colors.black} style={styles.topbarButton} onPress={openMenu} />}>
              <Menu.Item onPress={() => {console.log("Pressed button 1")}} title="Item 1" />
           
              <Menu.Item onPress={() => {console.log("Pressed button 2")}} title="Item 2" />
        
              <Menu.Item onPress={() => {console.log("Pressed button 3")}} title="Item 3" />
            </Menu>
          </View>
          ),
        title: "Customer Details"
      }}
      />
      <MoreStack.Screen 
          name="CustomerInfo" 
          component={CustomerInfo} 
          options= {{
              title: "Customer Information",
          }}
      />
      {/* <MoreStack.Screen name="DashboardStack" component={DashboardStack} /> */}
    </MoreStack.Navigator>
  )
}

const styles = StyleSheet.create({
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        margin:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
      }, 
      topbarButton: {
        justifyContent: "center",
        alignSelf: "center",
      }
})

export default AllStack;