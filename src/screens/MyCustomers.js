import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { List, Button, Divider, TextInput } from "react-native-paper";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused } from "@react-navigation/native";

const MyCustomer = ({
    navigation,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const refRBSheet = useRef();
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getCustomerList = async () => {
        {
            page == 1 && setIsLoading(true);
        }
        {
            page != 1 && setIsScrollLoading(true);
        }
        try {
            const res = await fetch(
                `${API_URL}fetch_my_garage_customers?page=${page}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: searchQuery,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                console.log("json", json);
                setData([...data, ...json.user_list.data]);
                setFilteredData([...filteredData, ...json.user_list.data]);
                // setData(json.user_list);
                // setFilteredData(json.user_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            {
                page == 1 && setIsLoading(false);
            }
            {
                page != 1 && setIsScrollLoading(false);
            }
            setPage(page + 1);
        }
    };

    const searchFilter = async () => {
        try {
            const response = await fetch(
                `${API_URL}fetch_my_garage_customers`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: searchQuery,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.user_list.data);
                setFilteredData(json.user_list.data);
                setPage(2);
                setRefreshing(false);
            } else {
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullRefresh = async () => {
        setSearchQuery(null);
        try {
            const response = await fetch(
                `${API_URL}fetch_my_garage_customers`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: "",
                    }),
                }
            );
            const json = await response.json();
            console.log("1", json);
            if (response.status == "200") {
                setData(json.user_list.data);
                setFilteredData(json.user_list.data);
                setPage(2);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pullRefresh();
    };

    useEffect(() => {
        getCustomerList();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getCustomerList();
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 35 }}>
                {selectedGarageId == 0 ? (
                    <Text style={styles.garageNameTitle}>
                        All Garages - {user.name}
                    </Text>
                ) : (
                    <Text style={styles.garageNameTitle}>
                        {selectedGarage?.garage_name} - {user.name}
                    </Text>
                )}
            </View>
            <View style={styles.surfaceContainer}>
                {/* {selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages</Text> : <Text style={styles.garageNameTitle}>{selectedGarage?.garage_name}</Text> } */}
                {/* Search Bar */}
                <View>
                    <View style={{ marginBottom: 15, flexDirection: "row" }}>
                        <TextInput
                            mode={"flat"}
                            placeholder="Search here..."
                            onChangeText={(text) => setSearchQuery(text)}
                            value={searchQuery}
                            activeUnderlineColor={colors.transparent}
                            selectionColor="black"
                            underlineColor={colors.transparent}
                            style={{
                                elevation: 4,
                                height: 50,
                                backgroundColor: colors.white,
                                flex: 1,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                            }}
                            right={
                                searchQuery != null &&
                                searchQuery != "" && (
                                    <TextInput.Icon
                                        icon="close"
                                        color={colors.light_gray}
                                        onPress={() => onRefresh()}
                                    />
                                )
                            }
                        />
                        <TouchableOpacity
                            onPress={() => searchFilter()}
                            style={{
                                elevation: 4,
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                paddingRight: 25,
                                paddingLeft: 25,
                                zIndex: 2,
                                backgroundColor: colors.primary,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconX
                                name={"search"}
                                size={17}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        backgroundColor: colors.white,
                        elevation: 2,
                    }}
                >
                    {isLoading ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : filteredData?.length > 0 ? (
                        <>
                            <FlatList
                                ItemSeparatorComponent={() => <Divider />}
                                data={filteredData}
                                onEndReached={
                                    filteredData?.length > 9 && getCustomerList
                                }
                                onEndReachedThreshold={0.5}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={
                                    filteredData?.length > 9 && renderFooter
                                }
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <>
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 16,
                                                                color: colors.black,
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        <Text>
                                                            {" "}
                                                            ({item.phone_number}
                                                            )
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "center",
                                                            marginVertical: 15,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: 130,
                                                            }}
                                                        >
                                                            <Button
                                                                onPress={() =>
                                                                    Linking.openURL(
                                                                        `https://wa.me/${item.phone_number}`
                                                                    )
                                                                }
                                                                style={
                                                                    styles.buttonStyle
                                                                }
                                                                color={
                                                                    colors.secondary
                                                                }
                                                                icon={(
                                                                    color
                                                                ) => (
                                                                    <Icon
                                                                        name={
                                                                            "whatsapp"
                                                                        }
                                                                        size={
                                                                            24
                                                                        }
                                                                        color={
                                                                            colors.secondary
                                                                        }
                                                                    />
                                                                )}
                                                                uppercase={
                                                                    false
                                                                }
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Whatsapp
                                                                </Text>
                                                            </Button>
                                                        </View>
                                                        <View
                                                            style={{
                                                                width: 15,
                                                            }}
                                                        ></View>
                                                        <View
                                                            style={{
                                                                width: 100,
                                                            }}
                                                        >
                                                            <Button
                                                                onPress={() =>
                                                                    Linking.openURL(
                                                                        `tel:${item.phone_number}`
                                                                    )
                                                                }
                                                                style={
                                                                    styles.buttonStyle
                                                                }
                                                                color={
                                                                    colors.secondary
                                                                }
                                                                icon={(
                                                                    color
                                                                ) => (
                                                                    <Icon
                                                                        name={
                                                                            "phone"
                                                                        }
                                                                        size={
                                                                            24
                                                                        }
                                                                        color={
                                                                            colors.secondary
                                                                        }
                                                                    />
                                                                )}
                                                                uppercase={
                                                                    false
                                                                }
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Call
                                                                </Text>
                                                            </Button>
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                            right={() => (
                                                <Icon
                                                    onPress={() => {
                                                        this[
                                                            RBSheet + index
                                                        ].open();
                                                    }}
                                                    type={
                                                        "MaterialCommunityIcons"
                                                    }
                                                    style={{
                                                        right: 5,
                                                        top: 8,
                                                        position: "absolute",
                                                    }}
                                                    name={"dots-vertical"}
                                                    size={22}
                                                    color={colors.gray}
                                                />
                                            )}
                                        />
                                        <RBSheet
                                            ref={(ref) => {
                                                this[RBSheet + index] = ref;
                                            }}
                                            height={63}
                                            openDuration={250}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                    flex: 1,
                                                }}
                                            >
                                                <List.Item
                                                    title="View Customer Details"
                                                    style={{
                                                        paddingVertical: 15,
                                                    }}
                                                    onPress={() => {
                                                        navigation.navigate(
                                                            "CustomerDetails",
                                                            { userId: item.id }
                                                        );
                                                        this[
                                                            RBSheet + index
                                                        ].close();
                                                    }}
                                                    left={() => (
                                                        <Icon
                                                            type={
                                                                "MaterialCommunityIcons"
                                                            }
                                                            name="eye"
                                                            style={{
                                                                marginHorizontal: 10,
                                                                alignSelf:
                                                                    "center",
                                                            }}
                                                            color={colors.black}
                                                            size={26}
                                                        />
                                                    )}
                                                />
                                            </View>
                                        </RBSheet>
                                    </>
                                )}
                            />
                        </>
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginVertical: 50,
                                flex: 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.black,
                                    textAlign: "center",
                                }}
                            >
                                No Customers are associated with this Garage!
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
        color: colors.white,
        paddingVertical: 7,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 0,
        zIndex: 5,
        width: "100%",
        flex: 1,
        left: 0,
        right: 0,
    },
    surfaceContainer: {
        flex: 1,
        padding: 15,
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight: 0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    // garageNameTitle: {
    //     borderRadius: 6,
    //     marginBottom: 15,
    //     textAlign: 'center',
    //     fontSize: 18,
    //     fontWeight: '600',
    //     color: colors.white,
    //     paddingVertical: 7,
    //     backgroundColor: colors.secondary
    // },
    footer: {
        marginVertical: 15,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    user: state.user.user,
    // garage: state.garage.garage,
    // userId: state.user.user.user_data.id,
});

export default connect(mapStateToProps)(MyCustomer);
