// Libraries to build app
import React  from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ROOT_OUTSIDE, ROOT_LOADING, ROOT_INSIDE, INTRO } from './actions/app';
import OutsideStack from './navigation/OutsideStack';
import InsideStack from './navigation/InsideStack';
import Splash from './screens/Splash';

// What to display in app
const Stack = createStackNavigator();

const AppContainer = ({ root }) => {

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
                        <Stack.Screen
                            name={'inside'}
                            component={InsideStack} />
                    ) : null}
                </>
            </Stack.Navigator>
        </NavigationContainer>
  );
}

const mapStateToProps = state => ({
  root: state.app.root,
})

export default connect(mapStateToProps)(AppContainer);
