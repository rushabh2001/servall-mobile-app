import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Linking,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import { Button, Divider, TextInput, List } from "react-native-paper";
import { colors } from "../../constants";
import { API_URL } from "../../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const WIPOrderList = ({
    navigation,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadMoreOrders, setLoadMoreOrders] = useState(true);

    const getOrderList = async () => {
        if(page == 1) setIsLoading(true)
        if(page != 1) setIsScrollLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_garage_order/status/${isGarageId}?page=${page}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        status: "Work in Progress Order",
                        search: searchQuery,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setData([...data, ...json.data.data]);
                setFilteredData([...filteredData, ...json.data.data]);
                if(page == 1) setIsLoading(false)
                if(page != 1) setIsScrollLoading(false)
                {json.data.current_page != json.data.last_page ? setLoadMoreOrders(true) : setLoadMoreOrders(false)}
                {json.data.current_page != json.data.last_page ? setPage(page + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilter = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}fetch_garage_order/status/${isGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        status: "Work in Progress Order",
                        search: searchQuery,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.data.data);
                setFilteredData(json.data.data);
                {json.data.current_page != json.data.last_page ? setLoadMoreOrders(true) : setLoadMoreOrders(false)}
                {json.data.current_page != json.data.last_page ? setPage(2) : null}
                setIsLoading(false);
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
                `${API_URL}fetch_garage_order/status/${isGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        status: "Work in Progress Order",
                        search: null,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.data.data);
                setFilteredData(json.data.data);
                {json.data.current_page != json.data.last_page ? setLoadMoreOrders(true) : setLoadMoreOrders(false)}
                {json.data.current_page != json.data.last_page ? setPage(2) : null}
                setRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
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
        pullRefresh();
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
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <Divider />}
                        data={filteredData}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onEndReached={loadMoreOrders ? getOrderList : null}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["green"]}
                            />
                        }
                        ListFooterComponent={loadMoreOrders ? renderFooter : null}
                        ListEmptyComponent={() => (
                            !isLoading && (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                    <Text style={{ color: colors.black }}>
                                        No order exist!
                                    </Text>
                                </View>
                        ))}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <>
                                <View style={styles.cards}>
                                    <View style={styles.upperInfo}>
                                        <View
                                            style={
                                                styles.cardOrderDetails
                                            }
                                        >
                                            <Text
                                                style={styles.orderID}
                                            >
                                                Order Id: {item.id}
                                            </Text>
                                            <Text
                                                style={
                                                    styles.orderStatus
                                                }
                                            >
                                                {item.status}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                right: 30,
                                                top: 35,
                                                position: "absolute",
                                            }}
                                        >
                                            <Icon
                                                onPress={() => {
                                                    this[
                                                        RBSheet + index
                                                    ].open();
                                                }}
                                                type={
                                                    "MaterialCommunityIcons"
                                                }
                                                name={"dots-vertical"}
                                                size={22}
                                                color={colors.gray}
                                            />
                                        </View>
                                        <View>
                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.orderAmount
                                                    }
                                                >
                                                    Order Amount:
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.orderAmount
                                                    }
                                                >
                                                    {" "}
                                                    ₹ {item.total}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.orderAmount,
                                                        {
                                                            marginLeft: 8,
                                                            color:
                                                                item.payment_status ==
                                                                "Completed"
                                                                    ? colors.green
                                                                    : colors.danger,
                                                        },
                                                    ]}
                                                >
                                                    {item.payment_status ==
                                                    "Completed"
                                                        ? "(Paid)"
                                                        : "(Due)"}
                                                </Text>
                                            </View>
                                            <Divider />
                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    Name:
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    {" "}
                                                    {item.user.name}
                                                </Text>
                                            </View>
                                            <Divider />
                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.orderDate
                                                    }
                                                >
                                                    Order Date:{" "}
                                                    {moment(
                                                        item.created_at,
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    ).format(
                                                        "DD-MM-YYYY"
                                                    )}
                                                </Text>
                                            </View>
                                            <Divider />
                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    Registration Number:{" "}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    {
                                                        item.vehicle
                                                            .vehicle_registration_number
                                                    }
                                                </Text>
                                            </View>
                                            <Divider />
                                            <View
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    Estimate Delivery
                                                    Date:{" "}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.cardCustomerName
                                                    }
                                                >
                                                    {moment(
                                                        item.estimated_delivery_time,
                                                        "YYYY-MM-DD hh:mm:ss"
                                                    ).format(
                                                        "DD-MM-YYYY hh:mm A"
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={styles.cardActions}
                                        ></View>
                                    </View>
                                    <View style={styles.btnActions}>
                                        <View style={styles.btnAction}>
                                            <Button
                                                onPress={() =>
                                                    Linking.openURL(
                                                        `tel:${item.user.phone_number}`
                                                    )
                                                }
                                                color={colors.white}
                                                icon={(color) => (
                                                    <Icon
                                                        name={"phone"}
                                                        size={24}
                                                        color={
                                                            colors.white
                                                        }
                                                    />
                                                )}
                                                uppercase={false}
                                            >
                                                <Text
                                                    style={
                                                        styles.btnActionText
                                                    }
                                                >
                                                    Call
                                                </Text>
                                            </Button>
                                        </View>
                                        <View
                                            style={[
                                                styles.btnAction,
                                                {
                                                    borderColor:
                                                        "#ffffff20",
                                                    borderWidth: 1,
                                                    borderTopWidth: 0,
                                                    borderBottomWidth: 0,
                                                },
                                            ]}
                                        >
                                            <Button
                                                onPress={() =>
                                                    Linking.openURL(
                                                        `sms:${item.user.phone_number}`
                                                    )
                                                }
                                                color={colors.white}
                                                icon={(color) => (
                                                    <Icon
                                                        name={"message"}
                                                        size={24}
                                                        color={
                                                            colors.white
                                                        }
                                                    />
                                                )}
                                                uppercase={false}
                                            >
                                                <Text
                                                    style={
                                                        styles.btnActionText
                                                    }
                                                >
                                                    Message
                                                </Text>
                                            </Button>
                                        </View>
                                        <View style={styles.btnAction}>
                                            <Button
                                                onPress={() =>
                                                    Linking.openURL(
                                                        `https://wa.me/${item.user.phone_number}`
                                                    )
                                                }
                                                color={colors.white}
                                                icon={(color) => (
                                                    <Icon
                                                        name={
                                                            "whatsapp"
                                                        }
                                                        size={24}
                                                        color={
                                                            colors.white
                                                        }
                                                    />
                                                )}
                                                uppercase={false}
                                            >
                                                <Text
                                                    style={
                                                        styles.btnActionText
                                                    }
                                                >
                                                    WhatsApp
                                                </Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>

                                <RBSheet
                                    ref={(ref) => {
                                        this[RBSheet + index] = ref;
                                    }}
                                    height={
                                        item?.payment_status ==
                                        "Pending"
                                            ? 190
                                            : 63
                                    }
                                    openDuration={250}
                                >
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            flex: 1,
                                        }}
                                    >
                                        <List.Item
                                            title="Change Order Status"
                                            style={{
                                                paddingVertical: 15,
                                            }}
                                            onPress={() => {
                                                let arrData = {
                                                    order_id: item.id,
                                                    user_id:
                                                        item.user_id,
                                                    garage_id:
                                                        item.garage_id,
                                                    vehicle_id:
                                                        item.vehicle_id,
                                                    name: item.user
                                                        .name,
                                                    email: item.user
                                                        .email,
                                                    phone_number:
                                                        item.user
                                                            .phone_number,
                                                    brand_id:
                                                        item.vehicle
                                                            .brand_id,
                                                    brand_name:
                                                        item?.vehicle
                                                            ?.brand
                                                            ?.name,
                                                    model_id:
                                                        item?.vehicle
                                                            ?.model_id,
                                                    model_name:
                                                        item?.vehicle
                                                            ?.vehicle_model
                                                            ?.model_name,
                                                    vehicle_registration_number:
                                                        item?.vehicle
                                                            ?.vehicle_registration_number,
                                                    odometer:
                                                        item?.odometer,
                                                    fuel_level:
                                                        item?.fuel_level,
                                                    comment:
                                                        item?.comment,
                                                    estimated_delivery_time:
                                                        item?.estimated_delivery_time,
                                                    labor_total:
                                                        item?.labor_total,
                                                    parts_total:
                                                        item?.parts_total,
                                                    status: item?.status,
                                                    services_list:
                                                        item?.orderservice,
                                                    parts_list:
                                                        item?.orderparts,
                                                    created_at:
                                                        item?.created_at,
                                                    payment_status:
                                                        item?.payment_status,
                                                    total: item?.total,
                                                    applicable_discount:
                                                        item?.discount,
                                                };
                                                navigation.navigate(
                                                    "OrderWorkInProgress",
                                                    { data: arrData }
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
                                                    name="clipboard-list-outline"
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
                                        {item?.payment_status ==
                                            "Pending" && (
                                                <>
                                                    <Divider />
                                                    <List.Item
                                                        title="Edit Order"
                                                        style={{
                                                            paddingVertical: 15,
                                                        }}
                                                        onPress={() => {
                                                            let arrData = {
                                                                order_id: item.id,
                                                                user_id:
                                                                    item.user_id,
                                                                garage_id:
                                                                    item.garage_id,
                                                                vehicle_id:
                                                                    item.vehicle_id,
                                                                name: item.user
                                                                    .name,
                                                                email: item.user
                                                                    .email,
                                                                phone_number:
                                                                    item.user
                                                                        .phone_number,
                                                                brand_id:
                                                                    item.vehicle
                                                                        .brand_id,
                                                                brand_name:
                                                                    item?.vehicle
                                                                        ?.brand
                                                                        ?.name,
                                                                model_id:
                                                                    item?.vehicle
                                                                        ?.model_id,
                                                                model_name:
                                                                    item?.vehicle
                                                                        ?.vehicle_model
                                                                        ?.model_name,
                                                                vehicle_registration_number:
                                                                    item?.vehicle
                                                                        ?.vehicle_registration_number,
                                                                odometer:
                                                                    item?.odometer,
                                                                fuel_level:
                                                                    item?.fuel_level,
                                                                comment:
                                                                    item?.comment,
                                                                estimated_delivery_time:
                                                                    item?.estimated_delivery_time,
                                                                labor_total:
                                                                    item?.labor_total,
                                                                parts_total:
                                                                    item?.parts_total,
                                                                services_list:
                                                                    item?.orderservice,
                                                                parts_list:
                                                                    item?.orderparts,
                                                                created_at:
                                                                    item?.created_at,
                                                                total: item?.total,
                                                                payment_status:
                                                                    item?.payment_status,
                                                                status: item?.status,
                                                                applicable_discount:
                                                                    item?.discount,
                                                            };
                                                            navigation.navigate(
                                                                "EditRepairOrder",
                                                                { data: arrData }
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
                                                                name="clipboard-edit-outline"
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
                                                </>
                                        )}
                                        {item?.payment_status ==
                                            "Pending" && (
                                            <>
                                                <Divider />
                                                <List.Item
                                                    title="Add Payment"
                                                    style={{
                                                        paddingVertical: 15,
                                                    }}
                                                    onPress={() => {
                                                        let arrData = {
                                                            order_id:
                                                                item.id,
                                                            total: item?.total,
                                                        };
                                                        navigation.navigate(
                                                            "AddPayment",
                                                            {
                                                                data: arrData,
                                                            }
                                                        );
                                                        this[
                                                            RBSheet +
                                                                index
                                                        ].close();
                                                    }}
                                                    left={() => (
                                                        <Icon
                                                            type={
                                                                "MaterialCommunityIcons"
                                                            }
                                                            name="account-cash"
                                                            style={{
                                                                marginHorizontal: 10,
                                                                alignSelf:
                                                                    "center",
                                                            }}
                                                            color={
                                                                colors.black
                                                            }
                                                            size={26}
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}
                                    </View>
                                </RBSheet>
                            </>
                        )}
                    />
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
        // marginBottom: 35
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
    cards: {
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    cardActions: {
        alignItems: "center",
    },
    smallActionButton: {
        fontSize: 18,
        color: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
        width: 150,
        marginTop: 8,
    },
    btnActions: {
        width: "100%",
        flexDirection: "row",
    },
    btnAction: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    btnActionText: {
        color: colors.white,
        fontSize: 12,
    },
    upperInfo: {
        padding: 25,
        paddingBottom: 10,
    },
    cardTags: {
        flexDirection: "row",
    },
    tags: {
        fontSize: 12,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: colors.black,
        color: colors.black,
        marginRight: 3,
    },
    cardOrderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 7,
        width: "100%",
    },
    orderStatus: {
        fontSize: 16,
        backgroundColor: colors.secondary,
        paddingVertical: 3,
        paddingHorizontal: 7,
        color: colors.white,
        marginHorizontal: 10,
    },
    orderID: {
        color: colors.black,
        borderColor: colors.black,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 7,
    },
    orderAmount: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4,
    },
    cardCustomerName: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4,
    },
    orderDate: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,
    },
    kmNoted: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,
    },
    modalContainerStyle: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 30,
        marginTop: 40,
        marginBottom: 70,
    },
    cardDetailsHeading: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: "bold",
    },
    cardDetailsData: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
    },
    headingStyle: {
        color: colors.black,
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    smallButton: {
        fontSize: 16,
        color: colors.primary,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
    },
    verticleImage: {
        height: 150,
        resizeMode: "contain",
        flex: 1,
    },
    lightBoxWrapper: {
        width: 150,
    },
    footer: {
        marginVertical: 15,
    },
});

const mapStateToProps = (state) => ({
    user: state.user.user,
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(WIPOrderList);
