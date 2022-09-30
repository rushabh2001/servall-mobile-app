import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Modal, Portal, Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from "react-native-input-scroll-view";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import CommonHeader from "../Component/CommonHeaderComponent";

// Step - 2 for Repair Order
const CounterSaleStep2 = ({
    route,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    // User / Customer Fields
    const [isUserId, setIsUserId] = useState(route?.params?.data?.user_id);
    const [isName, setIsName] = useState(route?.params?.data?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.data?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(
        route?.params?.data?.phone_number
    );

    // Vehicle Fields
    const [isPart, setIsPart] = useState("");
    const [isService, setIsService] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(true);

    const [addPartModal, setAddPartModal] = useState(false);
    const [addServiceModal, setAddServiceModal] = useState(false);

    const [serviceError, setServiceError] = useState();
    const [serviceList, setServiceList] = useState([]);

    const [partError, setPartError] = useState();
    const [partList, setPartList] = useState([]);
    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(0);
    const [partsTotal, setPartsTotal] = useState(0);
    const [isTotal, setIsTotal] = useState(0);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const [fields, setFields] = useState([
        {
            serviceName: null,
            rate: null,
            quantity: 0,
            discount: 0,
            applicableDiscountForItem: 0,
            totalForThisService: 0,
        },
    ]);
    const [fieldsParts, setFieldsParts] = useState([
        {
            serviceName: null,
            rate: null,
            quantity: 0,
            discount: 0,
            applicableDiscountForItem: 0,
            totalForThisService: 0,
        },
    ]);

    function handleServiceChange(i, value) {
        const values = [...fields];
        values[i][value.name] = value.value;
        values[i]["totalForThisService"] =
            values[i]["rate"] * values[i]["quantity"] -
            values[i]["rate"] *
                values[i]["quantity"] *
                (values[i]["discount"] / 100);
        setFields(values);
        serviceTotals[i] = values[i]["totalForThisService"];

        let total = 0;
        values.forEach((item) => {
            total += item.totalForThisService;
        });
        setServicesTotal(total);
        setIsTotal(total + partsTotal);

        values[i]["applicableDiscountForItem"] =
            values[i]["rate"] *
            values[i]["quantity"] *
            (values[i]["discount"] / 100);
        let discountTotal = 0;
        values.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalPartDiscount);
    }

    function handleServiceAdd() {
        const values = [...fields];
        values.push({
            serviceName: null,
            rate: null,
            quantity: 0,
            discount: 0,
            applicableDiscountForItem: 0,
            totalForThisService: 0,
        });
        setFields(values);
    }

    function handleServiceRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    // Function for Parts Fields
    function handlePartChange(i, value) {
        const partValues = [...fieldsParts];

        // Calculation of Specific Part's total
        partValues[i][value.name] = value.value;
        partValues[i]["totalForThisService"] =
            partValues[i]["rate"] * partValues[i]["quantity"] -
            partValues[i]["rate"] *
                partValues[i]["quantity"] *
                (partValues[i]["discount"] / 100);
        setFieldsParts(partValues);
        partTotals[i] = partValues[i]["totalForThisService"];

        // Calculation of Total of all Parts
        let total = 0;
        partValues.forEach((item) => {
            total += item.totalForThisService;
        });
        setPartsTotal(total);

        // Calculate Total of Order
        setIsTotal(total + servicesTotal);
        partValues[i]["applicableDiscountForItem"] =
            partValues[i]["rate"] *
            partValues[i]["quantity"] *
            (partValues[i]["discount"] / 100);
        let discountTotal = 0;
        partValues.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });

        setIsTotalPartDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalServiceDiscount);
        console.log(partValues);
    }

    function handlePartAdd() {
        const partValues = [...fieldsParts];
        partValues.push({
            serviceName: null,
            rate: null,
            quantity: null,
            discount: 0,
            applicableDiscount: 0,
            totalForThisService: null,
        });
        setFieldsParts(partValues);
    }

    function handlePartRemove(i) {
        const partValues = [...fieldsParts];
        partValues.splice(i, 1);
        setFieldsParts(partValues);
    }

    const changeEstimateDeliverySelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate;
            let formattedDate = moment(currentDate, "YYYY MMMM D", true).format(
                "DD-MM-YYYY"
            );
            setDisplayDeliveryDateCalender(false);
            let formattedDate2 = new Date(currentDate);
            setIsDeliveryDate(formattedDate2);
            setIsDeliveryDate1(formattedDate);
            setDisplayDeliveryTimeClock(true);
        } else if(event.type == 'dismissed') {
            setDisplayDeliveryDateCalender(false);
        }
    };

    const changeSelectedTime = (event, selectedTime) => {
        if (selectedTime != null) {
            let currentTime = selectedTime;
            let convertToTime = moment(
                currentTime,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("hh:mm A");
            var formattedDate = isDeliveryDate1 + " " + convertToTime;
            setDisplayDeliveryTimeClock(false);
            setEstimateDeliveryDateTime(formattedDate);
            setIsDeliveryTime(new Date(currentTime));
        }
    };

    // Parts Functions ----- End Here
    const getPartList = async () => {
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
            if (json !== undefined) {
                setPartList(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading2(false);
        }
    };

    useEffect(() => {
        getPartList();
        console.log(route?.params?.data);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.pageContainer}>
                {isLoading == true ? (
                    <ActivityIndicator></ActivityIndicator>
                ) : (
                    <InputScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                        }}
                        keyboardOffset={200}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardShouldPersistTaps={"always"}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[styles.headingStyle, { marginTop: 20 }]}
                            >
                                Order Details:{" "}
                            </Text>
                            <View style={styles.cardContainer}>
                                <View
                                    style={[
                                        styles.cardRightContent,
                                        { flex: 1 },
                                    ]}
                                >
                                    <Text style={styles.cardTitle}>
                                        Name: {isName}
                                    </Text>
                                    <Text style={styles.cardTitle}>
                                        Email: {isEmail}
                                    </Text>
                                    <Text style={styles.cardTitle}>
                                        Phone Number: {isPhoneNumber}
                                    </Text>
                                </View>
                            </View>

                            <Text
                                style={[styles.headingStyle, { marginTop: 20 }]}
                            >
                                Service:
                            </Text>

                            {fields.map((field, idx) => {
                                return (
                                    <>
                                        {idx != 0 && (
                                            <View
                                                style={
                                                    styles.addFieldContainerGroup
                                                }
                                                key={"fields" + idx}
                                            >
                                                <TouchableOpacity
                                                    style={
                                                        styles.removeEntryIconContainer
                                                    }
                                                    onPress={() =>
                                                        handleServiceRemove(idx)
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
                                                            flexDirection:
                                                                "row",
                                                            marginTop: 10,
                                                            marginBottom: 0,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.partNameContent,
                                                            {
                                                                fontWeight:
                                                                    "600",
                                                            },
                                                        ]}
                                                    >
                                                        Service Name:{" "}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.serviceNameContent
                                                        }
                                                    >
                                                        Oil Change
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
                                                        key={`service-${field}-${idx}`}
                                                    >
                                                        <TextInput
                                                            mode="outlined"
                                                            label="Rate"
                                                            style={
                                                                styles.textEntryInput
                                                            }
                                                            placeholder="Rate"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "rate",
                                                                        value: e,
                                                                    };
                                                                handleServiceChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                        <TextInput
                                                            mode="outlined"
                                                            label="Quantity"
                                                            style={
                                                                styles.textEntryInput
                                                            }
                                                            placeholder="Quantity"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "quantity",
                                                                        value: e,
                                                                    };
                                                                handleServiceChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                        <TextInput
                                                            mode="outlined"
                                                            label="Discount"
                                                            style={
                                                                styles.textEntryInput
                                                            }
                                                            placeholder="Discount"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "discount",
                                                                        value: e,
                                                                    };
                                                                handleServiceChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: colors.black,
                                                                marginTop: 15,
                                                                marginBottom: 0,
                                                                fontWeight:
                                                                    "600",
                                                            }}
                                                        >
                                                            Total for this
                                                            Service:{" "}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: colors.black,
                                                                marginTop: 15,
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            {fields[idx]
                                                                ? fields[idx][
                                                                      "totalForThisService"
                                                                  ]
                                                                : 0}
                                                        </Text>
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
                                        setAddServiceModal(true);
                                    }}
                                >
                                    Add Service
                                </Button>
                                <View style={{ flex: 0.5 }}></View>
                            </View>

                            <Text
                                style={[styles.headingStyle, { marginTop: 20 }]}
                            >
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
                                                            flexDirection:
                                                                "row",
                                                            marginTop: 10,
                                                            marginBottom: 0,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.partNameContent,
                                                            {
                                                                fontWeight:
                                                                    "600",
                                                            },
                                                        ]}
                                                    >
                                                        Part Name:{" "}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.partNameContent
                                                        }
                                                    >
                                                        Oil Change
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
                                                            label="Rate"
                                                            style={[
                                                                styles.textEntryInput,
                                                            ]}
                                                            placeholder="Rate"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "rate",
                                                                        value: e,
                                                                    };
                                                                handlePartChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                        <TextInput
                                                            mode="outlined"
                                                            label="Quantity"
                                                            style={
                                                                styles.textEntryInput
                                                            }
                                                            placeholder="Quantity"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "quantity",
                                                                        value: e,
                                                                    };
                                                                handlePartChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                        <TextInput
                                                            mode="outlined"
                                                            label="Discount"
                                                            style={
                                                                styles.textEntryInput
                                                            }
                                                            placeholder="Discount"
                                                            onChangeText={(
                                                                e
                                                            ) => {
                                                                let parameter =
                                                                    {
                                                                        name: "discount",
                                                                        value: e,
                                                                    };
                                                                handlePartChange(
                                                                    idx,
                                                                    parameter
                                                                );
                                                            }}
                                                        />
                                                    </View>

                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: colors.black,
                                                                marginTop: 15,
                                                                marginBottom: 0,
                                                                fontWeight:
                                                                    "600",
                                                            }}
                                                        >
                                                            Total for the Part:{" "}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: colors.black,
                                                                marginTop: 15,
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            {fieldsParts[idx]
                                                                ? fieldsParts[
                                                                      idx
                                                                  ][
                                                                      "totalForThisService"
                                                                  ]
                                                                : 0}
                                                        </Text>
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
                                        setAddPartModal(true);
                                    }}
                                >
                                    Add Part
                                </Button>
                                <View style={{ flex: 0.5 }}></View>
                            </View>

                            {/* Fieldset - Totals */}
                            <Text
                                style={[styles.headingStyle, { marginTop: 20 }]}
                            >
                                Totals:
                            </Text>
                            <View style={styles.totalFieldContainerGroup}>
                                <View style={styles.totalFieldsGroup}>
                                    <View
                                        style={[
                                            styles.totalFieldsLeftContent,
                                            { flex: 0.8 },
                                        ]}
                                    >
                                        <Text style={styles.partNameContent}>
                                            Services Total
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.totalFieldsRightContent,
                                            { flex: 1 },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.totalFieldTextContainer
                                            }
                                        >
                                            INR{" "}
                                        </Text>
                                        <View
                                            style={styles.totalFieldContainer}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: colors.black,
                                                }}
                                            >
                                                {servicesTotal}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.totalFieldsGroup}>
                                    <View
                                        style={[
                                            styles.totalFieldsLeftContent,
                                            { flex: 0.8 },
                                        ]}
                                    >
                                        <Text style={styles.partNameContent}>
                                            Parts Total
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.totalFieldsRightContent,
                                            { flex: 1 },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.totalFieldTextContainer
                                            }
                                        >
                                            INR{" "}
                                        </Text>
                                        <View
                                            style={styles.totalFieldContainer}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: colors.black,
                                                }}
                                            >
                                                {partsTotal}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.totalFieldsGroup}>
                                    <View
                                        style={[
                                            styles.totalFieldsLeftContent,
                                            { flex: 0.8 },
                                        ]}
                                    >
                                        <Text style={styles.partNameContent}>
                                            Applicable Discount
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.totalFieldsRightContent,
                                            { flex: 1 },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.totalFieldTextContainer
                                            }
                                        >
                                            INR{" "}
                                        </Text>
                                        <View
                                            style={styles.totalFieldContainer}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: colors.black,
                                                }}
                                            >
                                                {isApplicableDiscount}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.totalFieldsGroup}>
                                    <View
                                        style={[
                                            styles.totalFieldsLeftContent,
                                            { flex: 0.9 },
                                        ]}
                                    >
                                        <Text style={styles.partNameContent}>
                                            Total {"\n"} (Inclusive of Taxes)
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.totalFieldsRightContent,
                                            { flex: 1 },
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.totalFieldTextContainer
                                            }
                                        >
                                            INR{" "}
                                        </Text>
                                        <View
                                            style={styles.totalFieldContainer}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: colors.black,
                                                }}
                                            >
                                                {isTotal}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Button
                                style={{ marginTop: 15 }}
                                mode={"contained"}
                            >
                                Prepare Invoice
                            </Button>
                        </View>
                    </InputScrollView>
                )}

                <Portal>
                    <Modal
                        visible={addServiceModal}
                        onDismiss={() => {
                            setAddServiceModal(false);
                            setIsService(0);
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Service
                        </Text>
                        {isLoading2 == true ? (
                            <ActivityIndicator></ActivityIndicator>
                        ) : (
                            <>
                                <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isService}
                                        onValueChange={(option) => {
                                            setIsService(option);
                                        }}
                                        style={styles.dropDownField}
                                        itemStyle={{ padding: 0 }}
                                    >
                                        <Picker.Item
                                            label="Select Service"
                                            value="0"
                                        />
                                        {serviceList?.map((serviceList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={"part" + i}
                                                    label={serviceList?.name}
                                                    value={serviceList?.id}
                                                />
                                            );
                                        })}
                                    </Picker>
                                </View>
                                {serviceError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {serviceError}
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
                                        onPress={() => handleServiceAdd()}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        style={{ marginTop: 15, flex: 1 }}
                                        mode={"contained"}
                                        onPress={() =>
                                            setAddServiceModal(false)
                                        }
                                    >
                                        Close
                                    </Button>
                                </View>
                            </>
                        )}
                    </Modal>
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
                            Add New Part
                        </Text>
                        {isLoading2 == true ? (
                            <ActivityIndicator></ActivityIndicator>
                        ) : (
                            <>
                                <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isPart}
                                        onValueChange={(option) => {
                                            setIsPart(option);
                                        }}
                                        style={styles.dropDownField}
                                        itemStyle={{ padding: 0 }}
                                    >
                                        <Picker.Item
                                            label="Select Part"
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
                                        onPress={() => handlePartAdd()}
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
                </Portal>
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
    totalFieldsGroup: {
        flexDirection: "row",
        marginBottom: 10,
    },
    serviceNameContent: {
        fontSize: 17,
        color: colors.black,
    },
    partNameContent: {
        fontSize: 18,
        color: colors.black,
    },
    totalFieldTextContainer: {
        flex: 0.23,
        fontSize: 18,
        color: colors.black,
        marginLeft: 10,
    },
    totalFieldContainer: {
        flex: 0.77,
    },
    totalFieldsRightContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    totalFieldsLeftContent: {
        justifyContent: "center",
        paddingLeft: 10,
    },
    totalFieldContainerGroup: {
        marginTop: 10,
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#ecf5f9",
        padding: 10,
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
    textEntryInput: {
        fontSize: 16,
        flex: 0.33,
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
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: "center",
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
    datePickerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 20,
    },
    datePickerField: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: "absolute",
        right: 7,
        top: 12,
        zIndex: 2,
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
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(CounterSaleStep2);
