import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddRepairOrder = ({navigation, userToken, selectedGarageId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);

    // const [viewVehicleDetailsModal, setViewVehicleDetailsModal] = useState(false);
    // const [VehicleData, setVehicleData] = useState('');
    // const [vehicleDataLoading, setVehicleDataLoading] = useState(true);

    const getVehicleList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_all_vehicle_by_query?garage_id=${isGarageId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.vehicle_list);
                setData(json.vehicle_list);
                setFilteredData(json.vehicle_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const searchFilter = (text) => {
        if (text) {
            const newData = data.filter(
                function (listData) {
                // let arr2 = listData.vehicle_registration_number ? listData.vehicle_registration_number : ''.toUpperCase() 
                // let arr1 = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                let itemData = listData.vehicle_registration_number ? listData.vehicle_registration_number.toUpperCase() : ''.toUpperCase()
                // console.log(itemData);
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredData(newData);
            setSearchQuery(text);
        } else {
            setFilteredData(data);
            setSearchQuery(text);
        }
    };

    const sendVehicleData = (index) => {
        console.log(index);
        console.log('sentData', filteredData[index]);
        const vehicleData = {
            'isVehicleId': filteredData[index]?.id,
            'isUserId': filteredData[index]?.users[0].id,
            'isGarageId': filteredData[index]?.users[0].garage_customers[0].id,
            'isName': filteredData[index]?.users[0].name,
            'isEmail': filteredData[index]?.users[0].email,
            'isPhoneNumber': filteredData[index]?.users[0].phone_number,
            'isCity': filteredData[index]?.users[0].city,
            'isState': filteredData[index]?.users[0].state,
            'isAddress': filteredData[index]?.users[0].address,
            'isBrand': filteredData[index]?.brand_id,
            'isBrandName': filteredData[index]?.brand.name,
            'isModel': filteredData[index]?.model_id,
            'isModelName': filteredData[index]?.vehicle_model?.model_name,
            'isVehicleRegistrationNumber': filteredData[index]?.vehicle_registration_number,
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
        navigation.navigate('AddRepairOrderStep2', { 'data': vehicleData } );
    }

    //  useEffect(() => {
    //    console.log(customerId);
    // }, [customerId]);

    useEffect(() => {
        getVehicleList();
        // console.log(isGarageId);
    }, []);

    // useEffect(() => {
    //    console.log(isGarageId);
    // }, [isGarageId]);

    return (
            <View style={styles.surfaceContainer}>
                <Searchbar
                    placeholder="Search here..."
                    onChangeText={(text) => searchFilter(text)}
                    value={searchQuery}
                />
                <View style={{flexDirection: "column", marginVertical:15 }}>
                    {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                        (filteredData.length != 0 ? 
                            <View>
                                <FlatList
                                    ItemSeparatorComponent= {() => (<Divider />)}
                                    data={filteredData}
                                    // onEndReachedThreshold={1}
                                    keyExtractor={item => item.id}
                                    renderItem={({item, index}) => (
                                        <View style={styles.cards}>
                                            {/* <View style={styles.cardOrderDetails}>
                                                <Text style={styles.orderID}>Last Order ID: 11469</Text>
                                                <Text style={styles.orderStatus}>Completed</Text>
                                            </View> */}
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
                                    // // keyExtractor={(item, index) => index.toString()}
                                />     
                            </View>
                        :
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50,  backgroundColor:colors.white,}}>
                                <Text style={{ color: colors.black, textAlign: 'center'}}>No Vehicles are associated with this Garage!</Text>
                                <TouchableOpacity style={styles.buttonStyle} onPress={ () => navigation.navigate('AddRepairOrderStep2')}><Text><Icon name={'plus'} size={16} color={colors.secondary} /> Add New Vehicle</Text></TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </View>
     
    );
}

const styles = StyleSheet.create({
    // Vehicle Search Css
    surfaceContainer: {
        flex:1,
        padding:15,
        marginBottom: 35
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
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
        // alignSelf: 'space-between'
    },
    verticleImage: {
        height: 150,
        // width: 150,
        // width: '100%',
        // height: '100%',
        resizeMode: 'contain',  
        flex: 1, 
    }, 
    lightBoxWrapper: {
        width: 150,
        // height: 250,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddRepairOrder);