import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "../constants/config";
import { connect } from "react-redux";
import { colors } from "../constants";

import {
    Portal,
    Divider,
    TextInput,
    Button,
    List,
    Searchbar,
} from "react-native-paper";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
const VehicalModalComponet = ({ visible, closeModal, brand, userToken, modelName, ModalId }) => {
    const [filteredModelData, setFilteredModelData] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [searchQueryForModels, setSearchQueryForModels] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const search_text = useRef();
    const modal_name = useRef();
    const [addModelModal, setAddModelModal] = useState(false);
    const [newModelName, setNewModelName] = useState();
    const [brandId, setBrandId] = useState();
    const getBrand = async () => {
        setSearchQueryForModels(null);
        try {
            const response = await fetch(`${API_URL}fetch_vehicle_model`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    brand_id: brandId,
                    // search: null,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                console.log('ddd', json.vehicle_model_list)
                setModelList(json.vehicle_model_list);
                setFilteredModelData(json.vehicle_model_list);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const searchFilterForModels = async () => {
        if (searchQueryForModels) {
            const newData = filteredModelData.filter(
                function (item) {
                    console.log(item)
                    const itemData = item.model_name
                        ? item.model_name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForModels.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            console.log('data', newData)
            setFilteredModelData(newData);
        } else {
            setFilteredModelData(modelList);
        }


    };
    const addNewModel = async () => {
        if (!newModelName ||
            newModelName?.trim().length === 0) {
            if (!newModelName) setNewModelName("");
            return;
        }
        closeModal();
        let data = { model_name: newModelName, brand_id: parseInt(brandId) };
        try {
            const res = await fetch(`${API_URL}create_vehicle_model`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (res.status == 200 || res.status == 201) {
                modal_name.current.clear();
                setNewModelName()
                setAddModelModal(false);
                getBrand();
                modelName(json.data.model_name);
                ModalId(json.data.id);
            } else if (res.status == 400) {
                console.log('ddd', json)
                let errors_message = [];
                Object.entries(json.message).map(([key, error], i) => {
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
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getBrand();
        setBrandId(brand);
    }, [brand])
    return (
        <View>
            <Modal
                isVisible={visible}
                style={[
                    styles.modalContainerStyle,
                    { flex: 0.9 },
                ]}
            >
                <Text
                    style={[
                        styles.headingStyle,
                        { marginTop: 0, alignSelf: "center" },
                    ]}
                >
                    Select Model
                </Text>
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
                        closeModal();

                    }}
                />
                <View
                    style={{
                        marginTop: 20,
                        marginBottom: 10,
                        flex: 1,
                    }}
                >
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
                                    setSearchQueryForModels(text)
                                }
                                value={searchQueryForModels}
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
                                    searchQueryForModels != null &&
                                    searchQueryForModels != "" && (
                                        <TextInput.Icon
                                            icon="close"
                                            color={
                                                colors.light_gray
                                            }
                                            onPress={() => {
                                                search_text.current.clear(); setFilteredModelData(modelList)
                                            }
                                            }
                                        />
                                    )
                                }
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    searchFilterForModels()
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
                        data={filteredModelData}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={() => (
                            !isLoading && (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                    <Text style={{ color: colors.black }}>
                                        No vehicle model found!
                                    </Text>
                                </View>
                            ))}
                        contentContainerStyle={{ flexGrow: 1 }}
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
                                            {item.model_name}
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    modelName(
                                        item.model_name
                                    );
                                    ModalId(item.id);
                                    // setModelError("");
                                    closeModal()
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
                                setAddModelModal(true);
                                closeModal()
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
                                Add Model
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.centeredView}>
                <Modal
                    deviceHeight={global.maxDeviceHeight}
                    backdropOpacity={0.5}
                    isVisible={addModelModal}
                >
                    <View style={styles.modalView}>
                        <Text
                            style={[
                                styles.headingStyle,
                                { paddingVertical: 10, alignSelf: "center" },
                            ]}
                        >
                            Add New Model
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{ position: "absolute", top: 10, right: 25, zIndex: 99, }}
                            onPress={() => {
                                setAddModelModal(false);
                                setNewModelName();
                                setNewModelName(null)

                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Model Name"
                            style={styles.input}
                            placeholder="Model Name"
                            value={newModelName}
                            ref={modal_name}
                            onChangeText={(text) => setNewModelName(text)}
                        />
                        {newModelName?.trim()?.length === 0 && (
                            <Text style={styles.errorTextStyle}>
                                Modal Name is required.
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
                                onPress={addNewModel}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => { setAddModelModal(false); setNewModelName(null) }}
                            >
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
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
const mapStateToProps = state => ({
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(VehicalModalComponet)
