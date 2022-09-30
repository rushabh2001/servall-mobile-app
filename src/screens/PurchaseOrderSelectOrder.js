import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { connect } from 'react-redux';
import { Button, Divider, Searchbar, Modal, Portal, List } from "react-native-paper";
import { colors } from  "../constants";
import  { API_URL, WEB_URL } from "../constants/config"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';
import Lightbox from 'react-native-lightbox-v2';
import RBSheet from "react-native-raw-bottom-sheet";
import CommonHeader from "../Component/CommonHeaderComponent";

const PurchaseOrderSelectOrder = ({navigation, userToken, selectedGarageId, navigator  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);
    const [orderDataModal, setOrderDataModal] = useState(false);
    const [orderData, setOrderData] = useState('');
    const refRBSheet = useRef();

    const getOrderList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_garage_order/${isGarageId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setData(json.data);
                setFilteredData(json.data);
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

    useEffect(() => {
        getOrderList();
    }, []);

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
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent= {() => (<Divider />)}
                                data={filteredData}
                                // onEndReachedThreshold={1}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => (
                                <>
                                    <View style={styles.cards}>
                                        <View style={styles.upperInfo}>
                                            <View style={styles.cardOrderDetails}>
                                                <Text style={styles.orderID}>Order Id: {item.id}</Text>
                                                <Text style={styles.orderStatus}>{item.status}</Text>
                                            
                                                {/* <Text style={styles.orderStatus}>Completed</Text> */}
                                            </View>
                                            <View style={{right: 30, top: 35,position: 'absolute'}} >
                                                <Icon onPress={() => {refRBSheet.current.open();}} type={"MaterialCommunityIcons"} name={'dots-vertical'} size={22}  color={colors.gray} />
                                                {/* <Icon onPress={() => {refRBSheet.current.open();}} type={"MaterialCommunityIcons"} style={{right: 5, top: 8,position: 'absolute'}} name={'dots-vertical'} size={22}  color={colors.gray} /> */}
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
                                                        'customer_name': item.user.name?.trim(),
                                                    }

                                                    navigation.navigate('PurchaseOrder', {'data': data})

                                                    }} style={[styles.smallActionButton, {width: 150, marginTop:8}]}>
                                                    <Text style={{color:colors.primary}}>Select Order</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <Portal>
                                        <Modal visible={orderDataModal} onDismiss={() => {}} contentContainerStyle={styles.modalContainerStyle}>
                                            <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Order Details</Text>
                                            {/* {vehicleDataLoading 
                                            ? 
                                                <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> 
                                            : */}
                                                <ScrollView showsVerticalScrollIndicator={false}>
                                                <Text style={styles.cardDetailsHeading}>Order ID:</Text>
                                                <Text style={styles.cardDetailsData}>{item.id}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Status:</Text>
                                                <Text style={styles.cardDetailsData}>{item.status}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Odometer:</Text>
                                                <Text style={styles.cardDetailsData}>{item.odometer}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Fuel Level:</Text>
                                                <Text style={styles.cardDetailsData}>{item.fuel_level}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Date:</Text>
                                                <Text style={styles.cardDetailsData}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Estimated Delivery Time:</Text>
                                                <Text style={styles.cardDetailsData}>{moment(item.estimated_delivery_time, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A')}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Services Total:</Text>
                                                <Text style={styles.cardDetailsData}>{item.labor_total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Parts Total:</Text>
                                                <Text style={styles.cardDetailsData}>{item.parts_total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Total Discount:</Text>
                                                <Text style={styles.cardDetailsData}>{item.discount}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Order Total:</Text>
                                                <Text style={styles.cardDetailsData}>{item.total}</Text>
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Registration Certificate:</Text>
                                                {/* {VehicleData?.registration_certificate_img !== null ? */}
                                                    {/* <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                        <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/registration_certificate_img/' + VehicleData?.registration_certificate_img }} /> 
                                                    </Lightbox> */}
                                                {/* : */}
                                                    <Text style={styles.cardDetailsData}>Not Uploaded Registration Certificate</Text>
                                                {/* } */}
                                                <Divider />
                                                <Text style={styles.cardDetailsHeading}>Insurance Policy:</Text>
                                                {/* {VehicleData?.insurance_img !== null ? */}
                                                    {/* <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                        <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/insurance_img/' + VehicleData?.insurance_img }} />
                                                    </Lightbox> */}
                                                {/* : */}
                                                    <Text style={styles.cardDetailsData}>Not Uploaded Insurance Policy</Text>
                                                {/* } */}
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Order Belongs to Garage:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.garage.garage_name}</Text>
                                                    {/* <Divider /> */}
                                        
                                                    <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>User Details</Text>                                                   
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Name:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.name}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Phone Number:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.phone_number}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Email Address:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.email}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Address:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.address}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>State:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.state}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>City:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.user.city}</Text>
                                                    {/* <Divider /> */}

                                                    <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>Vehicle Details</Text>                                                   
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Vehicle Registration Number:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.vehicle_registration_number ? item.vehicle?.vehicle_registration_number : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Vehicle Brand:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.brand?.name ? item.vehicle?.brand?.name : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Vehicle Model:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.vehicle_model?.model_name ? item.vehicle?.vehicle_model?.model_name : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Purchase Date:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.purchase_date ? moment(item.vehicle?.purchase_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Manufacturing Date:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.manufacturing_date ? moment(item.vehicle?.manufacturing_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Engine Number:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.engine_number ? item.vehicle?.engine_number : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Chasis Number:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.chasis_number ? item.vehicle?.chasis_number : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Insurance Provider Company:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.insurance_provider?.name ? item.vehicle?.insurance_provider?.name : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Insurer GSTIN:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.insurer_gstin ? item.vehicle?.insurer_gstin : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Insurer Address:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.insurer_address ? item.vehicle?.insurer_address : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Policy Number:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.policy_number ? item.vehicle?.policy_number : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Insurance Expiry Date:</Text>
                                                    <Text style={styles.cardDetailsData}>{item.vehicle?.insurance_expiry_date ? moment(item.vehicle?.insurance_expiry_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Registration Certificate:</Text>
                                                    {item.vehicle?.registration_certificate_img !== null ?
                                                        <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                            <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/registration_certificate_img/' + item.vehicle?.registration_certificate_img }} /> 
                                                        </Lightbox>
                                                    :
                                                        <Text style={styles.cardDetailsData}>Not Uploaded Registration Certificate</Text>
                                                    }
                                                    <Divider />
                                                    <Text style={styles.cardDetailsHeading}>Insurance Policy:</Text>
                                                    {item.vehicle?.insurance_img !== null ?
                                                        <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                                            <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/insurance_img/' + item.vehicle?.insurance_img }} />
                                                        </Lightbox>
                                                    :
                                                        <Text style={styles.cardDetailsData}>Not Uploaded Insurance Policy</Text>
                                                    }

                                                </ScrollView>
                                            {/* } */}
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

                                    <RBSheet
                                        ref={refRBSheet}
                                        height={63}
                                        openDuration={250}
                                        >
                                        <View style={{flexDirection:"column", flex:1}}>
                                            <List.Item
                                                title="View Order Details"
                                                style={{paddingVertical:15}}
                                                onPress={() => { setOrderDataModal(true); refRBSheet.current.close(); }}
                                                left={() => (<Icon type={"MaterialCommunityIcons"} name="eye" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                                            />
                                            {/* <Divider /> */}
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
   
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
})

export default connect(mapStateToProps)(PurchaseOrderSelectOrder);