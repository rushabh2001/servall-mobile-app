import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { Portal, Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import InputScrollView from "react-native-input-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";

const EditStock = ({
    navigation,
    userRole,
    userId,
    userToken,
    route,
    garageId,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    // User / Customer Fields
    const [isPart, setIsPart] = useState(route?.params?.data?.parts?.id);
    const [isPartName, setIsPartName] = useState(
        route?.params?.data?.parts?.name
    );
    const [isStockId, setIsStockId] = useState(route?.params?.data?.id);
    const [isPrice, setIsPrice] = useState(route?.params?.data?.purchase_price);
    const [isMRP, setIsMRP] = useState(route?.params?.data?.mrp);
    const [isCurrentStock, setIsCurrentStock] = useState(
        route?.params?.data?.current_stock
    );
    const [isMinStock, setIsMinStock] = useState(
        route?.params?.data?.min_stock
    );
    const [isMaxStock, setIsMaxStock] = useState(
        route?.params?.data?.max_stock
    );
    const [isRackId, setIsRackId] = useState(route?.params?.data?.rack_id);
    const [isComment, setIsComment] = useState(route?.params?.data?.comment);

    // Error States
    const [priceError, setPriceError] = useState("");
    const [mrpError, setMrpError] = useState("");
    const [currentStockError, setCurrentStockError] = useState("");
    const [minStockError, setMinStockError] = useState("");
    const [maxStockError, setMaxStockError] = useState("");
    const [rackIdError, setAddressError] = useState("");
    const [commentError, setCommentError] = useState("");

    // Vendor Fields
    // const [isVendor, setIsVendor] = useState();
    // const [isVendorName, setIsVendorName] = useState();
    // const [vendorError, setVendorError] = useState('');
    // const [vendorList, setVendorList] = useState([]);
    // const [addVendorModal, setAddVendorModal] = useState(false);
    // const [newVendor, setNewVendor] = useState();
    // const [newVendorError, setNewVendorError] = useState();

    // States for Garage Dropdown
    const [isGarage, setIsGarage] = useState(route?.params?.data?.garage?.id);
    const [isGarageName, setIsGarageName] = useState(
        !route?.params?.data?.garage?.garage_name
            ? ""
            : route?.params?.data?.garage?.garage_name
    );
    const [garageError, setGarageError] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const scroll1Ref = useRef();

    const validate = () => {
        return !(
            !isPart ||
            isPart === 0 ||
            !isPrice ||
            isPrice?.trim().length === 0 ||
            !isCurrentStock ||
            isCurrentStock?.trim().length === 0 ||
            !isMRP ||
            isMRP?.trim().length === 0 ||
            !isRackId ||
            isRackId?.trim().length === 0 ||
            !isMinStock ||
            isMinStock?.trim().length === 0 ||
            !isMaxStock ||
            isMaxStock?.trim().length === 0 ||
            // !isVendor || isVendor === 0 ||
            !isGarage ||
            isGarage === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (!isPrice) setIsPrice("");
            if (!isMRP) setIsMRP("");
            if (!isRackId) setIsRackId("");
            if (!isCurrentStock) setIsCurrentStock("");
            if (!isMinStock) setIsMinStock("");
            if (!isMaxStock) setIsMaxStock("");
            // if (!isPart) setPartError("Part is required");
            // else setPartError("");
            // if (!isPrice) setPriceError("Price is required");
            // else setPriceError("");
            // if (!isMRP) setMrpError("MRP is required");
            // else setMrpError("");
            // if (!isRackId) setRackIdError("Rack ID is required");
            // else setRackIdError("");
            // if (!isCurrentStock)
            //     setCurrentStockError("Current Stock is required");
            // else setCurrentStockError("");
            // if (!isMinStock) setMinStockError("Minimum Stock is required");
            // else setMinStockError("");
            // if (!isMaxStock) setMaxStockError("Maximum Stock is required");
            // else setMaxStockError("");
            // if (!isVendor || isVendor === 0) setVendorError('Brand is required'); else setVendorError('');
            if (!isGarage || isGarage == 0)
                setGarageError("Customer Belongs to Garage Field is required");
            else setGarageError("");
            return;
        }

        const data = {
            parts_id: isPart,
            garage_id: isGarage,
            // 'vendor_id': isVendor,
            purchase_price: isPrice?.trim(),
            mrp: isMRP?.trim(),
            rack_id: isRackId?.trim(),
            current_stock: isCurrentStock?.trim(),
            min_stock: isMinStock?.trim(),
            max_stock: isMaxStock?.trim(),
            comment: isComment?.trim(),
        };

        addStock(data);
    };

    const addStock = async (data) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}add_inventory`, {
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
                // console.log(json);
                setIsLoading(false);
                navigation.navigate("Parts");
            }
        } catch (e) {
            console.log(e);
        }
    };

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
            <View style={styles.pageContainer}>
                <InputScrollView
                    ref={scroll1Ref}
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
                            Stock Details:
                        </Text>

                        {(userRole == "Super Admin" ||
                            garageId?.length > 1) && (
                            <View style={{marginTop: 20}}>
                                <TextInput
                                    mode="outlined"
                                    label="Garage"
                                    style={{
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select Garage"
                                    value={isGarageName}
                                    right={
                                        <TextInput.Icon name="menu-down" />
                                    }
                                    disabled={true}
                                />
                                {garageError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {garageError}
                                    </Text>
                                )}
                            </View>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Part"
                            style={{
                                marginTop: 20,
                                backgroundColor: "#f1f1f1",
                                width: "100%",
                            }}
                            placeholder="Select Part"
                            value={isPartName}
                            right={<TextInput.Icon name="menu-down" />}
                            disabled={true}
                        />

                        <TextInput
                            mode="outlined"
                            label="Purchase Price (Without GST)"
                            style={styles.input}
                            placeholder="Purchase Price (Without GST)"
                            value={isPrice}
                            onChangeText={(text) => setIsPrice(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isPrice?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Purchase Price is required.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="MRP"
                            style={styles.input}
                            placeholder="MRP"
                            value={isMRP}
                            onChangeText={(text) => setIsMRP(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isMRP?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                MRP is required.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Rack ID"
                            style={styles.input}
                            placeholder="Rack ID"
                            value={isRackId}
                            onChangeText={(text) => setIsRackId(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isRackId?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Rack ID is required.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Current Stock"
                            style={styles.input}
                            placeholder="Current Stock"
                            value={isCurrentStock}
                            onChangeText={(text) => setIsCurrentStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isCurrentStock?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Current Stock is required.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Minimum Stock"
                            style={styles.input}
                            placeholder="Minimum Stock"
                            value={isMinStock}
                            onChangeText={(text) => setIsMinStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isMinStock?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Minimum Stock is required.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Maximum Stock"
                            style={styles.input}
                            placeholder="Maximum Stock"
                            value={isMaxStock}
                            onChangeText={(text) => setIsMaxStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isMaxStock?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Maximum Stock is required.
                            </Text>
                        ) : null}

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
                        {commentError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {commentError}
                            </Text>
                        )}

                        <Button
                            style={{ marginTop: 15 }}
                            mode={"contained"}
                            onPress={submit}
                        >
                            Update
                        </Button>
                    </View>
                </InputScrollView>
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
    garageDropDownField: {
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
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    garageId: state.garage.garage_id,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(EditStock);
