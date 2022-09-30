import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import { Modal, Portal, Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL, WEB_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from "react-native-input-scroll-view";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import CommonHeader from "../Component/CommonHeaderComponent";

const PurchaseOrder = ({ route, userToken, navigation }) => {
    const [isRepairOrderId, setIsRepairOrderId] = useState();
    const [isCustomerName, setIsCustomerName] = useState();
    const [isVendor, setIsVendor] = useState();
    const [isComment, setIsComment] = useState();

    const [isPart, setIsPart] = useState();
    const [isPartName, setIsPartName] = useState("");

    const [vendorList, setVendorList] = useState([]);
    const [repairOrderList, setRepairOrderList] = useState([]);

    const [fieldsParts, setFieldsParts] = useState([
        { partId: null, partName: null, quantity: 0, imageName: 0 },
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const [addPartModal, setAddPartModal] = useState(false);
    const [isNewPartName, setIsNewPartName] = useState("");
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    const [isNewPart, setIsNewPart] = useState("");
    const [newPartError, setNewPartError] = useState();

    const [isNewVendorName, setIsNewVendorName] = useState("");
    const [addNewVendorModal, setAddNewVendorModal] = useState(false);

    const [firstPartField, setFirstPartField] = useState(false);
    const [addRepairOrderModal, setAddRepairOrderModal] = useState(false);

    const [vendorError, setVendorError] = useState();
    const [repairOrderError, setRepairOrderError] = useState();
    const [partError, setPartError] = useState();
    const [partList, setPartList] = useState([]);
    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(0);
    const [partsTotal, setPartsTotal] = useState(0);
    const [isTotal, setIsTotal] = useState(0);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const [isPartImg, setIsPartImg] = useState(null);
    const [isPartImgLoading, setIsPartImgLoading] = useState(false);
    const [partImgError, setPartImgError] = useState("");
    const [isNewPartImg, setIsNewPartImg] = useState(null);

    const isFocused = useIsFocused();

    // Function for Parts Fields
    function handlePartChange(i, value) {
        const partValues = [...fieldsParts];
        partValues[i][value.name] = value.value;
    }

    function handlePartAdd() {
        const partValues = [...fieldsParts];
        partValues.push({
            partId: null,
            partName: null,
            quantity: 0,
            imageName: 0,
        });
        setFieldsParts(partValues);
    }

    function handlePartRemove(i) {
        const partValues = [...fieldsParts];
        partValues.splice(i, 1);
        setFieldsParts(partValues);
    }

    const selectPartImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            // console.log(res);
            setIsNewPartImg(res[0]);
            setIsPartImgLoading(true);
        } catch (err) {
            setIsPartImg(null);
            if (DocumentPicker.isCancel(err)) {
                setPartImgError("Canceled");
            } else {
                setPartImgError("Unknown Error: " + JSON.stringify(err));
                throw err;
            }
        } finally {
            // uploadInsurancePolicyImage();
        }
    };

    const getVendorList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_vendor`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.states);
                setVendorList(json.vendor_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    const getPartList = async () => {
        setIsLoading2(true);
        try {
            const res = await fetch(`${API_URL}fetch_parts`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            // console.log(json);
            if (json !== undefined) {
                console.log("setPartList", json.data);
                setPartList(json.data);
                // handleServiceAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading2(false);
        }
    };

    useEffect(() => {
        setAddPartModal(false);
    }, [fieldsParts]);

    useEffect(() => {
        getPartList();
        if (route.params) {
            {
                route.params.data.order_id &&
                    setIsRepairOrderId(parseInt(route.params.data.order_id));
            }
            {
                route.params.data.customer_name &&
                    setIsCustomerName(route.params.data.customer_name);
            }
        }
    }, [isFocused]);

    return (
        <View style={styles.pageContainer}>
            {isLoading == true ? (
                <ActivityIndicator></ActivityIndicator>
            ) : (
                <InputScrollView
                    keyboardOffset={200}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardShouldPersistTaps={"always"}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>
                            Order Details:{" "}
                        </Text>
                        <View style={styles.dropDownContainer}>
                            <Picker
                                selectedValue={isVendor}
                                onValueChange={(option) => {
                                    setIsVendor(option);
                                    if (option == "new_vendor")
                                        setAddNewVendorModal(true);
                                }}
                                style={styles.dropDownField}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item label="Select Vendor" value="0" />
                                {vendorList.map((vendorList, i) => {
                                    return (
                                        <Picker.Item
                                            key={i}
                                            label={vendorList.name}
                                            value={vendorList.id}
                                        />
                                    );
                                })}
                                <Picker.Item
                                    label="Add New Vendor"
                                    value="new_vendor"
                                />
                            </Picker>
                        </View>
                        {vendorError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {vendorError}
                            </Text>
                        )}

                        <View>
                            <TouchableOpacity
                                style={styles.repairOrderField}
                                onPress={() =>
                                    navigation.navigate(
                                        "PurchaseOrderSelectOrder"
                                    )
                                }
                            ></TouchableOpacity>
                            <TextInput
                                mode="outlined"
                                label="Repair Order"
                                style={{
                                    marginTop: 10,
                                    backgroundColor: colors.white,
                                    width: "100%",
                                }}
                                placeholder="Select Repair Order"
                                value={isCustomerName}
                            />
                        </View>
                        {repairOrderError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {repairOrderError}
                            </Text>
                        )}

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>
                            Parts:
                        </Text>
                        {fieldsParts.map((field, idx) => {
                            return (
                                <>
                                    {idx != 0 && (
                                        <View
                                            style={
                                                styles.addFieldContainerGroup
                                            }
                                            key={"fieldsParts" + idx}
                                        >
                                            <TouchableOpacity
                                                style={
                                                    styles.removeEntryIconContainer
                                                }
                                                onPress={() =>
                                                    handlePartRemove(idx)
                                                }
                                            >
                                                <Icon
                                                    style={
                                                        styles.removeEntryIcon
                                                    }
                                                    name="close"
                                                    size={30}
                                                    color="#000"
                                                />
                                            </TouchableOpacity>

                                            <View
                                                style={[
                                                    styles.cardRightContent,
                                                    {
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        marginTop: 10,
                                                        marginBottom: 0,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.partNameContent,
                                                        { fontWeight: "600" },
                                                    ]}
                                                >
                                                    Part Name:{" "}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.partNameContent
                                                    }
                                                >
                                                    {fieldsParts[idx].partName}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    styles.cardRightContent,
                                                    { flex: 1 },
                                                ]}
                                            >
                                                <View
                                                    style={
                                                        styles.addFieldContainer
                                                    }
                                                    key={`parts-${field}-${idx}`}
                                                >
                                                    <TextInput
                                                        mode="outlined"
                                                        label="Quantity"
                                                        style={
                                                            styles.textEntryInput
                                                        }
                                                        placeholder="Quantity"
                                                        onChangeText={(e) => {
                                                            let parameter = {
                                                                name: "quantity",
                                                                value: e,
                                                            };
                                                            handlePartChange(
                                                                idx,
                                                                parameter
                                                            );
                                                        }}
                                                    />
                                                    {isPartImgLoading ==
                                                    true ? (
                                                        <ActivityIndicator
                                                            style={{
                                                                flex: 1,
                                                                jusifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                                marginVertical: 20,
                                                            }}
                                                        ></ActivityIndicator>
                                                    ) : (
                                                        <View
                                                            style={{
                                                                position:
                                                                    "relative",
                                                                marginTop: 20,
                                                            }}
                                                        >
                                                            <Image
                                                                resizeMode={
                                                                    "cover"
                                                                }
                                                                style={
                                                                    styles.verticleImage
                                                                }
                                                                source={{
                                                                    uri:
                                                                        WEB_URL +
                                                                        "uploads/part_img/" +
                                                                        isPartImg,
                                                                }}
                                                            />
                                                            <Icon
                                                                style={
                                                                    styles.iconChangeImage
                                                                }
                                                                onPress={
                                                                    selectPartImg
                                                                }
                                                                name={"camera"}
                                                                size={16}
                                                                color={
                                                                    colors.white
                                                                }
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={"contained"}
                                icon="plus"
                                onPress={() => {
                                    if (fieldsParts.length != 0) {
                                        setAddPartModal(true);
                                    } else {
                                        const partValues = [...fieldsParts];
                                        partValues.push({
                                            partId: null,
                                            partName: null,
                                            quantity: 0,
                                            imageName: 0,
                                        });
                                        setFieldsParts(partValues);
                                        setAddPartModal(true);
                                        setFirstPartField(false);
                                    }
                                }}
                            >
                                Add Part
                            </Button>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <Button style={{ marginTop: 15 }} mode={"contained"}>
                            Prepare Invoice
                        </Button>
                    </View>
                </InputScrollView>
            )}

            <Portal>
                <Modal
                    visible={addPartModal}
                    onDismiss={() => {
                        setAddPartModal(false);
                        setIsPart(0);
                    }}
                    contentContainerStyle={styles.modalContainerStyle}
                >
                    <Text
                        style={[
                            styles.headingStyle,
                            { marginTop: 0, alignSelf: "center" },
                        ]}
                    >
                        Add Part for Purchase Order
                    </Text>
                    {isLoading2 == true ? (
                        <ActivityIndicator></ActivityIndicator>
                    ) : (
                        <>
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isPart}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setIsPart(itemValue);
                                        if (itemIndex != 0)
                                            setIsPartName(
                                                partList[itemIndex - 1].name
                                            );
                                    }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item
                                        label="Select Part for Purchase Order"
                                        value="0"
                                    />
                                    {partList?.map((partList, i) => {
                                        return (
                                            <Picker.Item
                                                key={"part" + i}
                                                label={partList?.name}
                                                value={partList?.id}
                                            />
                                        );
                                    })}
                                    <Picker.Item
                                        label="Add Part"
                                        value="new_part"
                                    />
                                </Picker>
                            </View>
                            {partError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {partError}
                                </Text>
                            )}
                            <View style={{ flexDirection: "row" }}>
                                <Button
                                    style={{
                                        marginTop: 15,
                                        flex: 1,
                                        marginRight: 10,
                                    }}
                                    mode={"contained"}
                                    onPress={() => {
                                        if (isPart == 0) {
                                            setPartError(
                                                "Please Select Any Part"
                                            );
                                        } else {
                                            if (firstPartField === false) {
                                                let parameter = {
                                                    name: "partId",
                                                    value: isPart,
                                                };
                                                handlePartChange(
                                                    fieldsParts.length - 1,
                                                    parameter
                                                );

                                                let parameter2 = {
                                                    name: "partName",
                                                    value: isPartName,
                                                };
                                                handlePartChange(
                                                    fieldsParts.length - 1,
                                                    parameter2
                                                );

                                                setFirstPartField(true);
                                                setIsPart(0);
                                                setIsPartName(null);
                                                setPartError("");
                                                setAddPartModal(false);
                                            } else {
                                                handlePartAdd();
                                            }
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={"contained"}
                                    onPress={() => setAddPartModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    )}
                </Modal>
                <Modal
                    visible={addNewPartModal}
                    onDismiss={() => {
                        setAddNewPartModal(false);
                        setIsPart(0);
                    }}
                    contentContainerStyle={styles.modalContainerStyle}
                >
                    <Text
                        style={[
                            styles.headingStyle,
                            { marginTop: 0, alignSelf: "center" },
                        ]}
                    >
                        Add New Part
                    </Text>
                    {isLoading2 == true ? (
                        <ActivityIndicator></ActivityIndicator>
                    ) : (
                        <>
                            <View style={{ marginVertical: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="New Part Name"
                                    style={styles.modalTextInput}
                                    placeholder="New Part Name"
                                    value={isNewPartName}
                                />
                            </View>
                            {partError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {partError}
                                </Text>
                            )}
                            <View style={{ flexDirection: "row" }}>
                                <Button
                                    style={{
                                        marginTop: 15,
                                        flex: 1,
                                        marginRight: 10,
                                    }}
                                    mode={"contained"}
                                    onPress={() => {
                                        if (newPartError == "") {
                                            setNewPartError(
                                                "Please Enter Part Name"
                                            );
                                        } else {
                                            setAddNewPartModal(false);
                                            setIsNewPart("");
                                            setNewPartError("");
                                            addNewPart();
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={"contained"}
                                    onPress={() => setAddNewPartModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    )}
                </Modal>

                <Modal
                    visible={addNewVendorModal}
                    onDismiss={() => {
                        setAddNewVendorModal(false);
                        setIsVendor(0);
                    }}
                    contentContainerStyle={styles.modalContainerStyle}
                >
                    <Text
                        style={[
                            styles.headingStyle,
                            { marginTop: 0, alignSelf: "center" },
                        ]}
                    >
                        Add New Vendor
                    </Text>
                    {isLoading2 == true ? (
                        <ActivityIndicator></ActivityIndicator>
                    ) : (
                        <>
                            <View style={{ marginVertical: 10 }}>
                                <TextInput
                                    mode="outlined"
                                    label="New Vendor Name"
                                    style={styles.modalTextInput}
                                    placeholder="New Vendor Name"
                                />
                            </View>
                            {vendorError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {vendorError}
                                </Text>
                            )}
                            <View style={{ flexDirection: "row" }}>
                                <Button
                                    style={{
                                        marginTop: 15,
                                        flex: 1,
                                        marginRight: 10,
                                    }}
                                    mode={"contained"}
                                    onPress={() => setAddNewVendorModal(false)}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={"contained"}
                                    onPress={() => setAddNewVendorModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    )}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    repairOrderField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    uploadBtn: {
        color: colors.primary,
        marginBottom: 10,
    },
    iconChangeImage: {
        backgroundColor: colors.black,
        padding: 12,
        width: 40,
        height: 40,
        borderRadius: 500,
        zIndex: 10,
    },
    partNameContent: {
        fontSize: 18,
        color: colors.black,
    },
    addFieldContainerGroup: {
        marginTop: 10,
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#ecf5f9",
        padding: 10,
    },
    addFieldContainer: {
        flexDirection: "row",
        display: "flex",
        flex: 1,
        marginTop: 15,
    },
    modalTextInput: {
        fontSize: 16,
        backgroundColor: colors.white,
    },
    textEntryInput: {
        fontSize: 16,
        flex: 0.85,
        marginRight: 10,
    },
    removeEntryIconContainer: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        borderColor: colors.light_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.gray,
        position: "absolute",
        top: 10,
        right: 10,
    },
    removeEntryIcon: {
        color: colors.white,
    },
    addFieldBtnContainer: {
        flexDirection: "row",
    },
    pageContainer: {
        padding: 20,
        backgroundColor: colors.white,
    },
    input: {
        marginTop: 20,
        fontSize: 16,
    },
    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "500",
    },
    uploadButtonStyle: {
        backgroundColor: "#F3F6F8",
        borderColor: colors.light_gray,
        borderStyle: "dashed",
        borderWidth: 1,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    dropDownContainer: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 5,
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
    },
    errorTextStyle: {
        color: colors.danger,
        marginTop: 5,
        marginLeft: 5,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    modalContainerStyle: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 30,
    },
    odometerContainer: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
    },
    cardContainer: {
        marginTop: 10,
        elevation: 1,
        flex: 1,
        flexDirection: "row",
        borderColor: colors.black,
        backgroundColor: "#ecf5f9",
        padding: 10,
    },
    cardMainTitle: {
        color: "#000",
        fontSize: 17,
        fontWeight: "600",
    },
    cardTitle: {
        color: "#000",
        fontSize: 16,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(PurchaseOrder);
