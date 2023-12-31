import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import { Button, Divider, TextInput, Modal, Portal } from "react-native-paper";
import { colors } from "../constants";
import IconX from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import Lightbox from "react-native-lightbox-v2";
import { API_URL, WEB_URL } from "../constants/config";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";
import { useIsFocused } from "@react-navigation/native";

const VehicleSearch = ({
    userToken,
    selectedGarageId,
    navigator,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [viewVehicleDetailsModal, setViewVehicleDetailsModal] =
        useState(false);
    const [VehicleData, setVehicleData] = useState("");
    const [vehicleDataLoading, setVehicleDataLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);
    const [loadMoreVehicles, setLoadMoreVehicles] = useState(true);
    const isFocused = useIsFocused();

    const getVehicleDetails = async (vehicleId) => {
        setVehicleDataLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_data?id=${vehicleId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setVehicleData(json.vehicle_details);
                setVehicleDataLoading(false);
            }
        } catch (e) {
            console.log(e);
        } 
    };

    const getVehicleList = async () => {
        if(page == 1) setIsLoading(true)
        if(page != 1) setIsScrollLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_all_vehicle_by_query/${selectedGarageId}?page=${page}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: searchQuery,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setData([...data, ...json.vehicle_list.data]);
                setFilteredData([...filteredData, ...json.vehicle_list.data]);
                setIsLoading(false);
                if(page != 1) setIsScrollLoading(false)
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setLoadMoreVehicles(true) : setLoadMoreVehicles(false)}
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setPage(page + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilter = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}fetch_all_vehicle_by_query/${selectedGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: searchQuery,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.vehicle_list.data);
                setFilteredData(json.vehicle_list.data);
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setLoadMoreVehicles(true) : setLoadMoreVehicles(false)}
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setPage(2) : null}
                setRefreshing(false);
            } else {
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const pullRefresh = async () => {
        setSearchQuery(null);
        try {
            const response = await fetch(
                `${API_URL}fetch_all_vehicle_by_query/${selectedGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: null,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setData(json.vehicle_list.data);
                setFilteredData(json.vehicle_list.data);
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setLoadMoreVehicles(true) : setLoadMoreVehicles(false)}
                {json.vehicle_list.current_page != json.vehicle_list.last_page ? setPage(2) : null}
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

    useEffect(() => {
        getVehicleList();
    }, [isFocused, selectedGarageId]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
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
                    {!isLoading &&
                        <>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => <Divider />}
                                data={filteredData}
                                onEndReached={loadMoreVehicles ? getVehicleList : null}
                                onEndReachedThreshold={0.5}
                                contentContainerStyle={{ flexGrow: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={loadMoreVehicles ? renderFooter : null}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No vehicle exist!
                                            </Text>
                                        </View>
                                ))}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.cards}>
                                        {/* <View style={styles.cardOrderDetails}>
                                            <Text style={styles.orderID}>
                                                Last Order ID: {item.id}
                                            </Text>
                                        </View> */}
                                        <View>
                                            <Text
                                                style={styles.cardCustomerName}
                                            >
                                                Owner Name: {item.users[0].name}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={styles.cardCustomerName}
                                            >
                                                Owner`s Phone Number:{" "}
                                                {item.users[0].phone_number}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={styles.cardCustomerName}
                                            >
                                                Brand: {item.brand.name}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={styles.cardCustomerName}
                                            >
                                                Model:{" "}
                                                {item.vehicle_model.model_name}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={styles.cardCustomerName}
                                            >
                                                Registration Number:{" "}
                                                {
                                                    item.vehicle_registration_number
                                                }
                                            </Text>
                                        </View>
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setViewVehicleDetailsModal(
                                                        true
                                                    );
                                                    getVehicleDetails(item.id);
                                                }}
                                                style={[
                                                    styles.smallButton,
                                                    {
                                                        width: 150,
                                                        marginTop: 8,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        color: colors.primary,
                                                    }}
                                                >
                                                    View More Details
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                            <Portal>
                                <Modal
                                    visible={viewVehicleDetailsModal}
                                    onDismiss={() => {
                                        setVehicleDataLoading(true);
                                        setViewVehicleDetailsModal(false);
                                    }}
                                    contentContainerStyle={
                                        styles.modalContainerStyle
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.headingStyle,
                                            {
                                                marginTop: 0,
                                                alignSelf: "center",
                                            },
                                        ]}
                                    >
                                        Vehicle Details
                                    </Text>
                                    <IconX name="times" size={20} color={colors.black} style={{ position: 'absolute', top: 25, right: 25, zIndex: 99 }} onPress={() => { setVehicleDataLoading(true); setViewVehicleDetailsModal(false); }} />
                                    {vehicleDataLoading ? (
                                        <ActivityIndicator
                                            style={{ marginVertical: 30, flex: 1 }}
                                        ></ActivityIndicator>
                                    ) : (
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Owner Name:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.users[0]?.name
                                                    ? VehicleData?.users[0]
                                                          ?.name
                                                    : null}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Owner`s Phone Number:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.users[0]
                                                    ?.phone_number
                                                    ? VehicleData?.users[0]
                                                          ?.phone_number
                                                    : null}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Owner`s Email:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.users[0]?.email
                                                    ? VehicleData?.users[0]
                                                          ?.email
                                                    : null}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Registration Number:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.vehicle_registration_number
                                                    ? VehicleData?.vehicle_registration_number
                                                    : null}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Brand:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.brand?.name
                                                    ? VehicleData?.brand?.name
                                                    : null}
                                            </Text>
                                            <Divider />
                                            <Text
                                                style={
                                                    styles.cardDetailsHeading
                                                }
                                            >
                                                Vehicle Model:
                                            </Text>
                                            <Text
                                                style={styles.cardDetailsData}
                                            >
                                                {VehicleData?.vehicle_model
                                                    ?.model_name
                                                    ? VehicleData?.vehicle_model
                                                          ?.model_name
                                                    : null}
                                            </Text>
                                            {VehicleData?.purchase_date &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Purchase Date:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.purchase_date
                                                            ? moment(
                                                                VehicleData?.purchase_date,
                                                                "YYYY MMMM D"
                                                            ).format("DD-MM-YYYY")
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.manufacturing_date &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Manufacturing Date:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.manufacturing_date
                                                            ? moment(
                                                                VehicleData?.manufacturing_date,
                                                                "YYYY MMMM D"
                                                            ).format("DD-MM-YYYY")
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.engine_number &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Engine Number:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.engine_number
                                                            ? VehicleData?.engine_number
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.chasis_number &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Chasis Number:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.chasis_number
                                                            ? VehicleData?.chasis_number
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.insurance_provider &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Insurance Provider Company:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.insurance_provider
                                                            ?.name
                                                            ? VehicleData
                                                                ?.insurance_provider
                                                                ?.name
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.insurer_gstin &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Insurer GSTIN:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.insurer_gstin
                                                            ? VehicleData?.insurer_gstin
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.insurer_address &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Insurer Address:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.insurer_address
                                                            ? VehicleData?.insurer_address
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.policy_number &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Policy Number:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.policy_number
                                                            ? VehicleData?.policy_number
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.insurance_expiry_date &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Insurance Expiry Date:
                                                    </Text>
                                                    <Text
                                                        style={styles.cardDetailsData}
                                                    >
                                                        {VehicleData?.insurance_expiry_date
                                                            ? moment(
                                                                VehicleData?.insurance_expiry_date,
                                                                "YYYY MMMM D"
                                                            ).format("DD-MM-YYYY")
                                                            : null}
                                                    </Text>
                                                </>
                                            }

                                            {VehicleData?.registration_certificate_img &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Registration Certificate:
                                                    </Text>
                                                    <Lightbox
                                                        navigator={navigator}
                                                        style={
                                                            styles.lightBoxWrapper
                                                        }
                                                    >
                                                        <Image
                                                            resizeMode={"cover"}
                                                            style={
                                                                styles.verticleImage
                                                            }
                                                            source={{
                                                                uri:
                                                                    WEB_URL +
                                                                    "uploads/registration_certificate_img/" +
                                                                    VehicleData?.registration_certificate_img,
                                                            }}
                                                        />
                                                    </Lightbox>
                                                </>
                                            }

                                            {VehicleData?.insurance_img &&
                                                <>
                                                    <Divider />
                                                    <Text
                                                        style={
                                                            styles.cardDetailsHeading
                                                        }
                                                    >
                                                        Insurance Policy:
                                                    </Text>
                                                    <Lightbox
                                                        navigator={navigator}
                                                        style={
                                                            styles.lightBoxWrapper
                                                        }
                                                    >
                                                        <Image
                                                            resizeMode={"cover"}
                                                            style={
                                                                styles.verticleImage
                                                            }
                                                            source={{
                                                                uri:
                                                                    WEB_URL +
                                                                    "uploads/insurance_img/" +
                                                                    VehicleData?.insurance_img,
                                                            }}
                                                        />
                                                    </Lightbox>
                                                </>
                                            }
                                        </ScrollView>
                                    )}

                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flex: 1 }}></View>
                                        <Button
                                            style={{
                                                marginTop: 15,
                                                flex: 1.4,
                                                alignSelf: "center",
                                            }}
                                            mode={"contained"}
                                            onPress={() => {
                                                setVehicleDataLoading(true);
                                                setViewVehicleDetailsModal(false);
                                            }}
                                        >
                                            Close
                                        </Button>
                                        <View style={{ flex: 1 }}></View>
                                    </View>
                                </Modal>
                            </Portal>
                        </>
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
        padding: 25,
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
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
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(VehicleSearch);
