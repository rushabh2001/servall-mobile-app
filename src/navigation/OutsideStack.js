import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/LoginPage';

const Stack = createStackNavigator();

export default function OutsideStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen
                name={'intro'}
                component={Intro} /> */}
            <Stack.Screen
                name={'login'}
                component={Login} />
        </Stack.Navigator>
    )
}