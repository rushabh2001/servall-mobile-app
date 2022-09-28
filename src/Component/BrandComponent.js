import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "../constants/config";
import { connect } from "react-redux";
import {
    Portal,
    Divider,
    TextInput,
    Button,
    List,
    Searchbar,
} from "react-native-paper";
import Modal from "react-native-modal";
const BrandComponet = ({ visible, closeModal, userToken, brandName, brandId, setError }) => {
    const [filteredBrandData, setFilteredBrandData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [searchQueryForBrands, setSearchQueryForBrands] = useState();
    const [addBrandModal, setAddBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();
    const [newBrandNameError, setNewBrandNameError] = useState();

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
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const addNewBrand = async () => {
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
                pullBrandRefresh();
                setAddBrandModal(false);
                setIsBrandName(json.data.name);
                setIsBrand(json.data.id);
            } else if (res.status == 400) {
                setNewBrandNameError(json.message.name);
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
                    style={{
                        position: "absolute",
                        top: 25,
                        right: 25,
                        zIndex: 99,
                    }}
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
                                            onPress={() =>
                                                onBrandRefresh()
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
            <Modal
                visible={addBrandModal}

                style={styles.modalContainerStyle}
            >
                <Text
                    style={[
                        styles.headingStyle,
                        { marginTop: 0, alignSelf: "center" },
                    ]}
                >
                    Add New Brand
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
                        setAddBrandModal(false);
                        setNewBrandNameError();
                        setBrandListModal(true);
                    }}
                />
                <TextInput
                    mode="outlined"
                    label="Brand Name"
                    style={styles.input}
                    placeholder="Brand Name"
                    value={newBrandName}
                    onChangeText={(text) => setNewBrandName(text)}
                />
                {newBrandNameError?.length > 0 && (
                    <Text style={styles.errorTextStyle}>
                        {newBrandNameError}
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
                        onPress={() => setAddBrandModal(false)}
                    >
                        Close
                    </Button>
                </View>
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
        marginHorizontal: 30,
    },
    errorTextStyle: {
        color: colors.danger,
        marginTop: 5,
        marginLeft: 5,
    },
});


const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
});

export default connect(mapStateToProps)(BrandComponet);