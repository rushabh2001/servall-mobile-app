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
const BrandComponet = ({ visible, closeModal, userToken, brandName, brandId, setError }) => {
    const [filteredBrandData, setFilteredBrandData] = useState([]);
    const [bradData, setBrandData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [searchQueryForBrands, setSearchQueryForBrands] = useState();
    const [addBrandModal, setAddBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();
    const [newBrandNameError, setNewBrandNameError] = useState(null);
    const search_text = useRef();
    global.maxDeviceHeight = Math.max(Dimensions.get('window').height, Dimensions.get('screen').height);

    const getBrandList = async () => {

        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}fetch_brand`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },

            });
            const json = await res.json();
            if (json !== undefined) {
                setFilteredBrandData(json.brand_list);
                setBrandData(json.brand_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const searchFilterForBrands = async () => {
        if (searchQueryForBrands) {
            const newData = filteredBrandData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForBrands.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            console.log('data', newData)
            setFilteredBrandData(newData);
        } else {
            setFilteredBrandData(bradData);
        }


    };
    const addNewBrand = async () => {
        if (!newBrandName ||
            newBrandName?.trim().length === 0) {
            if (!newBrandName) setNewBrandName("");
            return;
        }
        closeModal();
        let data = { name: newBrandName };
        try {
            const res = await fetch(`${API_URL}create_brand`, {
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
                setAddBrandModal(false);
                setNewBrandName();
                brandName(json.data.name);
                brandId(json.data.id);
                getBrandList();
                closeModal();
            }
            else if (res.status == 400) {
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
        getBrandList();

    }, []);
    useEffect(() => {
        setModalVisible(visible);

    }, [visible]);
    return (
        <View>
            <Modal
                isVisible={modalVisible}
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
                        setModalVisible(false)
                        closeModal(false)
                    }}
                />
                <Text
                    style={[
                        styles.headingStyle,
                        { marginTop: 0, alignSelf: "center" },
                    ]}
                >
                    Select Brand
                </Text>
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
                                    setSearchQueryForBrands(text)
                                }
                                value={searchQueryForBrands}
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
                                    searchQueryForBrands != null &&
                                    searchQueryForBrands != "" && (
                                        <TextInput.Icon
                                            icon="close"
                                            color={
                                                colors.light_gray
                                            }
                                            onPress={() => { search_text.current.clear(); setFilteredBrandData(bradData) }
                                            }
                                        />
                                    )
                                }
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    searchFilterForBrands()
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
                        data={filteredBrandData}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={() => (
                            !isLoading && (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                    <Text style={{ color: colors.black }}>
                                        No brand found!
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
                                            {item.name}
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    brandName(item.name);
                                    brandId(item.id);
                                    setModalVisible(false)
                                    closeModal(false)
                                    setError("");
                                    search_text.current.clear(); 
                                    setFilteredBrandData(bradData)
                                    setSearchQueryForBrands(null);
                                    // setBrandListModal(false);
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
                                setAddBrandModal(true);
                                setModalVisible(false);
                                closeModal(false)
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
                                Add Brand
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.centeredView}>
                <Modal
                    deviceHeight={global.maxDeviceHeight}
                    backdropOpacity={0.5}
                    isVisible={addBrandModal}
                >
                    <View style={styles.modalView}>
                        <Text
                            style={[
                                styles.headingStyle,
                                { paddingVertical: 10, alignSelf: "center" },
                            ]}
                        >
                            Add New Brand
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{ position: "absolute", top: 10, right: 25, zIndex: 99, }}
                            onPress={() => {
                                setAddBrandModal(false); setNewBrandName(null)
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Brand Name"
                            // style={styles.input}
                            placeholder="Brand Name"
                            value={newBrandName}
                            onChangeText={(text) => setNewBrandName(text)}
                        />
                        {newBrandName?.trim()?.length === 0 && (
                            <Text style={styles.errorTextStyle}>
                                Brand name is required.
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
                                onPress={addNewBrand}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => { setAddBrandModal(false); setNewBrandName(null) }}
                            >
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
            {/* {isLoading &&
                <Spinner
                    visible={isLoading}
                    color="#377520"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
                />
            } */}
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
});

export default connect(mapStateToProps)(BrandComponet);