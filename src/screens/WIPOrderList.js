import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Linking, Image } from "react-native";
import { connect } from 'react-redux';
import { Button, Divider, Searchbar, Badge, Modal, Portal, List } from "react-native-paper";
import { colors } from  "../constants";
import  { API_URL, WEB_URL } from "../constants/config"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';
import Lightbox from 'react-native-lightbox-v2';
import RBSheet from "react-native-raw-bottom-sheet";

const WIPOrderList = ({navigation, userToken, selectedGarageId, navigator  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);
    // const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);s
    const [orderDataModal, setOrderDataModal] = useState(false);
    // const [VehicleData, setVehicleData] = useState('');
    // const [vehicleDataLoading, setVehicleDataLoading] = useState(true);
    // const refRBSheet = useRef();
    
    // const getVehicleDetails = async (vehicleId) => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_vehicle_data?id=${vehicleId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             console.log(json);
    //             setVehicleData(json.vehicle_details);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setVehicleDataLoading(false);
    //     }
    // };

    const getOrderList = async () => {
    //     let orderStatus = new FormData();
    //     orderStatus.append('status', 'Vehicle received');
        // let data2 =  {'': };
        // { '':  }
        try {
            const res = await fetch(`${API_URL}fetch_garage_order/status/${isGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    status: 'Work In Progress',
                }),
            });
            // console.log(res);
            const json = await res.json();
            if (json !== undefined) {
                console.log(json.data);
                setData(json.data);
                setFilteredData(json.data);
                // console.log(typeof(filteredData));
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
                let arr2 = listData.user.name ? listData.user.name.toUpperCase() : ''.toUpperCase();
                let arr1 = listData.id ?  listData.id : ''.toUpperCase()
                let itemData = arr2.concat(arr1);
                // let itemData = listData.vehicle_registration_number ? listData.vehicle_registration_number.toUpperCase() : ''.toUpperCase()
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

    //  useEffect(() => {
    //    console.log(customerId);
    // }, [customerId]);

    useEffect(() => {
        // setIsLoading(false);
        getOrderList();
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
            <View style={{flexDirection: "column", marginVertical: 30}}>
                {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                    (filteredData.length != 0 ?             
                        <View>
                            <FlatList
                                ItemSeparatorComponent= {() => (<Divider />)}
                                data={filteredData}
                                // onEndReachedThreshold={1}
                                keyExtractor={item => item.id}
                                renderItem={({item, index}) => (
                                    <>
                                        <View style={styles.cards}>
                                            <View style={styles.upperInfo}>
                                                <View style={styles.cardOrderDetails}>
                                                    <Text style={styles.orderID}>Order Id: {item.id}</Text>
                                                    <Text style={styles.orderStatus}>{item.status}</Text>
                                                </View>
                                                <View style={{right: 30, top: 35,position: 'absolute'}} >
                                                    <Icon onPress={() => { this[RBSheet + index].open();}} type={"MaterialCommunityIcons"} name={'dots-vertical'} size={22}  color={colors.gray} />
                                                </View>
                                                <View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.orderAmount}>Order Amount:</Text><Text style={styles.orderAmount}> ₹ {item.total}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Name:</Text><Text style={styles.cardCustomerName}> {item.user.name}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.orderDate}>Order Date: {moment(item.created_at, 'Y-m-d H:i:s').format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Registration Number:</Text><Text style={styles.cardCustomerName}>{item.vehicle.vehicle_registration_number}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Estimate Delivery Date:</Text><Text style={styles.cardCustomerName}>{moment(item.estimated_delivery_time, 'YYYY MMMM D').format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                 </View>
                                                <View style={styles.cardActions}>
                                                </View>
                                            </View>
                                            <View style={styles.btnActions}>
                                                <View style={styles.btnAction}>
                                                    <Button
                                                        onPress={() => Linking.openURL(`tel:${item.user.phone_number}`) }
                                                        // style={styles.buttonStyle}
                                                        color={colors.white}
                                                        icon={ (color) => <Icon name={'phone'} size={24} color={colors.white}  /> }
                                                        uppercase={false} 
                                                    ><Text style={styles.btnActionText}>Call</Text></Button>
                                                </View>
                                                <View style={[styles.btnAction, {borderColor: "#ffffff20", borderWidth: 1, borderTopWidth: 0, borderBottomWidth: 0 }]}>
                                                    <Button
                                                        onPress={() => Linking.openURL(`sms:${item.user.phone_number}`) }
                                                        // style={styles.buttonStyle}
                                                        color={colors.white}
                                                        icon={ (color) => <Icon name={'message'} size={24} color={colors.white}  /> }
                                                        uppercase={false} 
                                                    ><Text style={styles.btnActionText}>Message</Text></Button>
                                                </View>
                                                <View style={styles.btnAction}>
                                                    <Button
                                                        onPress={() => Linking.openURL(`https://wa.me/${item.user.phone_number}`) }
                                                        // style={styles.buttonStyle}
                                                        color={colors.white}
                                                        icon={ (color) => <Icon name={'whatsapp'} size={24} color={colors.white}  /> }
                                                        uppercase={false} 
                                                    ><Text style={styles.btnActionText}>WhatsApp</Text></Button>
                                                </View>
                                            </View>
                                        </View>

                                        <RBSheet
                                            ref={ref => {
                                                this[RBSheet + index] = ref;
                                            }}
                                        
                                            height={126}
                                            openDuration={250}
                                            >
                                            <View style={{flexDirection:"column", flex:1}}>
                                                {/* <List.Item
                                                    title="View Order Details"
                                                    style={{paddingVertical:15}}
                                                    onPress={() => { setOrderDataModal(true);  this[RBSheet + index].close(); }}
                                                    left={() => (<Icon type={"MaterialCommunityIcons"} name="eye" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                                                />
                                                <Divider /> */}
                                                <List.Item
                                                    title="Change Order Status"
                                                    style={{paddingVertical:15}}
                                                    onPress={() =>  { 
                                                        let arrData = {
                                                            'order_id': item.id,
                                                            'user_id': item.user_id,
                                                            'garage_id': item.garage_id,
                                                            'vehicle_id': item.vehicle_id,
                                                            'name': item.user.name,
                                                            'email': item.user.email,
                                                            'phone_number': item.user.phone_number,
                                                            'brand_id': item.vehicle.brand_id,
                                                            'brand_name': item?.vehicle?.brand?.name,
                                                            'model_id': item?.vehicle?.model_id,
                                                            'model_name': item?.vehicle?.vehicle_model?.model_name,
                                                            'vehicle_registration_number': item?.vehicle?.vehicle_registration_number,
                                                            'odometer': item?.odometer,
                                                            'fuel_level': item?.fuel_level,
                                                            'comment': item?.comment,
                                                            'estimated_delivery_time': item?.estimated_delivery_time,
                                                            'labor_total': item?.labor_total,
                                                            'parts_total': item?.parts_total,
                                                            'services_list': item?.orderservice,
                                                            'parts_list': item?.orderparts,
                                                            'created_at': item?.created_at,
                                                            'total': item?.total,
                                                            'applicable_discount': item?.discount
                                                        }
                                                        navigation.navigate('OrderCreated', {'data': arrData});  
                                                        this[RBSheet + index].close(); 
                                                        }}
                                                    left={() => (<Icon type={"MaterialCommunityIcons"} name="clipboard-list-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                                                />
                                                <Divider />
                                                <List.Item
                                                    title="Edit Order"
                                                    style={{paddingVertical:15}}
                                                    onPress={() =>  { 
                                                        let arrData = {
                                                            'order_id': item.id,
                                                            'user_id': item.user_id,
                                                            'garage_id': item.garage_id,
                                                            'vehicle_id': item.vehicle_id,
                                                            'name': item.user.name,
                                                            'email': item.user.email,
                                                            'phone_number': item.user.phone_number,
                                                            'brand_id': item.vehicle.brand_id,
                                                            'brand_name': item?.vehicle?.brand?.name,
                                                            'model_id': item?.vehicle?.model_id,
                                                            'model_name': item?.vehicle?.vehicle_model?.model_name,
                                                            'vehicle_registration_number': item?.vehicle?.vehicle_registration_number,
                                                            'odometer': item?.odometer,
                                                            'fuel_level': item?.fuel_level,
                                                            'comment': item?.comment,
                                                            'estimated_delivery_time': item?.estimated_delivery_time,
                                                            'labor_total': item?.labor_total,
                                                            'parts_total': item?.parts_total,
                                                            'services_list': item?.orderservice,
                                                            'parts_list': item?.orderparts,
                                                            'total': item?.total,
                                                            'applicable_discount': item?.discount
                                                        }
                                                        console.log('data:', arrData);
                                                        navigation.navigate('EditRepairOrder', {'data': arrData}); 
                                                        this[RBSheet + index].close(); 
                                                    }}
                                                    left={() => (<Icon type={"MaterialCommunityIcons"} name="clipboard-edit-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                                                />
                                                <Divider />
                                            </View>
                                        </RBSheet>
                                    </>
                                )}
                            />  
                        </View>
                    :
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50,  backgroundColor:colors.white,}}>
                            <Text style={{ color: colors.black, textAlign: 'center'}}>No Orders are exist for this Garage!</Text>
                        </View>
                    )
                }
            </View>
        
        </View>
    );
}


const styles = StyleSheet.create({
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
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    cardActions: {
        alignItems: 'center'
    },
    smallActionButton: {
        fontSize: 18,
        color: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // textAlign: 'center',
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
        width: 150, 
        marginTop:8,
    },
    btnActions: {
        width: '100%',
        // flex: 1,
        flexDirection: 'row',
    },
    btnAction: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: colors.secondary, 
        alignItems: 'center', 
        justifyContent: 'center'
        // marginTop:8,
    },
    btnActionText: {
        color: colors.white,
        fontSize: 12,
    },
    upperInfo: {
        padding: 25,
        paddingBottom: 10,
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
        width: '100%'
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
    // garageId: state.garage.garage_id,
    selectedGarageId: state.garage.selected_garage_id,
})

export default connect(mapStateToProps)(WIPOrderList);
