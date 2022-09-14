import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Menu } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconX from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "../constants";
import { connect, useSelector, useDispatch } from "react-redux";
import { signOut as signOutAction } from "../actions/login";
import MyTabBar from "./components/MyTabBar";
import {
    EditStock,
    AddStock,
    AddPayment,
    AddPaymentSelectOrder,
    OrderCreated,
    OrderList,
    AddGarage,
    ChooseGarage,
    MyCustomers,
    CustomerProfile,
    CustomerDetails,
    Accounts,
    CustomerInfo,
    Orders,
    More,
    Parts,
    Services,
    AddCustomer,
    AddVehicle,
    EditVehicle,
    VehicleSearch,
    AddRepairOrder,
    AddRepairOrderStep2,
    AddRepairOrderStep3,
    CounterSale,
    CounterSaleStep2,
    PurchaseOrder,
    PurchaseOrderSelectOrder,
    EditRepairOrder,
    OpenOrderList,
    OrderWorkInProgress,
    WIPOrderList,
    OrderSearch,
    OrderCompletedList,
    OrderCompleted,
    OrderVehicleReady,
    VehicleReadyOrderList,
    InvoicePreview,
    InvoicePreviewSelectOrder,
    CompletedInvoicePreviewSelectOrder,
    VehicleList,
} from "../screens";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const ServicesStack = ({ navigation }) => {
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
        <Stack.Navigator initialRouteName={"Services"}>
            <Stack.Screen
                name={"Services"}
                component={Services}
                options={{
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            {userRole == "Super Admin" ||
                            userRole == "Admin" ||
                            garageId?.length > 1 ? (
                                <Button
                                    onPress={() =>
                                        navigation.navigate("ChooseGarage")
                                    }
                                    style={[
                                        styles.buttonStyle,
                                        { marginRight: 15 },
                                    ]}
                                    color={colors.secondary}
                                    icon={(color) => (
                                        <Icon
                                            name={"edit"}
                                            size={16}
                                            color={colors.secondary}
                                        />
                                    )}
                                    uppercase={false}
                                >
                                    <Text style={{ fontSize: 12, padding: 0 }}>
                                        Choose Garage
                                    </Text>
                                </Button>
                            ) : null}
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name={"ChooseGarage"}
                component={ChooseGarage}
                options={{
                    title: "Choose Garage",
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginRight: 15,
                            }}
                        >
                            {userRole == "Super Admin" && (
                                <Button
                                    onPress={() =>
                                        navigation.navigate("AddGarage")
                                    }
                                    style={styles.buttonStyle}
                                    color={colors.secondary}
                                    icon={(color) => (
                                        <Icon
                                            name={"plus"}
                                            size={16}
                                            color={colors.secondary}
                                        />
                                    )}
                                    uppercase={false}
                                >
                                    <Text style={{ fontSize: 12, padding: 0 }}>
                                        Add Garage
                                    </Text>
                                </Button>
                            )}
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="AddGarage"
                component={AddGarage}
                options={{
                    title: "Add Garage",
                }}
            />
            <Stack.Screen
                name="AddRepairOrder"
                component={AddRepairOrder}
                options={{
                    title: "Select Vehicle",
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onPress={() =>
                                    navigation.navigate("AddRepairOrderStep2")
                                }
                                style={[
                                    styles.buttonStyle,
                                    { marginRight: 15 },
                                ]}
                                color={colors.secondary}
                                icon={(color) => (
                                    <Icon
                                        name={"plus"}
                                        size={16}
                                        color={colors.secondary}
                                    />
                                )}
                                uppercase={false}
                            >
                                <Text style={{ fontSize: 12, padding: 0 }}>
                                    Add New Vehicle
                                </Text>
                            </Button>
                        </View>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="AddRepairOrderStep2"
                component={AddRepairOrderStep2}
                options={{
                    title: "Add Repair Order",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("AddRepairOrder")
                            }
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="AddRepairOrderStep3"
                component={AddRepairOrderStep3}
                options={{
                    title: "Add Repair Order",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("AddRepairOrder")
                            }
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="EditRepairOrder"
                component={EditRepairOrder}
                options={{
                    title: "Edit Repair Order",
                }}
            />
            <Stack.Screen
                name="OrderList"
                component={OrderList}
                options={{
                    title: "Orders",
                }}
            />
            <Stack.Screen
                name="OrderCreated"
                component={OrderCreated}
                options={{
                    title: "Order Created",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("OpenOrderList")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="AddPayment"
                component={AddPayment}
                options={{
                    title: "Add Payment",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("AddPaymentSelectOrder")
                            }
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="AddPaymentSelectOrder"
                component={AddPaymentSelectOrder}
                options={{
                    title: "Add Payment - Select Order",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="OpenOrderList"
                component={OpenOrderList}
                options={{
                    title: "Open - Order List",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="OrderWorkInProgress"
                component={OrderWorkInProgress}
                options={{
                    title: "Order WIP",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("WIPOrderList")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="WIPOrderList"
                component={WIPOrderList}
                options={{
                    title: "Work In Progress - Order List",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="OrderCompletedList"
                component={OrderCompletedList}
                options={{
                    title: "Order Completed - Order List",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="OrderCompleted"
                component={OrderCompleted}
                options={{
                    title: "Order Completed",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("OrderCompletedList")
                            }
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="OrderVehicleReady"
                component={OrderVehicleReady}
                options={{
                    title: "Vehicle Ready",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("VehicleReadyOrderList")
                            }
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="VehicleReadyOrderList"
                component={VehicleReadyOrderList}
                options={{
                    title: "Vehicle Ready - Order List",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="InvoicePreview"
                component={InvoicePreview}
                options={{
                    title: "Preview Invoice",
                    // headerLeft: () => (
                    //   <TouchableOpacity onPress={() => navigation.navigate('InvoicePreviewSelectOrder')}>
                    //     <IconX name={'arrow-left'} size={26} color={colors.black} style={[styles.topbarButton, { marginLeft: 12 }]} />
                    //   </TouchableOpacity>
                    // ),
                }}
            />
            <Stack.Screen
                name="InvoicePreviewSelectOrder"
                component={InvoicePreviewSelectOrder}
                options={{
                    title: "Preview Invoice - Select Order",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="CompletedInvoicePreviewSelectOrder"
                component={CompletedInvoicePreviewSelectOrder}
                options={{
                    title: "Preview Paid Invoice - Select Order",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Services")}
                        >
                            <IconX
                                name={"arrow-left"}
                                size={26}
                                color={colors.black}
                                style={[
                                    styles.topbarButton,
                                    { marginLeft: 12 },
                                ]}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    );
};

const OrderStack = ({ navigation }) => {
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
        <Stack.Navigator initialRouteName={"Orders"}>
            <Stack.Screen
                name={"Orders"}
                component={Orders}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
};

const PartsStack = ({ navigation }) => {
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
        <Stack.Navigator initialRouteName={"Parts"}>
            <Stack.Screen
                name={"Parts"}
                component={Parts}
                options={{
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onPress={() => navigation.navigate("AddStock")}
                                style={[
                                    styles.buttonStyle,
                                    { marginRight: 15 },
                                ]}
                                color={colors.secondary}
                                icon={(color) => (
                                    <Icon
                                        name={"plus"}
                                        size={16}
                                        color={colors.secondary}
                                    />
                                )}
                                uppercase={false}
                            >
                                <Text style={{ fontSize: 12, padding: 0 }}>
                                    Add Stock
                                </Text>
                            </Button>
                            {/* {(userRole == "Super Admin" || garageId?.length > 1) ? 
                <Button
                  onPress={() => navigation.navigate('ServicesStack', { screen: 'ChooseGarage' })}
                  style={[styles.buttonStyle, { marginRight: 15 }]}
                  color={colors.secondary}
                  icon={(color) => <Icon name={'edit'} size={16} color={colors.secondary} />}
                  uppercase={false}
                ><Text style={{ fontSize: 12, padding: 0 }}>Choose Garage</Text></Button>
                :
                null
              } */}
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="AddStock"
                component={AddStock}
                options={{
                    title: "Add Stock",
                }}
            />
            <Stack.Screen
                name="EditStock"
                component={EditStock}
                options={{
                    title: "Edit Stock",
                }}
            />
            <Stack.Screen
                name="CounterSale"
                component={CounterSale}
                options={{
                    title: "Counter Sale",
                }}
            />
            <Stack.Screen
                name="CounterSaleStep2"
                component={CounterSaleStep2}
                options={{
                    title: "Counter Sale",
                }}
            />
            <Stack.Screen
                name="PurchaseOrder"
                component={PurchaseOrder}
                options={{
                    title: "Purchase Order",
                }}
            />
            <Stack.Screen
                name="PurchaseOrderSelectOrder"
                component={PurchaseOrderSelectOrder}
                options={{
                    title: "Purchase Order - Select Vehicle",
                }}
            />
        </Stack.Navigator>
    );
};

const AccountsStack = ({ navigation }) => {
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
        <Stack.Navigator initialRouteName={"Accounts"}>
            <Stack.Screen
                name={"Accounts"}
                component={Accounts}
                options={{
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            {userRole == "Super Admin" ||
                            garageId?.length > 1 ? (
                                <Button
                                    // onPress={() => navigation.navigate('ChooseGarage')}
                                    onPress={() =>
                                        navigation.navigate("ServicesStack", {
                                            screen: "ChooseGarage",
                                        })
                                    }
                                    style={[
                                        styles.buttonStyle,
                                        { marginRight: 15 },
                                    ]}
                                    color={colors.secondary}
                                    icon={(color) => (
                                        <Icon
                                            name={"edit"}
                                            size={16}
                                            color={colors.secondary}
                                        />
                                    )}
                                    uppercase={false}
                                >
                                    <Text style={{ fontSize: 12, padding: 0 }}>
                                        Choose Garage
                                    </Text>
                                </Button>
                            ) : null}
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="AddStock"
                component={AddStock}
                options={{
                    title: "Add Stock",
                }}
            />
        </Stack.Navigator>
    );
};

const UserVehicleStack = ({ navigation }) => {
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
        <Stack.Navigator initialRouteName={"VehicleList"}>
            <Stack.Screen
                name={"VehicleList"}
                component={VehicleList}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
};

const UserVehicleTab = ({ route }) => {
    const userId = route.params.userId;

    return (
        <TopTab.Navigator>
            <TopTab.Screen
                name="AddVehicle"
                component={AddVehicle}
                options={{ title: "Add New Vehicle" }}
                initialParams={{ userId: userId }}
            />
            <TopTab.Screen
                name="EditVehicle"
                component={EditVehicle}
                options={{ title: "Edit Vehicle" }}
                initialParams={{ userId: userId }}
            />
        </TopTab.Navigator>
    );
};

const AllStack = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const userRole = useSelector((state) => state.role.user_role);
    const garageId = useSelector((state) => state.garage.garage_id);

    return (
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
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            {userRole == "Super Admin" ||
                            garageId?.length > 1 ? (
                                <Button
                                    onPress={() =>
                                        navigation.navigate("ChooseGarage")
                                    }
                                    style={styles.buttonStyle}
                                    color={colors.secondary}
                                    icon={(color) => (
                                        <Icon
                                            name={"edit"}
                                            size={16}
                                            color={colors.secondary}
                                        />
                                    )}
                                    uppercase={false}
                                >
                                    <Text style={{ fontSize: 12, padding: 0 }}>
                                        Choose Garage
                                    </Text>
                                </Button>
                            ) : null}
                        </View>
                    ),
                }}
            />
            <MoreStack.Screen
                name="ChooseGarage"
                component={ChooseGarage}
                options={{
                    title: "Choose Garage",
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            {userRole == "Super Admin" && (
                                <Button
                                    onPress={() =>
                                        navigation.navigate("AddGarage")
                                    }
                                    style={styles.buttonStyle}
                                    color={colors.secondary}
                                    icon={(color) => (
                                        <Icon
                                            name={"plus"}
                                            size={16}
                                            color={colors.secondary}
                                        />
                                    )}
                                    uppercase={false}
                                >
                                    <Text style={{ fontSize: 12, padding: 0 }}>
                                        Add Garage
                                    </Text>
                                </Button>
                            )}
                        </View>
                    ),
                }}
            />
            <MoreStack.Screen
                name="VehicleSearch"
                component={VehicleSearch}
                options={{
                    title: "Vehicles Search",
                }}
            />
            <MoreStack.Screen
                name="AddGarage"
                component={AddGarage}
                options={{
                    title: "Add Garage",
                }}
            />
            <MoreStack.Screen
                name="AddCustomer"
                component={AddCustomer}
                options={{
                    title: "Add Customer",
                }}
            />
            <MoreStack.Screen
                name="MyCustomers"
                component={MyCustomers}
                options={{
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onPress={() =>
                                    navigation.navigate("AddCustomer")
                                }
                                style={styles.buttonStyle}
                                color={colors.secondary}
                                icon={(color) => (
                                    <Icon
                                        name={"plus"}
                                        size={16}
                                        color={colors.secondary}
                                    />
                                )}
                                uppercase={false}
                            >
                                <Text style={{ fontSize: 12, padding: 0 }}>
                                    Add Customer
                                </Text>
                            </Button>
                        </View>
                    ),
                    title: "My Customer",
                }}
            />

            <MoreStack.Screen
                name="CustomerDetails"
                component={CustomerDetails}
                options={{
                    // headerRight: () => (
                    //   <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                    //     <IconX name={"circle-double"} size={26} color={colors.black} style={[styles.topbarButton, { marginRight: 10 }]} />

                    //     <Menu
                    //       visible={visible}
                    //       onDismiss={closeMenu}
                    //       anchor={<IconX name={"dots-vertical"} size={26} color={colors.black} style={styles.topbarButton} onPress={openMenu} />}>
                    //       <Menu.Item onPress={() => { console.log("Pressed button 1") }} title="Item 1" />

                    //       <Menu.Item onPress={() => { console.log("Pressed button 2") }} title="Item 2" />

                    //       <Menu.Item onPress={() => { console.log("Pressed button 3") }} title="Item 3" />
                    //     </Menu>
                    //   </View>
                    // ),
                    title: "Customer Details",
                }}
            />
            <MoreStack.Screen
                name="CustomerInfo"
                component={CustomerInfo}
                options={{
                    title: "Customer Information",
                }}
            />
            <MoreStack.Screen
                name="UserVehicleTab"
                component={UserVehicleTab}
                options={{
                    title: "Customer`s Vehicle",
                }}
            />
            <MoreStack.Screen
                name="OrderSearch"
                component={OrderSearch}
                options={{
                    title: "Order Search",
                }}
            />
        </MoreStack.Navigator>
    );
};

const AllCustomerStack = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const onLogOut = async () => dispatch(signOutAction());
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const userId = useSelector((state) => state.user.user.id);

    return (
        <Stack.Navigator
            initialRouteName="CustomerDetails"
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
            }}
        >
            <Stack.Screen
                name="CustomerDetails"
                component={CustomerProfile}
                options={{
                    headerRight: () => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginRight: 10,
                            }}
                        >
                            <Button
                                onPress={() => {
                                    closeMenu();
                                    onLogOut();
                                }}
                                style={styles.buttonStyle}
                                color={colors.secondary}
                                icon={(color) => (
                                    <IconX
                                        name={"logout"}
                                        size={20}
                                        color={colors.secondary}
                                    />
                                )}
                                uppercase={false}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        padding: 0,
                                    }}
                                >
                                    Log out
                                </Text>
                            </Button>
                        </View>
                    ),
                    title: "My Profile",
                }}
                initialParams={{ userId: userId }}
            />
            <Stack.Screen
                name="CustomerInfo"
                component={CustomerInfo}
                options={{
                    title: "Edit Profile",
                }}
            />
            <Stack.Screen
                name="UserVehicleTab"
                component={UserVehicleTab}
                options={{
                    title: "My Vehicles",
                }}
            />
        </Stack.Navigator>
    );
};

const InsideCustomerStack = () => {
    const userId = useSelector((state) => state.user.user.id);

    return (
        // <Tab.Navigator
        //     initialRouteName="PartsStack"
        //     screenOptions={{
        //         tabBarActiveTintColor: colors.default_theme.primary,
        //         tabBarStyle: { height: 60, marginTop: 0 },
        //         tabBarItemStyle: { paddingVertical: 7 },
        //         tabBarLabelStyle: { fontSize: 14 },
        //     }}
        // >
        //     <Tab.Screen
        //         name="PartsStack"
        //         component={OrderStack}
        //         options={{
        //             title: "My Orders",
        //             tabBarLabel: "Orders",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"box"} size={20} color={color} />
        //             ),
        //             // headerShown: false,
        //         }}
        //     />
        //     <Tab.Screen
        //         name="MyVehicles"
        //         component={UserVehicleStack}
        //         options={{
        //             title: "My Vehicles",
        //             tabBarLabel: "Vehicles",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"car"} size={20} color={color} />
        //             ),
        //             // headerShown: false,
        //         }}
        //         initialParams={{ userId: userId }}
        //     />

        //     <Tab.Screen
        //         name="AllCustomerStack"
        //         component={AllCustomerStack}
        //         options={{
        //             tabBarLabel: "My Profile",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"user"} size={20} color={color} solid />
        //             ),
        //             headerShown: false,
        //         }}
        //     />
        // </Tab.Navigator>
      <Tab.Navigator
        backBehavior={'initialRoute'}
        screenOptions={{
          headerShown: false
        }}
        // tabBarOptions={{
        //   keyboardHidesTabBar: true
        // }}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name="Orders"
          component={OrderStack}
          options={({ route }) => {
            return ({
              title: 'Orders',
              icon: 'Orders'
            })
          }}
        />
        <Tab.Screen
          name="MyVehicles"
          component={UserVehicleStack}
          options={({ route }) => {
            return ({
              title: 'Vehicles',
              icon: 'MyVehicles'
            })
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={AllCustomerStack}
          options={({ route }) => {
            return ({
              title: 'My Profile',
              icon: 'My Profile'
            })
          }}
        />
      </Tab.Navigator>
    );
};

const InsideStack = ({ navigation }) => {
    return (
        // <Tab.Navigator
        //     initialRouteName="ServicesStack"
        //     screenOptions={{
        //         tabBarActiveTintColor: colors.default_theme.primary,
        //         tabBarStyle: { height: 60, marginTop: 0 },
        //         tabBarItemStyle: { paddingVertical: 7 },
        //         tabBarLabelStyle: { fontSize: 14 },
        //         keyboardHidesTabBar: true,
        //     }}
        // >
        //     <Tab.Screen
        //         name="ServicesStack"
        //         component={ServicesStack}
        //         options={{
        //             tabBarLabel: "Service",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"tools"} size={20} color={color} />
        //             ),
        //             headerShown: false,
        //         }}
        //     />
        //     <Tab.Screen
        //         name="PartsStack"
        //         component={PartsStack}
        //         options={{
        //             tabBarLabel: "Parts",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"wrench"} size={20} color={color} />
        //             ),
        //             headerShown: false,
        //         }}
        //     />
        //     <Tab.Screen
        //         name="AllStack"
        //         component={AllStack}
        //         options={{
        //             tabBarLabel: "More",
        //             tabBarIcon: ({ color }) => (
        //                 <Icon name={"bars"} size={20} color={color} />
        //             ),
        //             headerShown: false,
        //         }}
        //         listeners={({ navigation }) => ({
        //             tabPress: (event) => {
        //                 event.preventDefault();
        //                 navigation.navigate("AllStack", { screen: "More" });
        //             },
        //         })}
        //     />
        // </Tab.Navigator>
      <Tab.Navigator
        backBehavior={'initialRoute'}
        screenOptions={{
          headerShown: false
        }}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
              name="Service"
               component={ServicesStack}
          options={({ route }) => {
            return ({
              title: 'Service',
              icon: 'Service'
            })
          }}
        />
        <Tab.Screen
          name="Parts"
          component={PartsStack}
          options={({ route }) => {
            return ({
              title: 'Parts',
              icon: 'Parts'
            })
          }}
        />
        <Tab.Screen
          name="More"
            component={AllStack}
          options={({ route }) => {
            return ({
              title: 'More',
              icon: 'More'
            })
          }}
        />
      </Tab.Navigator>
    
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        letterSpacing: 0,
        lineHeight: 0,
        margin: 0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    topbarButton: {
        justifyContent: "center",
        alignSelf: "center",
    },
});

export { InsideStack, InsideCustomerStack };
