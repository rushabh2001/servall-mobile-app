import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput, Searchbar, Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';

const AddStock = ({ navigation, selectedGarageId, userRole, userId, userToken, route, garageId }) => {

    // User / Customer Fields
    const [isPart, setIsPart] = useState(route?.params?.data?.parts?.id);
    const [isPartName, setIsPartName] = useState(route?.params?.data?.parts?.name);
    const [isStockId, setIsStockId] = useState(route?.params?.data?.id);
    const [isPrice, setIsPrice] = useState(JSON.stringify(route?.params?.data?.purchase_price));
    const [isMRP, setIsMRP] = useState(JSON.stringify(route?.params?.data?.mrp));
    const [isCurrentStock, setIsCurrentStock] = useState(JSON.stringify(route?.params?.data?.current_stock));
    const [isMinStock, setIsMinStock] = useState(JSON.stringify(route?.params?.data?.min_stock));
    const [isMaxStock, setIsMaxStock] = useState(JSON.stringify(route?.params?.data?.max_stock));
    const [isRackId, setIsRackId] = useState(route?.params?.data?.rack_id);
    const [isComment, setIsComment] = useState(route?.params?.data?.comment);
    const [priceError, setPriceError] = useState('');     // Error States
    const [mrpError, setMrpError] = useState('');
    const [currentStockError, setCurrentStockError] = useState('');
    const [minStockError, setMinStockError] = useState('');
    const [maxStockError, setMaxStockError] = useState('');
    const [rackIdError, setAddressError] = useState('');
    const [commentError, setCommentError] = useState('');

    // Vehicle Fields
    const [isVendor, setIsVendor] = useState();
    const [isVendorName, setIsVendorName] = useState();
    const [vendorError, setVendorError] = useState('');   // Error State

    // const [isGarageId, setIsGarageId] = useState();

    // const [garageList, setGarageList] = useState([]);
    const [vendorList, setVendorList] = useState([]);

    const [addVendorModal, setAddVendorModal] = useState(false);
    const [newVendor, setNewVendor] = useState();
    const [newVendorError, setNewVendorError] = useState();

    // States for Garage Dropdown
    const [isGarage, setIsGarage] = useState(route?.params?.data?.garage?.id);
    const [isGarageName, setIsGarageName] = useState(route?.params?.data?.garage?.garage_name);
    const [garageList, setGarageList] = useState([]);
    const [garageListModal, setGarageListModal] = useState(false);
    const [isLoadingGarageList, setIsLoadingGarageList] = useState(false);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState(); 
    const [garageError, setGarageError] = useState();
  
    const [isLoading, setIsLoading] = useState(false);

    const scroll1Ref = useRef();

    //    useEffect(() => {
    //     console.log('route', route?.params);
    // }, [route?.params]);

    // Functions Dropdown
    const searchFilterForGarages = (text) => {
        if (text) {
            let newData = garageList.filter(
                function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.garage_name ? listData.garage_name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredGarageData(newData);
            setSearchQueryForGarages(text);
        } else {
            setFilteredGarageData(garageList);
            setSearchQueryForGarages(text);
        }
    };

    const getGarageList = async () => {
        setIsLoadingGarageList(true);
        try {
            const res = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            // console.log(json);
            if (json !== undefined) {
                // console.log('setGarageList', json.data);
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
            setIsLoadingGarageList(false)

        }
    };

    // const addNewBrand = async () => {
    //     let data = { 'name': newVendor }
    //     try {
    //         const res = await fetch(`${API_URL}create_brand`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: JSON.stringify(data)
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             await getBrandList();
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         // setIsLoading(false);
    //         setAddVendorModal(false);
    //         setNewVendor("");
    //         setIsVendor(0);
    //     }
    // };

    // const validate = () => {
    //     return !(
    //         !isPrice || isPrice?.trim().length === 0 ||
    //         !isCurrentStock || isCurrentStock?.trim().length === 0 ||
    //         !isMRP || isMRP?.trim().length === 0 || isMRP?.trim().length < 6 || isMRP?.indexOf('@') < 0 || isMRP?.indexOf(' ') >= 0 ||
    //         !isVendor || isVendor === 0 ||
    //         !isGarageId || isGarageId === 0 
    //     )
    // }

    // const submit = () => {

    //     Keyboard.dismiss();

    //     if (!validate()) {
    //         if (!isPrice) setNameError("Customer Name is required"); else setNameError('');
    //         if (!isCurrentStock) setPhoneNumberError("Current Stock is required"); else setPhoneNumberError('');
    //         if (!isVendor || isVendor === 0) setVendorError('Brand is required'); else setVendorError('');
    //         if (!isGarageId || isGarageId == 0) setGarageIdError("Customer Belongs to Garage Field is required"); else setGarageIdError('');
    //         return;
    //     }

    //     const data = new FormData();
    //     data.append('name', isPrice?.trim());
    //     data.append('email', isMRP?.trim());
    //     data.append('phone_number', isCurrentStock?.trim());
    //     data.append('city', isCity);
    //     data.append('state', isState);
    //     if (isRackId) data.append('address', isRackId?.trim());
    //     data.append('brand_id', JSON.stringify(isVendor));
    //     data.append('model_id', JSON.stringify(isModel));
    //     data.append('vehicle_registration_number', isVehicleRegistrationNumber?.trim());
    //     if (isPurchaseDate) data.append('purchase_date', isPurchaseDate);
    //     if (isManufacturingDate) data.append('manufacturing_date', isManufacturingDate);
    //     if (isEngineNumber) data.append('engine_number', isEngineNumber?.trim());
    //     if (isChasisNumber) data.append('chasis_number', isChasisNumber?.trim());
    //     if (isInsuranceProvider) data.append('insurance_id', parseInt(isInsuranceProvider));
    //     if (isInsurerGstin) data.append('insurer_gstin', isInsurerGstin?.trim());
    //     if (isInsurerAddress) data.append('insurer_address', isInsurerAddress?.trim());
    //     if (isPolicyNumber) data.append('policy_number', isPolicyNumber?.trim());
    //     if (isInsuranceExpiryDate) data.append('insurance_expiry_date', isInsuranceExpiryDate);
    //     if (isRegistrationCertificateImg != null) data.append('registration_certificate_img', isRegistrationCertificateImg);
    //     if (isInsuranceImg != null) data.append('insurance_img', isInsuranceImg);
    //     data.append('vehicle_option', 'new_vehicle');
    //     data.append('garage_id', isGarageId);
    //     data.append('odometer_kms', isOdometerKMs);
    //     data.append('fuel_level', isFuelLevel);

    //     addCustomer(data);
    //     setIsUserVehicleDetails(data);
    //     // console.log(JSON.stringify(data));
    //     // console.log(isRegistrationCertificateImg);  
    // }

    const getBrandList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_brand`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.states);
                setVendorList(json.brand_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    // const getGarageList = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             setGarageList(json.garage_list);
    //             // console.log(json);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoading(false);
    //         setIsGarageId(selectedGarageId);
    //     }
    // };

    useEffect(() => {
        getBrandList();
        getGarageList();
        // console.log('garageId:', garageId);
        // console.log('selectedGarageId:',  selectedGarageId == 0 ? console.log('option1') : parseInt(garageId));
    }, []);

    return (
        <View style={styles.pageContainer}>
            {isLoading == true ? <ActivityIndicator></ActivityIndicator> :
                <InputScrollView
                    ref={scroll1Ref}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    // keyboardOffset={160}
                    behavior="padding"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Stock Details:</Text>
                        {/* <View style={styles.dropDownContainer}> */}
                        <TextInput
                                mode="outlined"
                                label='Part'
                                style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                                placeholder="Select Part"
                                value={isPartName}
      				            right={<TextInput.Icon name="menu-down" />}
                                // editable={false}
                                disabled={true}
                            />
                            {/* <Picker
                                enabled={false}
                                // key={brandRef}
                                selectedValue={isPart}
                                onValueChange={(optionId) => { setIsPart(optionId); if (optionId == "new_part") setAddPartModal(true) }}
                                style={styles.dropDownField}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item label="Select Part" value="0" />
                                {partList.map((partList, i) => {
                                    return (
                                        <Picker.Item
                                            key={'part'+i}
                                            label={partList.name}
                                            value={partList.id}
                                        />
                                    );
                                })}
                                <Picker.Item label="Add New Part" value="new_part" />
                            </Picker> */}
                        {/* </View> */}
                        {/* {partError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{partError}</Text>
                        } */}

                        <View style={styles.dropDownContainer}>
                            <Picker
                                // key={brandRef}
                                selectedValue={isVendor}
                                onValueChange={(optionId) => { setIsVendor(optionId); if (optionId == "new_vendor") setAddVendorModal(true) }}
                                style={styles.dropDownField}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item label="Select Vendor" value="0" />
                                {vendorList.map((vendorList, i) => {
                                    return (
                                        <Picker.Item
                                            key={'vendor'+i}
                                            label={vendorList.name}
                                            value={vendorList.id}
                                        />
                                    );
                                })}
                                <Picker.Item label="Add New Vendor" value="new_vendor" />
                            </Picker>
                        </View>
                        {vendorError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{vendorError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Purchase Price (Without GST)'
                            style={styles.input}
                            placeholder="Purchase Price (Without GST)"
                            value={isPrice}
                            onChangeText={(text) => setIsName(text)}
                            keyboardType={"phone-pad"}
                        />
                        {priceError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{priceError}</Text>
                        }
                        <TextInput
                            mode="outlined"
                            label='MRP'
                            style={styles.input}
                            placeholder="MRP"
                            value={isMRP}
                            onChangeText={(text) => setIsMRP(text)}
                            keyboardType={"phone-pad"}
                        />
                        {mrpError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{mrpError}</Text>
                        }
                        <TextInput
                            mode="outlined"
                            label='Rack ID'
                            style={styles.input}
                            placeholder="Rack ID"
                            value={isRackId}
                            onChangeText={(text) => setIsRackId(text)}
                            keyboardType={"phone-pad"}
                        />
                        {rackIdError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{rackIdError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Current Stock'
                            style={styles.input}
                            placeholder="Current Stock"
                            value={isCurrentStock}
                            onChangeText={(text) => setIsCurrentStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {currentStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{currentStockError}</Text>
                        }

                        {/* <TextInput
                            mode="outlined"
                            label='Current Stock'
                            style={styles.input}
                            placeholder="Current Stock"
                            value={isCurrentStock}
                            onChangeText={(text) => setIsCurrentStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {currentStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{currentStockError}</Text>
                        } */}

                        <TextInput
                            mode="outlined"
                            label='Minimum Stock'
                            style={styles.input}
                            placeholder="Minimum Stock"
                            value={isMinStock}
                            onChangeText={(text) => setIsMinStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {minStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{minStockError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Maximum Stock'
                            style={styles.input}
                            placeholder="Maximum Stock"
                            value={isMaxStock}
                            onChangeText={(text) => setIsMaxStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {maxStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{maxStockError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Comment'
                            style={styles.input}
                            placeholder="Comment"
                            value={isComment}
                            onChangeText={(text) => setIsComment(text)}
                            numberOfLines={3}
                            multiline={true}
                        />
                        {commentError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{commentError}</Text>
                        }

                        {(userRole == "Super Admin" || garageId?.length > 1) &&
                            <View>
                                <TouchableOpacity 
                                    style={styles.garageDropDownField} 
                                    onPress={() => {
                                        setGarageListModal(true);
                                    }}
                                >
                                </TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label='Garage'
                                    style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                                    placeholder="Select Garage"
                                    value={isGarageName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                                {garageError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{garageError}</Text>
                                }
                            </View>
                        }

                            {/* <View> 
                                 <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isGarageId}
                                        onValueChange={(option) => setIsGarageId(option)}
                                        style={styles.dropDownField}
                                        itemStyle={{ padding: 0 }}
                                    >
                                        <Picker.Item label="Customer Belongs To Garage" value="0" />
                                        {garageList.map((garageList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={'garage'+i}
                                                    label={garageList.garage_name}
                                                    value={garageList.id}
                                                />
                                            );
                                        })}
                                        <Picker.Item label="Add New Insurance Company" value="new_insurance_company" />
                                    </Picker>
                                </View> 
                                {garageError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{garageError}</Text>
                                }
                            </View> */}
              
                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            // onPress={submit}
                        >
                            Next
                        </Button>
                     
                    </View>
                </InputScrollView>
            }
            <Portal>
                <Modal visible={addVendorModal} onDismiss={() => { setAddVendorModal(false); setNewVendor(""); setIsVendor(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Brand</Text>
                    <TextInput
                        mode="outlined"
                        label='Vendor Name'
                        style={styles.input}
                        placeholder="Vendor Name"
                        value={newVendor}
                        onChangeText={(text) => setNewVendor(text)}
                    />
                    {newVendorError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newVendorError}</Text>
                    }
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            // onPress={addNewBrand}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
                            mode={'contained'}
                            onPress={() => setAddVendorModal(false)}
                        >
                            Close
                        </Button>
                    </View>
                </Modal>

                {/* Garages List Modal */}
                <Modal visible={garageListModal} onDismiss={() => { setGarageListModal(false); setIsGarage(0); setIsGarageName(''); setGarageError(''); setSearchQueryForGarages('');  searchFilterForGarages();}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Garage</Text>
                    {(isLoadingGarageList == true) ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator>
                        :
                        <>
                            <View style={{marginTop: 20, marginBottom: 10}}>
                                <Searchbar
                                    placeholder="Search here..."
                                    onChangeText={(text) => { if(text != null) searchFilterForGarages(text)}}
                                    value={searchQueryForGarages}
                                    elevation={0}
                                    style={{ elevation: 0.8, marginBottom: 10}}
                                />
                                {filteredGarageData?.length > 0 ?  
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                        data={filteredGarageData}
                                        // onEndReachedThreshold={1}
                                        style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                        keyExtractor={item => item.id}
                                        renderItem={({item}) => (
                                            <>
                                                <List.Item
                                                    title={
                                                        // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setGarageListModal(false);  setAddGarageModal(true); }}>
                                                            <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                <Text style={{fontSize:16, color: colors.black}}>{item.garage_name}</Text>
                                                            </View>
                                                        // </TouchableOpacity> 
                                                    }
                                                    onPress={() => {
                                                            setIsGarageName(item.garage_name); 
                                                            setIsGarage(item.id); 
                                                            setGarageError('');
                                                            setGarageListModal(false);  
                                                        }
                                                    }
                                                />
                                            </>
                                        )} 
                                    />
                                    :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such garage is associated!</Text>
                                    </View>
                                }
                            </View>
                        </>
                    }
                </Modal>
            </Portal>

        </View>
    )
}



const styles = StyleSheet.create({
    garageDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: 'absolute',
        marginTop: 15,
        left: 0,
        top: 0,
        width: '100%',
        height: '80%',
        zIndex: 2,
    },
    pageContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    input: {
        marginTop: 20,
        fontSize: 16,
    },
    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: '500',
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
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 30
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id
})

export default connect(mapStateToProps)(AddStock);