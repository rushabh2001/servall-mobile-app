// Libraries to build app
import React  from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ROOT_OUTSIDE, ROOT_LOADING, ROOT_INSIDE, INTRO } from './actions/app';
import OutsideStack from './navigation/OutsideStack';
import { InsideStack, InsideCustomerStack } from './navigation/InsideStack';
// import {} from './navigation/InsideStack';
import Splash from './screens/Splash';

// What to display in app
const Stack = createStackNavigator();

const AppContainer = ({ root, userRole }) => {
    // console.log("app container", userRole);
    // console.log("app container", root);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <>
                    {root === ROOT_LOADING ? (
                        <Stack.Screen
                            name={'Splash'}
                            component={Splash} 
                            options={{ gestureEnabled: false }}
                        />
                    ) : null}

                    {root === ROOT_OUTSIDE ? (
                        <Stack.Screen
                            name="outside"
                            component={OutsideStack} />
                    ) : null}

                    {root === ROOT_INSIDE ? (
                        (userRole == "Super Admin" || userRole == "Admin") ?
                        <Stack.Screen
                            name={'inside'}
                            component={InsideStack} />
                        : 
                        (
                            (userRole == "Customer") ?
                                <Stack.Screen
                                name={'inside'}
                                component={InsideCustomerStack} />
                            : null 
                        )
                    ) : null}
                </>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const mapStateToProps = state => ({
  root: state.app.root,
  userRole: state.role.user_role,
})

export default connect(mapStateToProps)(AppContainer);
