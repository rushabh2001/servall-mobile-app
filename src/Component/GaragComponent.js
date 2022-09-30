import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import IconX from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "../constants/config";
import { connect } from "react-redux";
import { colors } from "../constants";
import {
    Divider,
    TextInput,
    List,
} from "react-native-paper";
import Modal from "react-native-modal";

const GaragComponent = ({ userRole, userToken, userId, visible, closeModal, IsLoading, garageName, getGarageId, garageError, garageIdError }) => {
    global.maxDeviceHeight = Math.max(Dimensions.get('window').height, Dimensions.get('screen').height);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState();
    const [garageList, setGarageList] = useState([]);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const search_text = useRef();

    const getGarageList = async () => {
        setFilteredGarageData();
        IsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`,
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
            console.log(json);
            if (json !== undefined) {
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
                IsLoading(false);
            }
        } catch (e) {
            IsLoading(false);
            console.log(e);
        }
    };
    const searchFilterForGarages = async () => {
        // setIsLoading(true);
        // try {
        //     const response = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
        //         method: "GET",
        //         headers: {
        //             Accept: "application/json",
        //             "Content-Type": "application/json",
        //             Authorization: "Bearer " + userToken,
        //         },
        //     });
        //     const json = await response.json();
        //     if (response.status == "200") {
        //         setGarageList(json.garage_list);
        //         setFilteredGarageData(json.garage_list);
        //         setIsLoading(false);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
        if (searchQueryForGarages) {
            const newData = filteredGarageData.filter(
                function (item) {
                    console.log(item)
                    const itemData = item.garage_name
                        ? item.garage_name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForGarages.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredGarageData(newData);
        } else {
            setFilteredGarageData(garageList);
        }

    };
    useEffect(() => {
        if (visible) {
            getGarageList()
        }

    }, [visible]);

    return (
        <View>
            <Modal
                isVisible={visible}
                animationInTiming={30}
                animationOutTiming={30}
                style={[
                    styles.modalContainerStyle,
                    { flex: 0.9 },
                ]}
            >
                <IconX
                    name="times"
                    size={20}
                    color={colors.black}
                    style={{ position: "absolute", top: 10, right: 25, zIndex: 99, }}
                    onPress={() => {
                        closeModal(false);
                        setSearchQueryForGarages("");
                    }}
                />
                <Text
                    style={[
                        styles.headingStyle,
                        { marginBottom: 20, alignSelf: "center" },
                    ]}
                >
                    Select Garage
                </Text>


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
                            ref={search_text}
                            onChangeText={(text) =>
                                setSearchQueryForGarages(text)
                            }
                            value={searchQueryForGarages}
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
                                searchQueryForGarages != null &&
                                searchQueryForGarages != "" && (
                                    <TextInput.Icon
                                        icon="close"
                                        color={
                                            colors.light_gray
                                        }
                                        onPress={() => {
                                            search_text.current.clear(); setFilteredGarageData(garageList)
                                        }
                                        }
                                    />
                                )
                            }
                        />
                        <TouchableOpacity
                            onPress={() =>
                                searchFilterForGarages()
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
                    ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                    data={filteredGarageData}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={() => (
                        !isLoading && (
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                <Text style={{ color: colors.black }}>
                                    No garage found!
                                </Text>
                            </View>
                        ))}
                    style={{
                        borderColor: "#0000000a",
                        borderWidth: 1,
                        flex: 1,
                    }}
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
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: colors.black,
                                        }}
                                    >
                                        {item.garage_name}
                                    </Text>
                                </View>
                            }
                            onPress={() => {
                                console.log(item.id)
                                garageName(item.garage_name);
                                getGarageId(item.id);
                                closeModal()
                                garageError("");
                                garageIdError("");
                                setSearchQueryForGarages("");
                                search_text.current.clear();
                            }}
                        />
                    )
                    }
                />
            </Modal>

        </View>
    )
};
const styles = StyleSheet.create({


    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "500",
    },

    modalContainerStyle: {
        backgroundColor: "white",
        padding: 20,
        // marginHorizontal: 30,
    },
    errorTextStyle: {
        color: 'red',
        marginTop: 5,
        marginLeft: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
    },

    modalView: {
        backgroundColor: "white",
        width: '100%',
        paddingBottom: 40,
        justifyContent: 'center',
        paddingHorizontal: 40
    },

});


const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    user: state.user.user,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(GaragComponent);