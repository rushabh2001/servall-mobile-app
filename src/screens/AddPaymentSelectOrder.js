import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image, RefreshControl } from "react-native";
import { connect } from 'react-redux';
import { Button, Divider, TextInput, Modal, Portal, List } from "react-native-paper";
import { colors } from  "../constants";
import  { API_URL, WEB_URL } from "../constants/config"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import moment from 'moment';
import Lightbox from 'react-native-lightbox-v2';
import RBSheet from "react-native-raw-bottom-sheet";

const AddPaymentSelectOrder = ({navigation, userToken, selectedGarageId, selectedGarage, user, navigator  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);
    const [orderDataModal, setOrderDataModal] = useState(false);
    const refRBSheet = useRef();
    const [selectedOrderId, setSelectedOrderId] = useState(); 
    const [orderData, setOrderData] = useState(); 
    const [orderDataLoading, setOrderDataLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getOrderList = async () => {
        { page == 1 && setIsLoading(true) }
        { page != 1 && setIsScrollLoading(true) }
        try {
            const res = await fetch(`${API_URL}fetch_payments_order/status/${selectedGarageId}?page=${page}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    status: "Pending",
                    search: searchQuery,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                setData([
                    ...data,
                    ...json.data.data
                ]);
                setFilteredData([
                    ...filteredData,
                    ...json.data.data,
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
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_payments_order/status/${selectedGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    status: "Pending",
                    search: searchQuery,
                }),
            });
            const json = await response.json();
            if (response.status == '200') {
                setData(json.data.data);
                setFilteredData(json.data.data);
                setPage(2);
                setRefreshing(false);
            } else {
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const getOrderDetails = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}order/${orderId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setOrderData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setOrderDataLoading(false);
        }
    };

    const pullRefresh = async () => {
        setSearchQuery(null);
        try {
            const response = await fetch(`${API_URL}fetch_payments_order/status/${selectedGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    status: "Pending",
                    search: '',
                }),
            });
            const json = await response.json();
            if (response.status == '200') {
                setData(json.data.data);
                setFilteredData(json.data.data);
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
        getOrderList();
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
                <View style={{flexDirection: "column", flex: 1}}>
                    {isLoading ? <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator></ActivityIndicator></View> :
                        (filteredData.length != 0 ?             
                            <View>
                                <FlatList
                                    ItemSeparatorComponent= {() => (<Divider />)}
                                    data={filteredData}
                                    onEndReached={filteredData?.length > 9 && getOrderList}
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
                                    <>
                                        <View style={styles.cards}>
                                            <View style={styles.upperInfo}>
                                                <View style={styles.cardOrderDetails}>
                                                    <Text style={styles.orderID}>Order Id: {item.id}</Text>
                                                    <Text style={styles.orderStatus}>{item.status}</Text>
                                                
                                                    {/* <Text style={styles.orderStatus}>Completed</Text> */}
                                                </View>
                                                <View style={{right: 30, top: 35,position: 'absolute'}} >
                                                    {/* <Icon onPress={() => {this[RBSheet + index].open(); console.log(this[RBSheet + index]);}} type={"MaterialCommunityIcons"} name={'eye'} size={22}  color={colors.gray} /> */}
                                                    <Icon onPress={() => {setSelectedOrderId(item.id); refRBSheet.current.open();}} type={"MaterialCommunityIcons"} style={{right: 0, top: 0, position: 'absolute'}} name={'dots-vertical'} size={22}  color={colors.gray} />
                                                </View>
                                                <View>
                                                    {/* <Text style={styles.cardCustomerName}>Owner Name: </Text>
                                                    <Divider /> */}
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.orderAmount}>Order Amount:</Text><Text style={styles.orderAmount}> ₹ {item.total}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Name:</Text><Text style={styles.cardCustomerName}> {item.user.name}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.orderDate}>Order Date: {moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                    {/* <Divider />
                                                    <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                                                    <Text style={styles.cardCustomerName}>Owner`s Phone Number: </Text>
                                                    <Divider />
                                                    <Text style={styles.cardCustomerName}>Brand:</Text>
                                                    <Divider />
                                                    <Text style={styles.cardCustomerName}>Model: </Text> */}
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Registration Number: </Text><Text style={styles.cardCustomerName}>{item.vehicle.vehicle_registration_number}</Text>
                                                    </View>
                                                    <Divider />
                                                    <View style={{flexDirection: 'row'}}>
                                                        <Text style={styles.cardCustomerName}>Estimate Delivery Date: </Text><Text style={styles.cardCustomerName}>{moment(item.estimated_delivery_time, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A')}</Text>
                                                    </View>
                                                    {/* <Divider />
                                                    <Text style={styles.cardCustomerName}>Services:</Text>
                                                    <Divider />
                                                    <Text style={styles.cardCustomerName}>Parts:</Text> */}
                                                </View>
                                                <View style={styles.cardActions}>
                                                    {/* <TouchableOpacity onPress={()=>{setOrderDataModal(true); }} style={styles.smallActionButton}><Text style={{color:colors.primary}}>View More Details...</Text></TouchableOpacity> */}
                                                    <TouchableOpacity onPress={()=>{
                                                            const data = {
                                                                'order_id': item.id,
                                                                'total': item.total,
                                                            }
                                                            navigation.navigate('AddPayment', {'data': data})
                                                        }} style={[styles.smallActionButton, {width: 150, marginTop:8}]}>
                                                        <Text style={{color:colors.primary}}>Select Order</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                    )}
                                />  
                                <Portal>
                                    <Modal visible={orderDataModal} onDismiss={() => {setOrderDataModal(false); }} contentContainerStyle={[styles.modalContainerStyle, {flex: 0.9}]}>
                                        <IconX name="times" size={20} color={colors.black} style={{ position: 'absolute', top: 25, right: 25, zIndex: 99  }} onPress={() => {setOrderDataModal(false); }} />
                                        <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Order Details</Text>
                                        {orderDataLoading ? 
                                            <View style={{ flex: 1, justifyContent: "center"}}><ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator></View>
                                        :
                                            <ScrollView>
                                                <Text style={styles.cardDetailsHeading}>Order ID:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.id}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Status:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.status}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Odometer:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.odometer}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Fuel Level:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.fuel_level}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Date:</Text>
                                                <Text style={styles.cardDetailsData}>{moment(orderData.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Estimated Delivery Time:</Text>
                                                <Text style={styles.cardDetailsData}>{moment(orderData.estimated_delivery_time, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A')}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Services Total:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.labor_total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Parts Total:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.parts_total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Total Discount:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.discount}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Total:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Belongs to Garage:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.garage.garage_name}</Text>
                                                {/* <Divider /> */}
                                    
                                                <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>User Details</Text>                                                   
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Name:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.name}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Phone Number:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.phone_number}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Email Address:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.email}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Address:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.address}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>State:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.state}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>City:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.user.city}</Text>
                                                {/* <Divider /> */}

                                                <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>Vehicle Details</Text>                                                   
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Vehicle Registration Number:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.vehicle_registration_number ? orderData.vehicle?.vehicle_registration_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Vehicle Brand:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.brand?.name ? orderData.vehicle?.brand?.name : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Vehicle Model:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.vehicle_model?.model_name ? orderData.vehicle?.vehicle_model?.model_name : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Purchase Date:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.purchase_date ? moment(orderData.vehicle?.purchase_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Manufacturing Date:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.manufacturing_date ? moment(orderData.vehicle?.manufacturing_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Engine Number:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.engine_number ? orderData.vehicle?.engine_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Chasis Number:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.chasis_number ? orderData.vehicle?.chasis_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurance Provider Company:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurance_provider?.name ? orderData.vehicle?.insurance_provider?.name : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurer GSTIN:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurer_gstin ? orderData.vehicle?.insurer_gstin : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurer Address:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurer_address ? orderData.vehicle?.insurer_address : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Policy Number:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.policy_number ? orderData.vehicle?.policy_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurance Expiry Date:</Text>
                                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurance_expiry_date ? moment(orderData.vehicle?.insurance_expiry_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Registration Certificate:</Text>
                                                {orderData.vehicle?.registration_certificate_img !== null ?
                                                    <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                        <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/registration_certificate_img/' + orderData.vehicle?.registration_certificate_img }} /> 
                                                    </Lightbox>
                                                :
                                                    <Text style={styles.cardDetailsData}>Not Uploaded Registration Certificate</Text>
                                                }
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurance Policy:</Text>
                                                {orderData.vehicle?.insurance_img !== null ?
                                                    <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                        <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/insurance_img/' + orderData.vehicle?.insurance_img }} />
                                                    </Lightbox>
                                                :
                                                    <Text style={styles.cardDetailsData}>Not Uploaded Insurance Policy</Text>
                                                }

                                            </ScrollView>
                                        }
                                        <View style={{flexDirection: "row",}}>
                                
                                            <View style={{flex: 1}}></View>
                                            <Button
                                                style={{marginTop:15, flex: 1.4, alignSelf: 'center'}}
                                                mode={'contained'}
                                                onPress={() => { setOrderDataModal(false); }}
                                            >
                                                Close
                                            </Button>
                                            <View style={{flex: 1}}></View>
                                        </View>
                                    </Modal>
                                </Portal>
                            </View>
                        :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 50,  backgroundColor:colors.white,}}>
                                <Text style={{ color: colors.black, textAlign: 'center'}}>No Orders are exist for this Garage!</Text>
                            </View>
                        )
                    }

                    <RBSheet
                        ref={refRBSheet}
                        height={63}
                        openDuration={250}
                        >
                        <View style={{flexDirection:"column", flex:1}}>
                            <List.Item
                                title="View Order Details"
                                style={{paddingVertical:15}}
                                onPress={() => { setOrderDataModal(true); refRBSheet.current.close(); getOrderDetails(selectedOrderId); }}
                                left={() => (<Icon type={"MaterialCommunityIcons"} name="eye" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                            />
                            {/* <Divider /> */}
                        </View>
                    </RBSheet>
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
    surfaceContainer: {
        flex:1,
        padding:15,
        // marginBottom: 35
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
    smallActionButton: {
        fontSize: 16,
        color: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 3,
        marginTop: 7,
        marginBottom: 10
    },
    btnActions: {
        width: '100%',
        flexDirection: 'row',
    },
    btnAction: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: colors.secondary, 
        alignItems: 'center', 
        justifyContent: 'center'
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
        marginVertical: 20,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
})

export default connect(mapStateToProps)(AddPaymentSelectOrder);
