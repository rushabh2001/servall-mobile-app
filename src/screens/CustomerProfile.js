import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    ActivityIndicator,
} from "react-native";
import {
    Badge,
    Divider,
    Modal,
    Portal,
    Button,
    List,
} from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL, WEB_URL } from "../constants/config";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import Lightbox from "react-native-lightbox-v2";
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";
import ServAllLogo from "../assets/images/placeholder_servall.jpg";

const customerTopTabs = createMaterialTopTabNavigator();

const CustomerProfile = ({
    navigation,
    route,
    userToken,
    userRole,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomerData, setIsCustomerData] = useState("");
    const [imageUri, setImageUri] = useState(
        Image.resolveAssetSource(ServAllLogo).uri
    );
    const [singleFile, setSingleFile] = useState(null);
    const [resizeImage, setResizeImage] = useState("cover");
    const isFocused = useIsFocused();
    const [orderDataModal, setOrderDataModal] = useState(false);
    const [orderData, setOrderData] = useState();
    const [orderDataLoading, setOrderDataLoading] = useState(true);

    const getCustomerDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_customer_details?id=${route?.params?.userId}`,
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
                console.log("setIsCustomerData", json?.user_details);
                setIsCustomerData(json?.user_details);
                if (json.user_details.profile_image != null) {
                    setImageUri(
                        WEB_URL +
                            "uploads/profile_image/" +
                            json?.user_details.profile_image
                    );
                } else {
                    setImageUri(Image.resolveAssetSource(ServAllLogo).uri);
                }
                // console.log('isCustomerData', isCustomerData.order);
                // console.log('isCustomerData Length', isCustomerData.order.length);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderDetails = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}order/${orderId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setOrderData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setOrderDataLoading(false);
        }
    };

    const changeProfileImage = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setSingleFile(res[0]);
        } catch (err) {
            setSingleFile(null);
            if (DocumentPicker.isCancel(err)) {
                alert("Canceled");
            } else {
                alert("Unknown Error: " + JSON.stringify(err));
                throw err;
            }
        }
    };

    const uploadImage = async () => {
        if (singleFile != null) {
            const fileToUpload = singleFile;
            const data = new FormData();
            data.append("profile_image", fileToUpload);
            let res = await fetch(
                `${API_URL}update_profile_image/${route?.params?.userId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data; ",
                        Authorization: "Bearer " + userToken,
                    },
                    body: data,
                }
            );
            let responseJson = await res.json();
            if (responseJson.message == true) {
                getCustomerDetails();
            }
        } else {
            console.log("Please Select File first");
        }
    };

    useEffect(() => {
        if (singleFile != null) {
            uploadImage();
        }
    }, [singleFile]);

    // useEffect(() => {
    //     getCustomerDetails();
    // }, [isFocused]);

    useEffect(() => {
        getCustomerDetails();
    }, []);

    // useEffect(() => {
    //     console.log("cheeee", isCustomerData.states.name);
    // }, [isCustomerData]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 35 }}>
                {selectedGarageId == 0 ? (
                    <Text style={styles.garageNameTitle}>
                        All Garages - {user.name}
                    </Text>
                ) : (
                    <Text style={styles.garageNameTitle}>
                        Hello {user.name}
                    </Text>
                )}
            </View>
            <View style={styles.surfaceContainer}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator></ActivityIndicator>
                    </View>
                ) : (
                    <>
                        <View style={styles.upperContainer}>
                            <View>
                                {imageUri && (
                                    <Lightbox
                                        onOpen={() => setResizeImage("contain")}
                                        willClose={() =>
                                            setResizeImage("cover")
                                        }
                                        activeProps={styles.activeImage}
                                        navigator={navigator}
                                        style={styles.lightBoxWrapper}
                                    >
                                        <Image
                                            resizeMode={resizeImage}
                                            style={styles.verticleImage}
                                            source={{ uri: imageUri }}
                                        />
                                    </Lightbox>
                                )}
                                <Icon
                                    style={styles.iconChangeImage}
                                    onPress={changeProfileImage}
                                    name={"camera"}
                                    size={16}
                                    color={colors.white}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={styles.customerName}>
                                    {isCustomerData != null
                                        ? isCustomerData.name
                                        : null}
                                </Text>
                                {/* <Icon
                            onPress={() =>
                                navigation.navigate("CustomerInfo", {
                                    userId: route?.params?.userId,
                                })
                            }
                            name={"pencil"}
                            size={20}
                            color={colors.gray}
                        /> */}
                            </View>
                            {/* <View>
                        <Text style={styles.customerPhonenumber}>
                            {isCustomerData != null
                                ? isCustomerData?.phone_number
                                : ""}
                        </Text>
                    </View> */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginTop: 5,
                                    flexWrap: "wrap",
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    width: "80%",
                                    flexFlow: "row wrap",
                                }}
                            >
                                {userRole == "Super Admin" ||
                                userRole == "Admin" ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Linking.openURL(
                                                    `tel:${isCustomerData.phone_number}`
                                                )
                                            }
                                            style={styles.smallButton}
                                        >
                                            <Icon
                                                name={"phone"}
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Linking.openURL(
                                                    `sms:${isCustomerData.phone_number}?&body=Hello%20ServAll`
                                                )
                                            }
                                            style={styles.smallButton}
                                        >
                                            <Icon
                                                name={"comment-multiple"}
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Linking.openURL(
                                                    `https://wa.me/${isCustomerData.phone_number}`
                                                )
                                            }
                                            style={styles.smallButton}
                                        >
                                            <Icon
                                                name={"whatsapp"}
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity> */}
                                    </>
                                ) : null}
                                {/* <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("UserVehicleTab", {
                                    userId: route?.params?.userId,
                                });
                            }}
                            style={styles.smallButton}
                        >
                            <Text style={{ color: colors.primary }}>
                                Vehicles
                            </Text>
                        </TouchableOpacity> */}
                                {/* <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Text style={{color:colors.primary}}>Appointments</Text></TouchableOpacity> */}
                            </View>
                            <View style={styles.cardContainer}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.danger2,
                                            fontSize: 16,
                                        }}
                                    >
                                        Outstanding
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.danger2,
                                            fontSize: 16,
                                        }}
                                    >
                                        ₹ {isCustomerData.due_payment}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.green,
                                            fontSize: 16,
                                        }}
                                    >
                                        Paid
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.green,
                                            fontSize: 16,
                                        }}
                                    >
                                        ₹ {isCustomerData.completed_payment}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.lowerContainer}>
                            <View style={styles.cards}>
                                <View style={styles.upperInfo}>
                                    <View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.LabelLeft}>
                                                Phone Number:
                                            </Text>
                                            <Text style={styles.LabelRight}>
                                                {isCustomerData != null
                                                    ? isCustomerData?.phone_number
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Divider />
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.LabelLeft}>
                                                Email:
                                            </Text>
                                            <Text style={styles.LabelRight}>
                                                {isCustomerData != null
                                                    ? isCustomerData?.email
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Divider />
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.LabelLeft}>
                                                State:
                                            </Text>
                                            <Text style={styles.LabelRight}>
                                                {isCustomerData != null
                                                    ? isCustomerData?.states
                                                          ?.name
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Divider />
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.LabelLeft}>
                                                City:
                                            </Text>
                                            <Text style={styles.LabelRight}>
                                                {isCustomerData != null
                                                    ? isCustomerData?.cities
                                                          ?.name
                                                    : ""}
                                            </Text>
                                        </View>
                                        <Divider />
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.LabelLeft}>
                                                Address:
                                            </Text>
                                            <Text style={styles.LabelRight}>
                                                {isCustomerData != null
                                                    ? isCustomerData?.address
                                                    : ""}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* <View style={styles.cardActions}></View> */}
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

// const CustomerNotifications = ({ route }) => {
//     return (

//     )
// }

// const CustomerOrders = ({ route }) => {
// const refRBSheet = useRef();
// useEffect(() => {
//   console.log('orders', isCustomerData);
// }, [])

//     return (

//     )
// }

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
        flexDirection: "column",
        flex: 1,
    },
    upperContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        //backgroundColor: "red",
    },
    lowerContainer: {
        flex: 1,
    },
    customerName: {
        fontSize: 18,
        color: colors.black,
        marginRight: 10,
    },
    customerPhonenumber: {
        color: colors.black,
        marginTop: 5,
        fontSize: 16,
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
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
        backgroundColor: colors.white,
        padding: 8,
        margin: 10,
        justifyContent: "space-around",
        width: "70%",
    },
    badgeValue: {
        top: 5,
        right: 0,
        left: 0,
        bottom: 0,
    },
    haveBadge: {
        position: "relative",
        color: colors.black,
    },
    badgeTag: {
        top: -5,
        right: -10,
        position: "absolute",
    },
    badgeBtn: {
        fontSize: 16,
        left: -15,
        color: colors.black,
    },
    innerTabContainer: {
        padding: 10,
        marginBottom: 10,
    },
    cards: {
        padding: 20,
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
    LabelLeft: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4,
        fontWeight: "500",
    },
    LabelRight: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4,
        marginLeft: 5,
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
    iconChangeImage: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: colors.black,
        padding: 5,
        borderRadius: 500,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 500,
        marginBottom: 10,
    },
    verticleImage: {
        width: "100%",
        height: "100%",
    },
    activeImage: {
        width: "100%",
        height: null,
        resizeMode: "contain",
        borderRadius: 0,
        flex: 1,
    },
    lightBoxWrapper: {
        width: 80,
        height: 80,
        borderRadius: 500,
        marginBottom: 10,
        overflow: "hidden",
        backgroundColor: colors.black,
    },

    // modal styles
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
    verticleImageModal: {
        height: 150,
        resizeMode: "contain",
        flex: 1,
    },
    lightBoxWrapperModal: {
        width: 150,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(CustomerProfile);
