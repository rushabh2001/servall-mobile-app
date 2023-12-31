import React, { useState, useEffect } from "react";
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
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

const MyCustomer = ({
    navigation,
    userToken,
    selectedGarageId,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadMoreCustomers, setLoadMoreCustomers] = useState(true);

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
                        garage_id: selectedGarageId,
                        search: searchQuery,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                console.log("json", json);
                setData([...data, ...json.user_list.data]);
                setFilteredData([...filteredData, ...json.user_list.data]);
                setIsLoading(false);
                if(page != 1) setIsScrollLoading(false)
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreCustomers(true) : setLoadMoreCustomers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setPage(page + 1) : null}
            }
        } catch (e) {
            console.log(e);
        } 
    };

    const searchFilter = async () => {
        setIsLoading(true);
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
                        garage_id: selectedGarageId,
                        search: searchQuery,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.user_list.data);
                setFilteredData(json.user_list.data);
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreCustomers(true) : setLoadMoreCustomers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setPage(2) : null}
                setRefreshing(false);
                setIsLoading(false);
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
                        garage_id: selectedGarageId,
                        search: "",
                    }),
                }
            );
            const json = await response.json();
            console.log("1", json);
            if (response.status == "200") {
                setData(json.user_list.data);
                setFilteredData(json.user_list.data);
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreCustomers(true) : setLoadMoreCustomers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setPage(2) : null}
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
            setIsLoading(false);
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

    // useEffect(() => {
    //     getCustomerList();
    // }, []);

    useEffect(() => {
        setPage(1);
        setIsLoading(true);
        pullRefresh();
    }, [isFocused, selectedGarageId]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.surfaceContainer}>
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
                    {!isLoading &&
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <Divider />}
                            data={filteredData}
                            onEndReached={loadMoreCustomers ? getCustomerList : null}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{ flexGrow: 1 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={["green"]}
                                />
                            }
                            ListFooterComponent={loadMoreCustomers ? renderFooter : null}
                            ListEmptyComponent={() => (
                                !isLoading && (
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                        <Text style={{ color: colors.black }}>
                                            No customer exist!
                                        </Text>
                                    </View>
                            ))}
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
                    }
                </View>
                {isLoading &&
                    <Spinner
                        visible={isLoading}
                        color="#377520"
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
                    />
                }
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
    footer: {
        marginVertical: 15,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    user: state.user.user,
});

export default connect(mapStateToProps)(MyCustomer);
