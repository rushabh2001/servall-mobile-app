// import React, { useState, useEffect } from 'react';
// import { View, Image, Text, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


// function MyTabBar({ state, descriptors, navigation }) {

//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         let keyboardEventListeners;
//         if (Platform.OS === 'android') {
//             keyboardEventListeners = [
//                 Keyboard.addListener('keyboardDidShow', () => setVisible(true)),
//                 Keyboard.addListener('keyboardDidHide', () => setVisible(false)),
//             ];
//         }
//         return () => {
//             if (Platform.OS === 'android') {
//                 keyboardEventListeners &&
//                     keyboardEventListeners.forEach(eventListener => eventListener.remove());
//             }
//         };
//     }, []);

//     if (visible) return null;

//     return (
//         <View style={{
//             flexDirection: 'row',
//             paddingVertical: 5,
//             backgroundColor: colors.white,
//             alignItems: 'center',
//             justifyContent: 'center',
//             shadowColor: "#000",
//             shadowOffset: {
//                 width: 0,
//                 height: 12,
//             },
//             shadowOpacity: 0.58,
//             shadowRadius: 16.00,
//             elevation: 24,
//             borderTopColor: '#eee',
//             borderTopWidth: 1
//         }}>
//             {state.routes.map((route, index) => {
//                 const { options } = descriptors[route.key];
//                 const label =
//                     options.tabBarLabel !== undefined
//                         ? options.tabBarLabel
//                         : options.title !== undefined
//                             ? options.title
//                             : route.name;

//                 const icon = options.icon;

//                 const isFocused = state.index === index;

//                 const onPress = async () => {
//                     const event = navigation.emit({
//                         type: 'tabPress',
//                         target: route.key,
//                         canPreventDefault: true,
//                     });
//                     if (isFocused && !route.params) return;
//                     if (route.name === 'account' || (!isFocused && !event.defaultPrevented)) {
//                         navigation.reset({
//                             index: 0,
//                             routes: [{ name: route.name }],
//                         });
//                     }
//                 };

//                 const onLongPress = () => {
//                     navigation.emit({
//                         type: 'tabLongPress',
//                         target: route.key,
//                     });
//                 };

//                 const styles = StyleSheet.create({
//                     tabBox: {
//                         flex: 1,
//                         paddingHorizontal: 10,
//                         paddingVertical: 8
//                     },
//                     box: {
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }
//                 })
//                 const routeName = getFocusedRouteNameFromRoute(route) ?? "";
//                 let IconImage;
//                 switch (icon) {
//                     case 'survey':
//                         IconImage = Image.resolveAssetSource(isFocused ? require('../../assets/icons/survey_blue.png') : require('../../assets/icons/survey_gray.png')).uri;
//                         break;
//                     case 'rewards':
//                         IconImage = Image.resolveAssetSource(isFocused ? require('../../assets/icons/reward_blue.png') : require('../../assets/icons/reward_gray.png')).uri;
//                         break;
//                     case 'account':
//                         IconImage = Image.resolveAssetSource(isFocused ? require('../../assets/icons/account_blue.png') : require('../../assets/icons/account_gray.png')).uri;
//                         break;
//                     default:
//                         IconImage = Image.resolveAssetSource(isFocused ? require('../../assets/icons/survey_blue.png') : require('../../assets/icons/rewards.png')).uri;
//                         break;
//                 }

//                 return (
//                     <TouchableOpacity
//                         key={index}
//                         accessibilityRole="button"
//                         accessibilityState={isFocused ? { selected: true } : {}}
//                         accessibilityLabel={options.tabBarAccessibilityLabel}
//                         testID={options.tabBarTestID}
//                         onPress={onPress}
//                         onLongPress={onLongPress}
//                         style={styles.tabBox}
//                     >
//                         <View style={styles.box}>
//                             <Image source={{ uri: IconImage }} style={{ height: 26, width: 26, marginBottom: 6 }} resizeMode="contain" />
//                             <Text style={{ color: isFocused ? colors.blue : colors.light_black, fontSize: 12 }}> {label} </Text>
//                         </View>
//                     </TouchableOpacity>
//                 );
//             })}
//         </View>
//     );
// }

// export default MyTabBar;