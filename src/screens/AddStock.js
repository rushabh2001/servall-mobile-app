import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput, Searchbar, Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddStock = ({ navigation, selectedGarageId, userRole, userId, userToken }) => {

    // User / Customer Fields
    const [isPart, setIsPart] = useState('');
    const [isPrice, setIsPrice] = useState('');
    const [isMRP, setIsMRP] = useState('');
    const [isCurrentStock, setIsCurrentStock] = useState('');
    const [isMinStock, setIsMinStock] = useState('');
    const [isMaxStock, setIsMaxStock] = useState('');
    const [isRackId, setIsRackId] = useState('');
    const [isComment, setIsComment] = useState('');
    const [priceError, setPriceError] = useState('');     // Error States
    const [mrpError, setMrpError] = useState('');
    const [currentStockError, setCurrentStockError] = useState('');
    const [minStockError, setMinStockError] = useState('');
    const [maxStockError, setMaxStockError] = useState('');
    const [rackIdError, setAddressError] = useState('');
    const [commentError, setCommentError] = useState('');
    const [partError, setPartError] = useState('');

    // Vehicle Fields
    const [isVendor, setIsVendor] = useState();
    const [isVendorName, setIsVendorName] = useState();
    const [vendorError, setVendorError] = useState('');   // Error State

    const [isGarageId, setIsGarageId] = useState();
    const [garageIdError, setGarageIdError] = useState();

    const [garageList, setGarageList] = useState([]);
    const [vendorList, setVendorList] = useState([]);

    const [addVendorModal, setAddVendorModal] = useState(false);
    const [newVendor, setNewVendor] = useState();
    const [newVendorError, setNewVendorError] = useState();

    const [isPartName, setIsPartName] = useState('');
    const [partList, setPartList] = useState([]);
    const [partListModal, setPartListModal] = useState(false);
    const [isLoadingPartList, setIsLoadingPartList] = useState(false);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState(); 
    
    const [isNewPart, setIsNewPart] = useState('');
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);
  
    const [isLoading, setIsLoading] = useState(false);

    const scroll1Ref = useRef();

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

    const addNewPart = async () => {
        let data = { 'name': isNewPart }
        try {
            const res = await fetch(`${API_URL}add_parts`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            // console.log(json);
            if (json !== undefined) {
                // console.log('setPartList', json.data);
                // setIsLoading2(true);
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(true);
            // setAddPartModal(true);
        }
    }

    const searchFilterForParts = (text) => {
        if (text) {
            let newData = partList.filter(
                function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredPartData(newData);
            setSearchQueryForParts(text);
        } else {
            setFilteredPartData(partList);
            setSearchQueryForParts(text);
        }
    };

    const getPartList = async () => {
        setIsLoadingPartList(true);
        try {
            const res = await fetch(`${API_URL}fetch_parts`, {
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
                // console.log('setPartList', json.data);
                setPartList(json.data);
                setFilteredPartData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
            setIsLoadingPartList(false)

        }
    };


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

    const getGarageList = async () => {
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
            if (json !== undefined) {
                setGarageList(json.garage_list);
                // console.log(json);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            setIsGarageId(selectedGarageId);
        }
    };

    useEffect(() => {
        getBrandList();
        getGarageList();
        getPartList();
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
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>New Stock Details:</Text>
                        {/* <View style={styles.dropDownContainer}>
                            <Picker
                                // key={brandRef}
                                selectedValue={isVendor}
                                onValueChange={(optionId) => { setIsVendor(optionId); if (optionId == "new_vendor") setAddVendorModal(true) }}
                                style={styles.dropDownField}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item label="Select Part" value="0" />
                                {vendorList.map((vendorList, i) => {
                                    return (
                                        <Picker.Item
                                            key={'vendor'+i}
                                            label={vendorList.name}
                                            value={vendorList.id}
                                        />
                                    );
                                })}
                                <Picker.Item label="Add New Part" value="new_vendor" />
                            </Picker>
                        </View>
                        {vendorError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{vendorError}</Text>
                        } */}

                        <View>
                            <TouchableOpacity 
                                style={styles.partDropDownField} 
                                onPress={() => {
                                    setPartListModal(true);
                                    setIsNewPart('');
                                    setNewPartError('');
                                }}
                            >
                            </TouchableOpacity>
                            <TextInput
                                mode="outlined"
                                label='Part'
                                style={{marginTop: 10, backgroundColor: colors.white, width:'100%' }}
                                placeholder="Select Part"
                                value={isPartName}
                            />
                        </View>

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
                                        {/* <Picker.Item label="Add New Insurance Company" value="new_insurance_company" /> */}
                                    </Picker>
                                </View>
                                {garageIdError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{garageIdError}</Text>
                                }
                            </View>
                        }

                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            // onPress={submit}
                        >
                            Add
                        </Button>
                     
                    </View>
                </InputScrollView>
            }

            <Portal>
                {/* Parts List Modal */}
                <Modal visible={partListModal} onDismiss={() => { setPartListModal(false); setIsPart(0); setIsPartName(''); setPartError(''); setSearchQueryForParts('');  searchFilterForParts();}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Part</Text>
                    {(isLoadingPartList == true) ? <ActivityIndicator></ActivityIndicator>
                        :
                        <>
                            <View style={{marginTop: 20, marginBottom: 10}}>
                                <Searchbar
                                    placeholder="Search here..."
                                    onChangeText={(text) => { if(text != null) searchFilterForParts(text)}}
                                    value={searchQueryForParts}
                                    elevation={0}
                                    style={{ elevation: 0.8, marginBottom: 10}}
                                />
                                {filteredPartData?.length > 0 ?  
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                        data={filteredPartData}
                                        // onEndReachedThreshold={1}
                                        style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                        keyExtractor={item => item.id}
                                        renderItem={({item}) => (
                                            <>
                                                <List.Item
                                                    title={
                                                        // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setPartListModal(false);  setAddPartModal(true); }}>
                                                            <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                            </View>
                                                        // </TouchableOpacity> 
                                                    }
                                                    onPress={() => {
                                                            setIsPartName(item.name); 
                                                            setIsPart(item.id); 
                                                            setPartError('');
                                                            setPartListModal(false);  
                                                            setSearchQueryForParts(''); 
                                                            searchFilterForParts();
                                                        }
                                                    }
                                                />
                                            </>
                                        )} 
                                    />
                                    :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such part is associated!</Text>
                                    </View>
                                }
                                <View style={{justifyContent:"flex-end", flexDirection: 'row'}}>
                                    <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => { setAddNewPartModal(true); setPartListModal(false); }}>
                                        <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                        <Text style={{color: colors.white}}>Add Part</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    }
                </Modal>
                <Modal visible={addNewPartModal} onDismiss={() => { setAddNewPartModal(false); setPartListModal(true);  setIsNewPart(0); setNewPartError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Part</Text>
                    <View>
                        <TextInput
                            mode="outlined"
                            label='Part Name'
                            style={styles.input}
                            placeholder="Part Name"
                            value={isNewPart}
                            onChangeText={(text) => setIsNewPart(text)}
                        />
                    </View>
                    {newPartError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newPartError}</Text>
                    }
                    <View style={{ flexDirection: "row", marginTop: 10}}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            onPress={() => {
                                if(isNewPart == "") {
                                    setNewPartError("Please Enter Part Name");
                                } else {
                                    setAddNewPartModal(false);
                                    setIsNewPart('');
                                    setNewPartError('');
                                    addNewPart();
                                }
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
                            mode={'contained'}
                            onPress={() => {
                                setAddNewPartModal(false);
                                setPartListModal(true);
                                setIsNewPart('');
                                setNewPartError('');
                            }}
                        >
                            Close
                        </Button>
                    </View>
                </Modal>

            </Portal>
            {/* <Portal>
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
            </Portal> */}

        </View>
    )
}



const styles = StyleSheet.create({
    partDropDownField: {
        // padding: 15,
        fontSize: 16,
        color: colors.black,
        position: 'absolute',
        // backgroundColor: colors.black,
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
})

export default connect(mapStateToProps)(AddStock);