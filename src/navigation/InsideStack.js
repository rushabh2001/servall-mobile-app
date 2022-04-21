import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors }  from "../constants";
// import MyTabBar from './components/MyTabBar';
import {
  // DashboardStack,
  // AllStack,
  AddGarage,
  ChooseGarage,
  MyCustomers,
  CustomerDetails,
  Accounts,
  CustomerInfo,
  More,
  Parts,
  Services,
  AddCustomer,
  AddVehicle,
  EditVehicle,
} from '../screens';

// const MainStack = createNativeStackNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function SurveyStack() {
    return (
        <Stack.Navigator
            initialRouteName={'survey'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={'survey'}
                component={SurveyScreen}
            />
            <Stack.Screen
                name={'pay-pal-account'}
                component={PayPalAccountScreen}
            />
            <Stack.Screen
                name={'survey-intro'}
                component={SurveyIntroScreen}
            />
            <Stack.Screen
                name={'survey-submitted'}
                component={SurveySubmittedScreen}
                options={{ gestureEnabled: false }}
            />
        </Stack.Navigator>
    )
}

const UserVehicleTab = ({ route }) =>  {
  const userId = route.params.userId;

  return (
    <TopTab.Navigator>
      <TopTab.Screen name="EditVehicle" component={EditVehicle} options={{ title: "Edit Vehicle"}} initialParams={{userId: userId}} />
      <TopTab.Screen name="AddVehicle" component={AddVehicle} options={{ title: "Add New Vehicle"}} initialParams={{userId: userId}} />
    </TopTab.Navigator>
  );
}
          // <MainStack.Navigator
          //   initialRouteName="MainTab"
          //   screenOptions={{
          //     headerShown: false,
          //   }}
          // >
          //     <MainStack.Screen name="Login" component={Login} />
          //     <MainStack.Screen name="MainTab" component={MainTab} />
          // </MainStack.Navigator>


const AllStack = ({ navigation }) => {

  const [visible, setVisible] = useState(false);
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
              headerRight: () => (
                <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
                  <Button
                    onPress={() => navigation.navigate('AddGarage')}
                    style={styles.buttonStyle}
                    color={colors.secondary}
                    icon={ (color) => <Icon name={'plus'} size={16} color={colors.secondary}  /> }
                    uppercase={false} 
                  ><Text style={{fontSize:12, padding:0}}>Add Garage</Text></Button>
                </View>
              ),
              headerLeft: () => (
                <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
                  <Icon 
                    style={{paddingRight: 15}}
                    name={'arrow-left'} size={16} 
                    color={colors.secondary} 
                    onPress={() => {navigation.goBack()}}
                   /> 
                </View>
              ),
              // headerLeft: () => (
              //   <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
              //     <Icon
              //       onPress={() => navigation.pop(2)}
              //       style={styles.buttonStyle}
              //       color={colors.secondary}
              //       icon={ (color) => <Icon name={'plus'} size={16} color={colors.secondary}  /> }
              //       uppercase={false} 
              //     ><Text style={{fontSize:12, padding:0}}>Add Garage</Text></Button>
              //   </View>
              // ),
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
        name="AddCustomer" 
        component={AddCustomer} 
        options= {{
            title: "Add Customer",
            
        }}
      />
      <MoreStack.Screen 
        name="MyCustomers" 
        component={MyCustomers}
        options={{
          headerRight: () => (
            <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
              <Button
                onPress={() => navigation.navigate('AddCustomer')}
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
       <MoreStack.Screen 
          name="UserVehicleTab" 
          component={UserVehicleTab} 
          // options= {{
          //     title: "Customer Information",
          // }}
      />
      
    </MoreStack.Navigator>
  )
}

export default function InsideStack({ navigation }) {
    return (
      <Tab.Navigator
        initialRouteName="Services"
        screenOptions={{
          tabBarActiveTintColor: colors.default_theme.primary,
          tabBarStyle: { height:60,marginTop:0 },
          tabBarItemStyle: { paddingVertical: 7 },
          tabBarLabelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen 
          name="Services"  
          component={Services} 
          options={{
            tabBarLabel: 'Service',
            tabBarIcon: ({color}) => (
              <Icon name={'tools'} size={20}  color={color} />
            ),
            headerRight: () => (
              <View style={{flexDirection: "row",justifyContent: "flex-end"}}>
                <Button
                  onPress={() => navigation.navigate('AllStack', { screen: 'ChooseGarage', initial: false})}
                  style={[styles.buttonStyle, {marginRight: 15}]}
                  color={colors.secondary}
                  icon={ (color) => <Icon name={'edit'} size={16} color={colors.secondary}  /> }
                  uppercase={false} 
                ><Text style={{fontSize:12, padding:0}}>Choose Garage</Text></Button>
              </View>
            ),
          }} 
        />
        <Tab.Screen 
          name="Parts" 
          component={Parts}     
          options={{
            tabBarLabel: 'Parts',
            tabBarIcon: ({color}) => (
              <Icon name={'wrench'} size={20}  color={color}  />
            ),
          }} 
        />
        <Tab.Screen 
          name="Accounts" 
          component={Accounts}
          options={{
            tabBarLabel: 'Accounts',
            tabBarIcon: ({color}) => (
              <Icon name={'calculator'} size={20}  color={color}  />
            ),
          }} 
        />
        
        <Tab.Screen 
          name="AllStack" 
          component={AllStack}  
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({color}) => (
              <Icon name={'bars'} size={20}  color={color}  />
            ),
            headerShown: false,
          }} 
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("AllStack", {screen: "More" });
            }
          })}
        />
      </Tab.Navigator>
            // <MainStack.Navigator
            //   initialRouteName="MainTab"
            //   screenOptions={{
            //     headerShown: false,
            //   }}
            // >
            //     <MainStack.Screen name="Login" component={Login} />
            //     <MainStack.Screen name="MainTab" component={MainTab} />
            // </MainStack.Navigator>
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
