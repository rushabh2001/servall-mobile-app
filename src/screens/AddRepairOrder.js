import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";

const AddRepairOrder = ({navigation, userToken, selectedGarageId, selectedGarage, user }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getVehicleList = async () => {
        { page == 1 && setIsLoading(true) }
        { page != 1 && setIsScrollLoading(true) }
        try {
            const res = await fetch(`${API_URL}fetch_all_vehicle_by_query/${isGarageId}?page=${page}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    search: searchQuery,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                setData([
                    ...data,
                    ...json.vehicle_list.data
                ]);
                setFilteredData([
                    ...filteredData,
                    ...json.vehicle_list.data,
                ]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            { page == 1 && setIsLoading(false) }
            { page != 1 && setIsScrollLoading(false) }
            setPage(page + 1);
        }
    };

    const searchFilter = async () => {
        try {
            const response = await fetch(`${API_URL}fetch_all_vehicle_by_query/${isGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    search: searchQuery,
                }),
            });
            const json = await response.json();
            if (response.status == '200') {
                setData(json.vehicle_list.data);
                setFilteredData(json.vehicle_list.data);
                setPage(2);
                setRefreshing(false);
            } else {
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendVehicleData = (index) => {
        const userVehicleDetails = {
            'vehicle_id': filteredData[index]?.id,
            'user_id': filteredData[index]?.users[0].id,
            'garage_id': filteredData[index]?.users[0].garage_customers[0].id,
            'name': filteredData[index]?.users[0].name,
            'email': filteredData[index]?.users[0].email,
            'phone_number': filteredData[index]?.users[0].phone_number,
            'isCity': filteredData[index]?.users[0].city,
            'isState': filteredData[index]?.users[0].state,
            'isAddress': filteredData[index]?.users[0].address,
            'isBrand': filteredData[index]?.brand_id,
            'brand_name': filteredData[index]?.brand.name,
            'isModel': filteredData[index]?.model_id,
            'model_name': filteredData[index]?.vehicle_model?.model_name,
            'vehicle_registration_number': filteredData[index]?.vehicle_registration_number,
            'isPurchaseDate': filteredData[index]?.purchase_date,
            'isManufacturingDate': filteredData[index]?.manufacturing_date,
            'isEngineNumber': filteredData[index]?.engine_number,
            'isChasisNumber': filteredData[index]?.chasis_number,
            'isInsuranceProvider': filteredData[index]?.insurance_id,
            'isInsurerGstin': filteredData[index]?.insurer_gstin,
            'isInsurerAddress': filteredData[index]?.insurer_address,
            'isPolicyNumber': filteredData[index]?.policy_number,
            'isInsuranceExpiryDate': filteredData[index]?.insurance_expiry_date,
            'isRegistrationCertificateImg': filteredData[index]?.registration_certificate_img,
            'isInsuranceImg': filteredData[index]?.insurance_img,
        }
        navigation.navigate('AddRepairOrderStep3', { 'userVehicleDetails': userVehicleDetails } );
    }

    const pullRefresh = async () => {
        setSearchQuery(null);
        try {
            const response = await fetch(`${API_URL}fetch_all_vehicle_by_query/${isGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    search: '',
                }),
            });
            const json = await response.json();
            if (response.status == '200') {
                setData(json.vehicle_list.data);
                setFilteredData(json.vehicle_list.data);
                setPage(2);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator
                            size="large"
                        />
                    </View>
                )}
            </>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pullRefresh();
    };

    useEffect(() => {
        getVehicleList();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 35 }}>
            { selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages - {user.name}</Text> : <Text style={styles.garageNameTitle}>{selectedGarage?.garage_name} - {user.name}</Text> }
            </View>
            <View style={styles.surfaceContainer}>
                <View>
                    <View style={{ marginBottom: 15, flexDirection: 'row'}}>
                        <TextInput
                            mode={'flat'}
                            placeholder="Search here..."
                            onChangeText={(text) => setSearchQuery(text)}
                            value={searchQuery}
                            activeUnderlineColor={colors.transparent}
                            underlineColor={colors.transparent}
                            style={{ elevation: 4, height: 50, backgroundColor: colors.white, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5  }}
                            right={(searchQuery != null && searchQuery != '') && <TextInput.Icon icon="close" color={colors.light_gray} onPress={() => onRefresh()} />}
                        />
                        <TouchableOpacity onPress={() => searchFilter()} style={{ elevation: 4, borderTopRightRadius: 5, borderBottomRightRadius: 5, paddingRight: 25, paddingLeft: 25, zIndex: 2, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                            <IconX name={'search'} size={17} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: "column", flex: 1 }}>
                    {isLoading ? <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator></ActivityIndicator></View> :
                        (filteredData.length != 0 ? 
                            <View>
                                <FlatList
                                    ItemSeparatorComponent= {() => (<Divider />)}
                                    data={filteredData}
                                    onEndReached={filteredData?.length > 9 && getVehicleList}
                                    onEndReachedThreshold={0.5}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            colors={['green']}
                                        />
                                    }
                                    ListFooterComponent={filteredData?.length > 9 && renderFooter}
                                    keyExtractor={item => item.id}
                                    renderItem={({item, index}) => (
                                        <View style={styles.cards}>
                                            <View>
                                                <Text style={styles.cardCustomerName}>Owner Name: {item.users[0] ? item?.users[0].name : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Owner`s Phone Number: {item.users[0] ? item?.users[0].phone_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Brand: {item.brand.name}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Model: {item.vehicle_model.model_name}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Registration Number: {item.vehicle_registration_number}</Text>
                                            </View>
                                            <View style={styles.cardActions}>
                                                <TouchableOpacity onPress={()=> sendVehicleData(index)} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>Select Vehicle</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />     
                            </View>
                        :
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1,  backgroundColor:colors.white,}}>
                                <Text style={{ color: colors.black, textAlign: 'center'}}>No Vehicles are associated with this Garage!</Text>
                                <TouchableOpacity style={[styles.buttonStyle, { marginTop: 15 }]} onPress={ () => navigation.navigate('AddRepairOrderStep2')}><Text style={{ color: colors.black, padding: 5 }}><Icon name={'plus'} size={16} color={colors.secondary} /> Add New Vehicle</Text></TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: 'center', 
        fontSize: 17, 
        fontWeight: '500', 
        color: colors.white, 
        paddingVertical: 7, 
        backgroundColor: colors.secondary,
        position: 'absolute',
        top: 0,
        zIndex: 5,
        width: '100%',
        flex: 1,
        left: 0, 
        right: 0
    },
    // Vehicle Search Css
    surfaceContainer: {
        flex:1,
        padding:15,
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    cards: {
        padding: 25,
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
        paddingVertical: 4        
    },
    cardCustomerName: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4      
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
    modalContainerStyle: {
        backgroundColor: 'white', 
        padding: 20,
        marginHorizontal: 30,
        marginTop: 40,
        marginBottom: 70
    },
    cardDetailsHeading: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 'bold' 
    }, 
    cardDetailsData: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4
    },
    headingStyle: {
        color: colors.black,
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    smallButton: {
        fontSize: 16,
        color: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
    },
    verticleImage: {
        height: 150,
        resizeMode: 'contain',  
        flex: 1, 
    }, 
    lightBoxWrapper: {
        width: 150,
    },
    footer: {
        marginVertical: 15,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddRepairOrder);