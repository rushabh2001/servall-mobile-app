// Libraries to build app
import React  from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { More, Services, Parts, Accounts, AllStack } from './index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import {
  appStart as appStartAction
} from '../actions/app';

// What to display in app

const Tab = createBottomTabNavigator();

const DashboardStack = ({navigation}) => {

  return (
 
    <Tab.Navigator
      initialRouteName="Services"
       screenOptions={{
        tabBarActiveTintColor: colors.default_theme.primary,
        // headerRight: () => (
        //   <View style={{flexDirection: "row",justifyContent: "flex-end",paddingRight:15,width: 170}}>
        //     <Button
        //       onPress={() => navigation.navigate('ChooseGarage')}
        //       style={styles.buttonStyle}
        //       color={colors.black}
        //       icon={ (color) => <Icon name={'edit'} size={18} color={colors.secondary} /> }
        //       uppercase={false} 
        //     > Choose Garage </Button>
        //     </View>
        //   )
      }}
    
    >
      <Tab.Screen 
        name="Services"  
        component={Services} 
        style={{ fontSize:14 }}
        options={{
          tabBarLabel: 'Service',
          tabBarIcon: ({color}) => (
            <Icon name={'tools'} size={20}  color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }} 
        />
      <Tab.Screen 
        name="Parts" 
        component={Parts}   
        style={{ fontSize:14 }}     
        options={{
          tabBarLabel: 'Parts',
          tabBarIcon: ({color}) => (
            <Icon name={'wrench'} size={20}  color={color}  />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
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
          tabBarLabelStyle: {
            fontSize: 12,
          },
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
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
        }} 
        />
    </Tab.Navigator>

  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    // alignItems: 'center',
    // flexDirection: 'row',
    
    // borderColor: colors.secondary,
    // borderWidth: 1,
    // backgroundColor: colors.default_theme.secondary,
  }
})

// const mapStateToProps = state => ({
//   isFirstTime: state.app.isFirstTime
// })

// const mapDispatchToProps = dispatch => ({
//   appStart: (data) => dispatch(appStartAction(data))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

export default DashboardStack;
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardStack);
