import React, { useEffect, useState, useRef } from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    Platform,
} from "react-native";
import { colors } from "../constants";
import { connect } from "react-redux";
import { Button, TextInput, TextInputMask } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import InputScrollView from "react-native-input-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { API_URL } from "../constants/config";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

const AddPayment = ({
    navigation,
    userRole,
    route,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    const scroll1Ref = useRef();

    const [isLoading, setIsLoading] = useState(false);
    
    const [orderId, setOrderId] = useState(route?.params?.data.order_id);
    const [isAmount, setIsAmount] = useState(route?.params?.data.total);
    const [isPaymentReferenceNumber, setIsPaymentReferenceNumber] = useState();
    const [isPaymentMethod, setIsPaymentMethod] = useState();

    // Error States
    const [amountError, setAmountError] = useState("");
    const [paymentReferenceNumberError, setPaymentReferenceNumberError] =
        useState("");
    const [paymentMethodError, setPaymentMethodError] = useState("");

    const [isPaymentDate, setIsPaymentDate] = useState();
    const [paymentDateError, setPaymentDateError] = useState("");
    const [datePayment, setDatePayment] = useState(
        moment(new Date(), "YYYY MMMM D").format("DD-MM-YYYY")
    );
    const [displayPaymentCalender, setDisplayPaymentCalender] = useState(false);

    const [isComment, setIsComment] = useState("");
    const [isTotal, setIsTotal] = useState(route?.params?.data?.total);

    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || datePayment;
            let formattedDate = moment(currentDate, "YYYY MMMM D").format(
                "DD-MM-YYYY"
            );
            setDisplayPaymentCalender(false);
            setDatePayment(formattedDate);
            let formateDateForDatabase = moment(
                currentDate,
                "YYYY MMMM D"
            ).format("YYYY-MM-DD");
            setIsPaymentDate(new Date(formateDateForDatabase));
        } else if(event.type == 'dismissed') {
            setDisplayPaymentCalender(false);
        }
    };

    const validate = () => {
        return !(
            !isPaymentMethod ||
            isPaymentMethod === 0 ||
            !isAmount ||
            isAmount?.trim().length === 0 ||
            !isPaymentReferenceNumber ||
            isPaymentReferenceNumber?.trim().length === 0 ||
            !isPaymentDate ||
            isPaymentDate === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (!isPaymentMethod)
                setPaymentMethodError("Payment Method is required");
            else setPaymentMethodError("");
            if (!isAmount) setAmountError("Amount is required");
            else setAmountError("");

            if (!isPaymentReferenceNumber) setIsPaymentReferenceNumber("");
            // if (!isPaymentReferenceNumber)
            //     setPaymentReferenceNumberError(
            //         "Payment Reference Number is required"
            //     );
            // else setPaymentReferenceNumberError("");
            if (!isPaymentDate) setPaymentDateError("Payment Date is required");
            else setPaymentDateError("");
            return;
        }

        const data = {
            order_id: orderId,
            payment_method: isPaymentMethod,
            // 'total_amount': isAmount,
            total_amount: parseInt(isAmount?.trim()),
            payment_reference_number: isPaymentReferenceNumber?.trim(),
            payment_date: moment(isPaymentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format(
                "YYYY-MM-DD"
            ),
            comment: isComment?.trim(),
        };

        // console.log(data);
        addPayment(data);
    };

    const addPayment = async (data) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}add_payment`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json !== undefined) {
                setIsLoading(false);
                navigation.popToTop();
                navigation.navigate("Services");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.surfaceContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.cardContainer}>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10,
                            }}
                        >
                            <Text style={{ color: colors.black, fontSize: 16 }}>
                                Total
                            </Text>
                            <Text style={{ color: colors.black, fontSize: 16 }}>
                                ₹ {isTotal}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10,
                            }}
                        >
                            <Text style={{ color: colors.green, fontSize: 16 }}>
                                Received
                            </Text>
                            <Text style={{ color: colors.green, fontSize: 16 }}>
                                ₹{" "}
                                {route?.params?.data?.payment_status ==
                                "completed"
                                    ? isTotal
                                    : 0}
                            </Text>
                        </View>
                        {/* <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                            <Text style={{color: colors.danger2, fontSize: 16}}>Due</Text>
                            <Text style={{color: colors.danger2, fontSize: 16}}>₹ 8,818</Text>
                        </View>
                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                            <Text style={{color: colors.danger2, fontSize: 16}}>Discount</Text>
                            <Text style={{color: colors.danger2, fontSize: 16}}>₹ 82</Text>
                        </View> */}
                    </View>
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ justifyContent: "center" }}
                        keyboardOffset={200}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardShouldPersistTaps={"always"}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={{
                                backgroundColor: colors.white,
                                paddingVertical: 20,
                                paddingHorizontal: 15,
                                marginTop: 25,
                                marginBottom: 15,
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontSize: 20,
                                        fontWeight: "600",
                                    }}
                                >
                                    Payment Details
                                </Text>
                            </View>
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: colors.light_gray,
                                    borderRadius: 4,
                                    marginTop: 20,
                                    backgroundColor: "#F0F2F5",
                                }}
                            >
                                <Picker
                                    selectedValue={isPaymentMethod}
                                    onValueChange={(v) => {
                                        setIsPaymentMethod(v);
                                        v == 0
                                            ? setPaymentMethodError(
                                                  "Payment Method is required"
                                              )
                                            : setPaymentMethodError("");
                                    }}
                                    style={{ padding: 0 }}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item
                                        label="Select Payment Method"
                                        value="0"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Cash"
                                        value="Cash"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Paytm"
                                        value="Paytm"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Debit Card"
                                        value="Debit Card"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Credit Card"
                                        value="Credit Card"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Cheque"
                                        value="Cheque"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Bank Transfer"
                                        value="Bank Transfer"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Credit Note"
                                        value="Credit Note"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="PhonePe"
                                        value="PhonePe"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="Google Pay"
                                        value="Google Pay"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="UPI"
                                        value="UPI"
                                    />
                                    <Picker.Item
                                        key={1}
                                        label="TDS"
                                        value="TDS"
                                    />
                                </Picker>
                            </View>

                            {paymentMethodError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {paymentMethodError}
                                </Text>
                            )}

                            <TextInput
                                mode="outlined"
                                label="Amount"
                                style={[
                                    styles.input,
                                    { backgroundColor: "#F0F2F5" },
                                ]}
                                placeholder="Amount"
                                value={isAmount}
                                keyboardType={"phone-pad"}
                                editable={false}
                                onChangeText={(text) => setIsAmount(text)}
                                left={
                                    <TextInput.Icon
                                        name="currency-inr"
                                        color={colors.black}
                                        // onPress={() => {
                                        //     changeIconColor('flatLeftIcon');
                                        // }}
                                    />
                                }
                            />
                            {/* <Text>{isAmount}</Text> */}
                            {/* </TextInput> */}
                            {amountError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {amountError}
                                </Text>
                            )}

                            <TextInput
                                mode="outlined"
                                label="Payment Reference Number"
                                style={[
                                    styles.input,
                                    { backgroundColor: "#F0F2F5" },
                                ]}
                                placeholder="Payment Reference Number"
                                value={isPaymentReferenceNumber}
                                onChangeText={(text) =>
                                    setIsPaymentReferenceNumber(text)
                                }
                            />
                            {isPaymentReferenceNumber?.trim()?.length === 0 ? (
                                <Text style={{ color: colors.danger }}>
                                    Payment Reference Number is required
                                </Text>
                            ) : null}
                            {/* {paymentReferenceNumberError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {paymentReferenceNumberError}
                                </Text>
                            )} */}

                            <TouchableOpacity
                                style={{ flex: 1, marginTop: 20 }}
                                onPress={() => setDisplayPaymentCalender(true)}
                            >
                                <TextInput
                                    mode="outlined"
                                    label="Payment Date"
                                    placeholder="Payment Date"
                                    value={datePayment}
                                    editable={false}
                                    right={
                                        <TextInput.Icon name="calendar-month" />
                                    }
                                />
                                {displayPaymentCalender == true && (
                                    <DateTimePicker
                                        value={
                                            isPaymentDate
                                                ? isPaymentDate
                                                : new Date()
                                        }
                                        mode="date"
                                        maximumDate={new Date()}
                                        onChange={
                                            changePurchaseSelectedDate
                                        }
                                        display="spinner"
                                    />
                                )}
                            </TouchableOpacity>
                            {paymentDateError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {paymentDateError}
                                </Text>
                            )}

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

                            <Button
                                style={{ marginTop: 25 }}
                                mode={"contained"}
                                onPress={submit}
                            >
                                Submit
                            </Button>
                        </View>
                    </InputScrollView>
                </ScrollView>
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
    cardContainer: {
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
        backgroundColor: colors.white,
        padding: 12,
        justifyContent: "space-around",
        width: "100%",
    },
    input: {
        marginTop: 20,
        backgroundColor: colors.white,
        fontSize: 16,
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
        // paddingHorizontal: 15,
        // height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: "absolute",
        right: 7,
        top: 13,
        zIndex: 2,
    },
});

const mapStateToProps = (state) => ({
    userRole: state.role.user_role,
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(AddPayment);
