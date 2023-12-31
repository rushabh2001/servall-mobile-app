import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    FlatList,
    Alert,
    Platform,
} from "react-native";
import {
    Modal,
    Portal,
    Button,
    TextInput,
    List,
    Divider,
} from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import InputScrollView from "react-native-input-scroll-view";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SliderPicker } from "react-native-slider-picker";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

// Edit Repair Order
const EditRepairOrder = ({
    navigation,
    route,
    userToken,
}) => {
    // User / Customer Fields
    const [isGarageId, setIsGarageId] = useState(
        route?.params?.data?.garage_id
    );
    const [isOrderId, setIsOrderId] = useState(route?.params?.data?.order_id);
    const [isUserId, setIsUserId] = useState(route?.params?.data?.user_id);
    const [isVehicleId, setIsVehicleId] = useState(
        route?.params?.data?.vehicle_id
    );
    const [isName, setIsName] = useState(route?.params?.data?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.data?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(
        route?.params?.data?.phone_number
    );

    // Vehicle Fields
    const [isBrandName, setIsBrandName] = useState(
        route?.params?.data?.brand_name
    );
    const [isModelName, setIsModelName] = useState(
        route?.params?.data?.model_name
    );
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] =
        useState(route?.params?.data?.vehicle_registration_number);

    const [isOdometerKMs, setIsOdometerKMs] = useState(
        route?.params?.data?.odometer
    );
    const [isFuelLevel, setIsFuelLevel] = useState(
        route?.params?.data?.fuel_level
    );

    const [isVehicleImg, setIsVehicleImg] = useState(
        route?.params?.data?.orderimage
    );
    const [vehicleImgError, setVehicleImgError] = useState();

    const [isComment, setIsComment] = useState(route?.params?.data?.comment);

    const [isOrderStatus, setIsOrderStatus] = useState(
        route?.params?.data?.status
    );

    const [isNewService, setIsNewService] = useState("");
    const [newServiceError, setNewServiceError] = useState();
    const [addNewServiceModal, setAddNewServiceModal] = useState(false);

    const [isNewPart, setIsNewPart] = useState("");
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    const [odometerKMsError, setOdometerKMsError] = useState();

    const [isEstimatedDeliveryDateTime, setIsEstimatedDeliveryDateTime] =
        useState(route?.params?.data?.estimated_delivery_time);
    const [estimatedDeliveryDateTime, setEstimatedDeliveryDateTime] = useState(
        moment(
            route?.params?.data?.estimated_delivery_time,
            "YYYY-MM-DD hh:mm:ss"
        ).format("DD-MM-YYYY hh:mm A")
    );
    const [displayDeliveryDateCalender, setDisplayDeliveryDateCalender] =
        useState(false);
    const [displayDeliveryTimeClock, setDisplayDeliveryTimeClock] =
        useState(false);
    const [isDeliveryDate, setIsDeliveryDate] = useState();
    const [isDeliveryDate1, setIsDeliveryDate1] = useState("");
    const [isDeliveryTime, setIsDeliveryTime] = useState();
    const [estimateDeliveryDateError, setEstimateDeliveryDateError] =
        useState();

    const [isLoading, setIsLoading] = useState(false);

    const [serviceError, setServiceError] = useState();
    const [serviceList, setServiceList] = useState([]);
    const [partList, setPartList] = useState([]);

    const [partError, setPartError] = useState();
    const [orderStatusError, setOrderStatusError] = useState();

    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(
        parseInt(route?.params?.data?.labor_total)
    );
    const [partsTotal, setPartsTotal] = useState(
        parseInt(route?.params?.data?.parts_total)
    );
    const [isTotal, setIsTotal] = useState(
        parseInt(route?.params?.data?.total)
    );
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const [fieldsServices, setFieldsServices] = useState([]);
    const [fieldsParts, setFieldsParts] = useState([]);

    const [partListModal, setPartListModal] = useState(false);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState();

    const [searchQueryForServices, setSearchQueryForServices] = useState();
    const [filteredServiceData, setFilteredServiceData] = useState([]);
    const [serviceListModal, setServiceListModal] = useState(false);

    function handleServiceChange(i, value) {
        const values = [...fieldsServices];

        // Calculation of Specific Part's total
        values[i][value.name] = value.value;
        values[i]["amount"] =
            values[i]["rate"] * values[i]["qty"] -
            values[i]["rate"] *
                values[i]["qty"] *
                (values[i]["discount"] / 100);
        serviceTotals[i] = values[i]["amount"];

        // Calculation of Total of all Parts
        let total = 0;
        values.forEach((item) => {
            total += parseInt(item.amount);
        });
        setServicesTotal(parseInt(total));
        setIsTotal(parseInt(total) + parseInt(partsTotal));

        // Calculate Total of Order
        values[i]["applicableDiscountForItem"] =
            values[i]["rate"] *
            values[i]["qty"] *
            (values[i]["discount"] / 100);
        let discountTotal = 0;
        values.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(parseInt(discountTotal));
        setIsApplicableDiscount(
            parseInt(discountTotal) + parseInt(isTotalPartDiscount)
        );
    }

    function handleServiceAdd(data) {
        const values = [...fieldsServices];
        // console.log("check", values);
        // console.log("data", data.service_id);
        var keyword = data.service_id;
        const isObjectPresent = values.find((o) => o.service_id === keyword);
        // console.log("isObjectPresent", isObjectPresent);
        if (!isObjectPresent) {
            values.push({
                service_id: data.service_id,
                serviceName: data.serviceName,
                rate: 0,
                qty: 0,
                discount: 0,
                applicableDiscountForItem: 0,
                amount: 0,
            });
            setFieldsServices(values);
            setServiceListModal(false);
        } else {
            setServiceListModal(false);
            alert("Already added service.");
        }
    }

    function handleServiceRemove(i) {
        // Remove Field from Array Javascript
        const values = [...fieldsServices];
        values.splice(i, 1);
        setFieldsServices(values);

        // Recalculation of Totals
        let total = 0;
        values.forEach((item) => {
            total += parseInt(item.amount);
        });
        setServicesTotal(total);
        setIsTotal(parseInt(total) + parseInt(partsTotal));

        // Calculate Total of Order
        let discountTotal = 0;
        values.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(discountTotal);
        setIsApplicableDiscount(
            parseInt(discountTotal) + parseInt(isTotalPartDiscount)
        );
    }

    // Function for Parts Fields
    function handlePartChange(i, value) {
        const partValues = [...fieldsParts];

        // Calculation of Specific Part's total
        partValues[i][value.name] = value.value;
        partValues[i]["amount"] =
            partValues[i]["rate"] * partValues[i]["qty"] -
            partValues[i]["rate"] *
                partValues[i]["qty"] *
                (partValues[i]["discount"] / 100);
        setFieldsParts(partValues);
        partTotals[i] = partValues[i]["amount"];

        // Calculation of Total of all Parts
        let total = 0;
        partValues.forEach((item) => {
            total += parseInt(item.amount);
        });
        setPartsTotal(parseInt(total));

        // Calculate Total of Order
        setIsTotal(parseInt(total) + parseInt(servicesTotal));
        partValues[i]["applicableDiscountForItem"] =
            partValues[i]["rate"] *
            partValues[i]["qty"] *
            (partValues[i]["discount"] / 100);
        let discountTotal = 0;
        partValues.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalPartDiscount(parseInt(discountTotal));
        setIsApplicableDiscount(
            parseInt(discountTotal) + parseInt(isTotalServiceDiscount)
        );
    }

    function handlePartAdd(data) {
        const partValues = [...fieldsParts];
        // console.log("check", partValues);
        // console.log("data", data);
        var keyword = data.parts_id;
        const isObjectPresent = partValues.find((o) => o.parts_id === keyword);
        // console.log("isObjectPresent", isObjectPresent);
        if (!isObjectPresent) {
            partValues.push({
                parts_id: data.parts_id,
                partName: data.partName,
                rate: 0,
                qty: 0,
                discount: 0,
                applicableDiscount: 0,
                amount: 0,
            });
            setFieldsParts(partValues);
            setPartListModal(false);
        } else {
            setPartListModal(false);
            alert("Already added parts.");
        }
    }

    function handlePartRemove(i) {
        // Remove Field from Array Javascript
        const partValues = [...fieldsParts];
        partValues.splice(i, 1);
        setFieldsParts(partValues);

        // Recalculation of Totals
        let total = 0;
        partValues.forEach((item) => {
            total += item.amount;
        });
        setPartsTotal(parseInt(total));

        // Calculate Total of Order
        setIsTotal(parseInt(total) + parseInt(servicesTotal));
        let discountTotal = 0;
        partValues.forEach((item) => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalPartDiscount(discountTotal);
        setIsApplicableDiscount(
            parseInt(discountTotal) + parseInt(isTotalServiceDiscount)
        );
    }

    const selectVehicleImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true,
            });
            setIsVehicleImg(res);
        } catch (err) {
            setIsVehicleImg(null);
            if (DocumentPicker.isCancel(err)) {
                setVehicleImgError("Canceled");
            } else {
                setVehicleImgError("Unknown Error: " + JSON.stringify(err));
                throw err;
            }
        }
    };

    const changeEstimateDeliverySelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || isEstimatedDeliveryDateTime;
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
            let currentTime = selectedTime || isEstimatedDeliveryDateTime;
            let convertToTime = moment(
                currentTime,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("hh:mm A");
            var formattedDate = isDeliveryDate1 + " " + convertToTime;
            setDisplayDeliveryTimeClock(false);
            setEstimatedDeliveryDateTime(formattedDate);
            setIsDeliveryTime(new Date(currentTime));
        }
    };

    const validate = () => {
        return !(
            // !isOrderStatus ||
            // isOrderStatus === 0 ||
            !isOdometerKMs ||
            isOdometerKMs?.trim().length === 0 ||
            (!fieldsServices && !fieldsParts) ||
            (fieldsServices.length === 0 && fieldsParts.length === 0) ||
            !estimatedDeliveryDateTime ||
            estimatedDeliveryDateTime?.trim().length === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (
                !estimatedDeliveryDateTime ||
                estimatedDeliveryDateTime?.trim().length === 0
            )
                setEstimateDeliveryDateError(
                    "Estimate Delivery Date is required"
                );
            else setEstimateDeliveryDateError("");
            // if (!isOrderStatus || isOrderStatus?.trim().length === 0)
            //     setOrderStatusError("Order Status is required");
            // else setOrderStatusError("");
            if (
                (!fieldsParts &&
                !fieldsServices) || (fieldsServices.length === 0 && fieldsParts.length === 0)
            )  alert("Minimum 1 service or part should be added in order!");
            if (!isOdometerKMs)
                setOdometerKMsError("Odometer Kilometer is required");
            else setOdometerKMsError("");
           
            return;
        }

        const data = new FormData();
        data.append("garage_id", parseInt(isGarageId));
        data.append("user_id", parseInt(isUserId));
        data.append("vehicle_id", parseInt(isVehicleId));
        data.append("odometer", parseInt(isOdometerKMs));
        data.append("fuel_level", parseInt(isFuelLevel));
        data.append("order_service", JSON.stringify(fieldsServices));
        data.append("order_parts", JSON.stringify(fieldsParts));
        data.append(
            "estimated_delivery_time",
            moment(estimatedDeliveryDateTime, "DD-MM-YYYY hh:mm A").format(
                "YYYY-MM-DD hh:mm:ss"
            )
        );
        data.append("status", isOrderStatus);
        data.append("labor_total", parseInt(servicesTotal));
        data.append("parts_total", parseInt(partsTotal));
        data.append("discount", 0);
        // if(isVehicleImg != null) data.append("orderimage", isVehicleImg);
        data.append("total", parseInt(isTotal));
        if(isComment) data.append("comment", isComment?.trim());

        editOrder(data);
        // console.log(JSON.stringify(data));
    };

    const editOrder = async (data) => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}update_order/${isOrderId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data; ",
                    Authorization: "Bearer " + userToken,
                },
                body: data,
            })
                .then((res) => {
                    const statusCode = res.status;
                    let data;
                    return res.json().then((obj) => {
                        data = obj;
                        return { statusCode, data };
                    });
                })
                .then((res) => {
                    setIsLoading(false);
                   if (res.statusCode == 201 || res.statusCode == 200) {
                        navigation.popToTop();
                        if (isOrderStatus =="Vehicle Received") {
                            navigation.navigate("OpenOrderList");
                        } else if (isOrderStatus == "Work in Progress Order") {
                            navigation.navigate("WIPOrderList");
                        } else if (isOrderStatus == "Vehicle Ready") {
                            navigation.navigate("VehicleReadyOrderList");
                        } else if (isOrderStatus == "Completed Order") {
                            navigation.navigate("OrderCompletedList");
                        }
                    } else if (res.statusCode == 400) {
                        let errors_message = [];
                        Object.entries(res.data.message).map(([key, error], i) => {
                            error.map((item, index) => {
                                errors_message.push(item);
                            })
                        });
                        Alert.alert(
                            "Alert.",
                            errors_message[0],
                            [
                                { text: "OK", }
                            ]
                        );
                        return;
                    } else {
                        Alert.alert(
                            "Alert.",
                            'Something went wrong! Please try again later.',
                            [
                                { text: "OK", }
                            ]
                        );
                    }
                });
        } catch (e) {
            console.log(e);
        } 
    };

    const getPartList = async () => {
        setIsLoading(true)
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
                setFilteredPartData(json.data);
                // setPartList([...partList, ...json.data.data]);
                // setFilteredPartData([...filteredPartData, ...json.data.data]);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForParts = async () => {
        if (searchQueryForParts) {
            const newData = filteredPartData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForParts.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            console.log('data', newData)
            setFilteredPartData(newData);
        } else {
            setFilteredPartData(partList);
        }
    };

    const getServiceList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_service`,
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
                setServiceList(json.data);
                setFilteredServiceData(json.data);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForServices = async () => {
        if (searchQueryForServices) {
            const newData = filteredServiceData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForServices.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            console.log('data', newData)
            setFilteredServiceData(newData);
        } else {
            setFilteredServiceData(serviceList);
        }
    };

    const addNewService = async () => {
        try {
            const res = await fetch(`${API_URL}add_service`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    name: isNewService,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                getServiceList();
                let data = {
                    service_id: json.data.id,
                    serviceName: json.data.name,
                };
                handleServiceAdd(data);
                setAddNewServiceModal(false);
                setIsNewService("");
                setNewServiceError("");
            }
        } catch (e) {
            console.log(e);
            setNewServiceError("Service name has already been taken.");
        }
    };

    const addNewPart = async () => {
        try {
            const res = await fetch(`${API_URL}add_parts`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    name: isNewPart,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                setIsLoading(true);
                getPartList();
                let data = {
                    parts_id: json.data.id,
                    partName: json.data.name,
                };
                handlePartAdd(data);

                setAddNewPartModal(false);
                setIsNewPart("");
                setNewPartError("");
            }
        } catch (e) {
            console.log(e);
            setNewPartError("Part name has already been taken.");
        }
    };

    useEffect(() => {
        let values = [...fieldsServices];
        route?.params?.data?.services_list.forEach((item) => {
            values.push({
                id: item.id,
                service_id: item.service_id,
                serviceName: item.service.name,
                rate: item.rate,
                qty: item.qty,
                discount: item.discount,
                applicableDiscountForItem:
                    item.rate * item.qty * (item.discount / 100),
                amount: item.amount,
            });
        });
        setFieldsServices(values);
        let values2 = [...fieldsParts];
        route?.params?.data?.parts_list.forEach((item) => {
            values2.push({
                id: item.id,
                parts_id: item.parts_id,
                partName: item.parts.name,
                rate: item.rate,
                qty: item.qty,
                discount: item.discount,
                applicableDiscountForItem:
                    item.rate * item.qty * (item.discount / 100),
                amount: item.amount,
            });
        });
        setFieldsParts(values2);

        // Calculate Total of Order
        let discountServicesTotal = 0;
        values.forEach((item) => {
            discountServicesTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(discountServicesTotal);
        let discountPartsTotal = 0;
        values2.forEach((item) => {
            discountPartsTotal += item.applicableDiscountForItem;
        });
        setIsTotalPartDiscount(discountPartsTotal);

        let totalDiscount = (discountPartsTotal + discountServicesTotal);
        setIsApplicableDiscount(parseInt(totalDiscount));

    }, [route?.params?.data]);

    useEffect(() => {
        getServiceList();
        getPartList();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.pageContainer}>
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
                                    { flex: 0.5 },
                                ]}
                            >
                                <Text style={styles.cardMainTitle}>
                                    Customer Details:
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isName}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isEmail}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isPhoneNumber}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.cardRightContent,
                                    { flex: 0.5 },
                                ]}
                            >
                                <Text style={styles.cardMainTitle}>
                                    Vehicle Details:
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isBrandName}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isModelName}
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {isVehicleRegistrationNumber}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Service:
                        </Text>

                        {fieldsServices.map((field, idx) => {
                            return (
                                <>
                                    <View
                                        style={
                                            styles.addFieldContainerGroup
                                        }
                                        key={`service-${field}-${idx}`}
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
                                                Service Name:{" "}
                                            </Text>
                                            <Text
                                                style={
                                                    styles.serviceNameContent
                                                }
                                            >
                                                {
                                                    fieldsServices[idx]
                                                        .serviceName
                                                }
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
                                            >
                                                <TextInput
                                                    mode="outlined"
                                                    label="Rate"
                                                    style={
                                                        styles.textEntryInput
                                                    }
                                                    placeholder="Rate"
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsServices[idx]
                                                            .rate
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
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
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsServices[idx]
                                                            .qty
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
                                                            name: "qty",
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
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsServices[idx]
                                                            .discount
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
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
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        color: colors.black,
                                                        marginTop: 15,
                                                        marginBottom: 0,
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Total for this Service:{" "}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        color: colors.black,
                                                        marginTop: 15,
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    {fieldsServices[idx]
                                                        ? fieldsServices[
                                                                idx
                                                            ].amount
                                                        : 0}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={"contained"}
                                icon="plus"
                                onPress={() => setServiceListModal(true)}
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
                                    <View
                                        style={
                                            styles.addFieldContainerGroup
                                        }
                                        key={`fieldsParts-${field}-${idx}`}
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
                                            >
                                                <TextInput
                                                    mode="outlined"
                                                    label="Rate"
                                                    style={[
                                                        styles.textEntryInput,
                                                    ]}
                                                    placeholder="Rate"
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsParts[idx]
                                                            .rate
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
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
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsParts[idx].qty
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
                                                            name: "qty",
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
                                                    keyboardType="numeric"
                                                    value={
                                                        fieldsParts[idx]
                                                            .discount
                                                    }
                                                    onChangeText={(e) => {
                                                        let parameter = {
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
                                                    flexDirection: "row",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        color: colors.black,
                                                        marginTop: 15,
                                                        marginBottom: 0,
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Total for this Part:{" "}
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
                                                        ? fieldsParts[idx]
                                                                .amount
                                                        : 0}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={"contained"}
                                icon="plus"
                                onPress={() => setPartListModal(true)}
                            >
                                Add Part
                            </Button>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

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

                        {/* <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Vehicle Images:
                        </Text>

                        <View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.uploadButtonStyle}
                                onPress={selectVehicleImg}
                            >
                                <Icon
                                    name="upload"
                                    size={18}
                                    color={colors.primary}
                                    style={styles.downloadIcon}
                                />
                                <Text
                                    style={{
                                        marginRight: 10,
                                        fontSize: 18,
                                        color: "#000",
                                    }}
                                >
                                    Upload Vehicle Image
                                </Text>
                                {isVehicleImg != null ? (
                                    <Text style={styles.textStyle}>
                                        File Name:
                                        {isVehicleImg?.map(
                                            (isVehicleImg) => {
                                                return (
                                                    isVehicleImg.name + ", "
                                                );
                                            }
                                        )}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View> */}

                        <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Additional Information:
                        </Text>

                        {/* <View
                            style={{
                                borderBottomWidth: 1,
                                borderColor: colors.light_gray,
                                borderRadius: 4,
                                marginTop: 20,
                                backgroundColor: "#F0F2F5",
                            }}
                        >
                            <Picker
                                selectedValue={isOrderStatus}
                                onValueChange={(v) => {
                                    setIsOrderStatus(v);
                                }}
                                style={{ padding: 0 }}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item
                                    key={1}
                                    label="Select Order Status"
                                    value="0"
                                />
                                <Picker.Item
                                    key={2}
                                    label="Vehicle Received"
                                    value="Vehicle Received"
                                />
                                <Picker.Item
                                    key={3}
                                    label="Work in Progress Order"
                                    value="Work in Progress Order"
                                />
                                <Picker.Item
                                    key={4}
                                    label="Vehicle Ready"
                                    value="Vehicle Ready"
                                />
                                <Picker.Item
                                    key={5}
                                    label="Completed Order"
                                    value="Completed Order"
                                />
                            </Picker>
                        </View>
                        {orderStatusError?.length > 0 && (
                            <Text style={{ color: colors.danger }}>
                                {orderStatusError}
                            </Text>
                        )} */}

                        <TextInput
                            mode="outlined"
                            label="Odometer (in KMs)"
                            style={styles.input}
                            placeholder="Odometer (in KMs)"
                            value={isOdometerKMs}
                            onChangeText={(text) => setIsOdometerKMs(text)}
                            keyboardType="numeric"
                        />
                        {odometerKMsError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {odometerKMsError}
                            </Text>
                        )}

                        <View style={styles.odometerContainer}>
                            <SliderPicker
                                minLabel={"Empty"}
                                maxLabel={"Full"}
                                minValue={0}
                                maxValue={10}
                                callback={(position) => {
                                    setIsFuelLevel(position);
                                }}
                                defaultValue={parseInt(isFuelLevel)}
                                showFill={true}
                                fillColor={"green"}
                                labelFontWeight={"500"}
                                labelFontSize={14}
                                labelFontColor={colors.default_theme.black}
                                showNumberScale={false}
                                showSeparatorScale={true}
                                buttonBackgroundColor={"#fff"}
                                buttonBorderColor={"#6c7682"}
                                buttonBorderWidth={1}
                                scaleNumberFontWeight={"300"}
                                buttonDimensionsPercentage={6}
                                heightPercentage={1}
                                widthPercentage={80}
                                labelStylesOverride={{ marginTop: 25 }}
                            />
                            <Text
                                style={{
                                    fontWeight: "600",
                                    fontSize: 18,
                                    color: colors.black,
                                }}
                            >
                                Fuel Level: {isFuelLevel}
                            </Text>
                        </View>

                        <TextInput
                            mode="outlined"
                            label="Comment"
                            style={styles.input}
                            placeholder="Comment"
                            value={isComment}
                            onChangeText={(text) => setIsComment(text)}
                            numberOfLines={3}
                            multiline={true}
                        />

                        <TouchableOpacity
                            style={{ flex: 1, marginTop: 20 }}
                            onPress={() =>
                                setDisplayDeliveryDateCalender(true)
                            }
                        >
                            <TextInput
                                mode="outlined"
                                label="Estimate Delivery Time"
                                placeholder="Estimate Delivery Time"
                                value={estimatedDeliveryDateTime}
                                editable={false}
                                right={
                                    <TextInput.Icon name="calendar-month" />
                                }
                            />
                            {displayDeliveryDateCalender == true && (
                                <DateTimePicker
                                    value={
                                        isDeliveryDate
                                            ? isDeliveryDate
                                            : new Date()
                                    }
                                    mode={"date"}
                                    is24Hour={true}
                                    minimumDate={new Date()}
                                    display="spinner"
                                    onChange={
                                        changeEstimateDeliverySelectedDate
                                    }
                                />
                            )}
                            {displayDeliveryTimeClock && (
                                <DateTimePicker
                                    value={
                                        isDeliveryTime
                                            ? isDeliveryTime
                                            : new Date()
                                    }
                                    mode={"time"}
                                    is24Hour={false}
                                    display="spinner"
                                    onChange={changeSelectedTime}
                                />
                            )}
                        </TouchableOpacity>
                        {estimateDeliveryDateError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {estimateDeliveryDateError}
                            </Text>
                        )}

                        <Button
                            style={{ marginTop: 15 }}
                            mode={"contained"}
                            onPress={submit}
                        >
                            Edit Repair Order
                        </Button>
                    </View>
                </InputScrollView>

                <Portal>
                    {/* Parts List Modal */}
                    <Modal
                        visible={partListModal}
                        onDismiss={() => {
                            setPartListModal(false);
                            setSearchQueryForParts('');
                            setFilteredPartData(partList);
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setPartListModal(false);
                                setSearchQueryForParts('');
                                setFilteredPartData(partList);
                            }}
                        />
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select Part
                        </Text>
                        <View style={{ marginTop: 20, flex: 1 }}>
                            {/* Search Bar */}
                            <View>
                                <View
                                    style={{
                                        marginBottom: 15,
                                        flexDirection: "row",
                                    }}
                                >
                                    <TextInput
                                        mode={"flat"}
                                        placeholder="Search here..."
                                        onChangeText={(text) =>
                                            setSearchQueryForParts(text)
                                        }
                                        value={searchQueryForParts}
                                        activeUnderlineColor={
                                            colors.transparent
                                        }
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
                                            searchQueryForParts != null &&
                                            searchQueryForParts != "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() => {
                                                        setSearchQueryForParts('');
                                                        setFilteredPartData(partList);
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForParts()
                                        }
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
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredPartData}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No part found!
                                            </Text>
                                        </View>
                                ))}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    !isLoading &&
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap:
                                                            "wrap",
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
                                                </View>
                                            }
                                            key={item.id}
                                            onPress={() => {
                                                let parameter = {
                                                    parts_id: item.id,
                                                    partName: item.name,
                                                };
                                                handlePartAdd(
                                                    parameter
                                                );

                                                setPartError("");
                                                setPartListModal(false);
                                                setSearchQueryForParts('');
                                                setFilteredPartData(partList);
                                            }}
                                        />
                                )}
                            />
                            <View
                                style={{
                                    justifyContent: "flex-end",
                                    flexDirection: "row",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: colors.primary,
                                        marginTop: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                    }}
                                    onPress={() => {
                                        setAddNewPartModal(true);
                                        setPartListModal(false);
                                    }}
                                >
                                    <Icon
                                        style={{
                                            color: colors.white,
                                            marginRight: 4,
                                        }}
                                        name="plus"
                                        size={16}
                                    />
                                    <Text style={{ color: colors.white }}>
                                        Add Part
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Services List Modal */}
                    <Modal
                        visible={serviceListModal}
                        onDismiss={() => {
                            setServiceListModal(false);
                            setSearchQueryForServices('');
                            setFilteredServiceData(serviceList);
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setServiceListModal(false);
                                setSearchQueryForServices('');
                                setFilteredServiceData(serviceList);
                            }}
                        />
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select Service
                        </Text>
                        <View style={{ marginTop: 20, flex: 1 }}>
                            {/* Search Bar */}
                            <View>
                                <View
                                    style={{
                                        marginBottom: 15,
                                        flexDirection: "row",
                                    }}
                                >
                                    <TextInput
                                        mode={"flat"}
                                        placeholder="Search here..."
                                        onChangeText={(text) =>
                                            setSearchQueryForServices(text)
                                        }
                                        value={searchQueryForServices}
                                        activeUnderlineColor={
                                            colors.transparent
                                        }
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
                                            searchQueryForServices !=
                                                null &&
                                            searchQueryForServices !=
                                                "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() => {
                                                        setSearchQueryForServices('');
                                                        setFilteredServiceData(serviceList);
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForServices()
                                        }
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
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredServiceData}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No service found!
                                            </Text>
                                        </View>
                                ))}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    !isLoading &&
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap:
                                                            "wrap",
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
                                                </View>
                                            }
                                            onPress={() => {
                                                let parameter = {
                                                    service_id: item.id,
                                                    serviceName:
                                                        item.name,
                                                };
                                                handleServiceAdd(
                                                    parameter
                                                );

                                                setServiceError("");
                                                setServiceListModal(
                                                    false
                                                );
                                                setSearchQueryForServices('');
                                                setFilteredServiceData(serviceList);
                                            }}
                                        />
                                )}
                            />
                            <View
                                style={{
                                    justifyContent: "flex-end",
                                    flexDirection: "row",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: colors.primary,
                                        marginTop: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                    }}
                                    onPress={() => {
                                        setAddNewServiceModal(true);
                                        setServiceListModal(false);
                                    }}
                                >
                                    <Icon
                                        style={{
                                            color: colors.white,
                                            marginRight: 4,
                                        }}
                                        name="plus"
                                        size={16}
                                    />
                                    <Text style={{ color: colors.white }}>
                                        Add Service
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={addNewPartModal}
                        onDismiss={() => {
                            setAddNewPartModal(false);
                            setPartListModal(true);
                            setIsNewPart("");
                            setNewPartError("");
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setAddNewPartModal(false);
                                setPartListModal(true);
                                setIsNewPart("");
                                setNewPartError("");
                            }}
                        />
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Part
                        </Text>
                        <View>
                            <TextInput
                                mode="outlined"
                                label="Part Name"
                                style={styles.input}
                                placeholder="Part Name"
                                value={isNewPart}
                                onChangeText={(text) => setIsNewPart(text)}
                            />
                        </View>
                        {newPartError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newPartError}
                            </Text>
                        )}

                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Button
                                style={{
                                    marginTop: 15,
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                mode={"contained"}
                                onPress={() => {
                                    if (isNewPart == "") {
                                        setNewPartError(
                                            "Please Enter Part Name"
                                        );
                                    } else {
                                        addNewPart();
                                    }
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => {
                                    setAddNewPartModal(false);
                                    setPartListModal(true);
                                    setIsNewPart("");
                                    setNewPartError("");
                                }}
                            >
                                Close
                            </Button>
                        </View>
                    </Modal>

                    <Modal
                        visible={addNewServiceModal}
                        onDismiss={() => {
                            setAddNewServiceModal(false);
                            setServiceListModal(true);
                            setIsNewService("");
                            setNewServiceError("");
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setAddNewServiceModal(false);
                                setServiceListModal(true);
                                setIsNewService("");
                                setNewServiceError("");
                            }}
                        />
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Service
                        </Text>
                        <View>
                            <TextInput
                                mode="outlined"
                                label="Service Name"
                                style={styles.input}
                                placeholder="Service Name"
                                value={isNewService}
                                onChangeText={(text) => setIsNewService(text)}
                            />
                        </View>
                        {newServiceError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newServiceError}
                            </Text>
                        )}

                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Button
                                style={{
                                    marginTop: 15,
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                mode={"contained"}
                                onPress={() => {
                                    if (isNewService == "") {
                                        setNewServiceError(
                                            "Please Enter Service Name"
                                        );
                                    } else {
                                        addNewService();
                                    }
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => {
                                    setAddNewServiceModal(false);
                                    setServiceListModal(true);
                                    setIsNewService("");
                                    setNewServiceError("");
                                }}
                            >
                                Close
                            </Button>
                        </View>
                    </Modal>
                </Portal>
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
    repairOrderField: {
        // padding: 15,
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        // backgroundColor: colors.black,
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
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
        borderColor: colors.light_gray,
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundColor: "#F0F2F5",
        color: "#424242",
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: "absolute",
        right: 7,
        top: 13,
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
    footer: {
        marginVertical: 15,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(EditRepairOrder);
