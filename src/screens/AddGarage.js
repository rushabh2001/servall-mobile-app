import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput, Searchbar, Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import { IconX, ICON_TYPE } from '../icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import RadioForm from 'react-native-simple-radio-button';


const AddGarage = ({navigation, userToken}) => {
    
    // Garage Fields
    const [isGarageName, setIsGarageName] = useState('');
    const [isGarageContactNumber, setIsGarageContactNumber] = useState('');
    const [isCity, setIsCity] = useState();
    const [isState, setIsState] = useState();
    const [isLocation, setIsLocation] = useState('');

    // Error States
    const [garageNameError, setGarageNameError] = useState('');
    const [garageContactNumberError, setGarageContactNumberError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [ownerOption, setOwnerOption] = useState('new_user');
    const [ownerId, setOwnerId] = useState(0);
   
    // User / Owner Fields
    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isAddress, setIsAddress] = useState('');
    const [isProfileImage, setIsProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    
    // Error States
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const [CityList, setCityList] =  useState([]);
    const [StateList, setStateList] =  useState([]);
    const [adminList, setAdminList] =  useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [cityFieldToggle, setCityFieldToggle] = useState(false);

    // States for Dropdown
    // const [isUser, setIsUser] = useState('');
    const [isUserName, setIsUserName] = useState('');
    // const [userList, setUserList] = useState([]);
    const [userListModal, setUserListModal] = useState(false);
    const [isLoadingUserList, setIsLoadingUserList] = useState(false);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchQueryForUsers, setSearchQueryForUsers] = useState(); 
    const [userError, setUserError] = useState();
    
    var radio_props = [
        {label: 'New User', value: 'new_user' },
        {label: 'Existing User', value: 'existing_user' }
      ];

    const scroll1Ref = useRef();

    const submit = () => {
        setIsLoading(true);
        Keyboard.dismiss();
        if(isGarageName.length == 0){ setGarageNameError("Garage Name is required"); }        
        if(isGarageContactNumber.length == 0){ setGarageContactNumberError("Garage Contact Number is required");  } 
        if(ownerOption == "new_user") {   
            if(isCity == 0){ setCityError("City is required"); }    
            if(isState == 0){ setStateError("State is required"); }    
            if(isLocation.length == 0){ setLocationError("Location is required"); }    
            if(isName.length == 0){ setNameError("Owner Name is required"); }    
            if(isPhoneNumber.length == 0){ setPhoneNumberError("Phone Number is required"); }
            else if(isPhoneNumber.length < 9){ setPhoneNumberError("Phone Number should be minimum 10 characters"); }       
    
            if(isEmail.length == 0){ setEmailError("Email is required"); }    
            else if(isEmail.length < 6){ setEmailError("Email should be minimum 6 characters"); }      
            else if(isEmail?.indexOf(' ') >= 0){ setEmailError('Email cannot contain spaces'); }    
            else if(isEmail?.indexOf('@') < 0){ setEmailError('Invalid Email Format'); }
            else{
                setEmailError("");
                setPhoneNumberError("");
            }
        } else if(ownerOption == "existing_user") {
            if(ownerId == 0){ userError("User is required"); } else { userError(""); }
        }
    
        const data = new FormData();
        data.append('garage_name', isGarageName);
        data.append("garage_contact_number", isGarageContactNumber); 
        data.append("city", isCity); 
        data.append("state", isState); 
        data.append("location", isLocation);
        data.append("owner_option", ownerOption);
        if(ownerOption == "new_user") {
            data.append("name", isName);
            data.append("email", isEmail);
            data.append("phone_number", isPhoneNumber);
            data.append("address", isAddress);
            if(imageFile != null) { 
                const fileToUpload = imageFile;
                data.append('profile_image', fileToUpload);
            }
        } else if(ownerOption == "existing_user") {
            data.append('user_owner_id', ownerId);
        } else {
            console.log('owner options is not working');
        }

        addGarage(data);
    }

    const addGarage = async (data) => {
        try {
            const res = await fetch(`${API_URL}add_garage`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; ',
                    'Authorization': 'Bearer ' + userToken
                },
                body: data
            }).then(res => {
                const statusCode = res.status;
                let data;
                return res.json().then(obj => {
                    data = obj;
                    return { statusCode, data };
                });
            })
            .then((res) => {
                if(res.statusCode == 400) {
                  { res.data.message.email && setEmailError(res.data.message.email); }
                  { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
                  return;
                } else if(res.statusCode == 201) {
                    navigation.navigate('AllStack', { screen: 'ChooseGarage'});
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const userCheck = (data) => { 
        fetch(`${API_URL}user_check`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            const statusCode = res.status;
            let data;
            return res.json().then(obj => {
                data = obj;
                return { statusCode, data };
            });
        })
        .then((res) => {
            if(res.statusCode == 400) {
              { res.data.message.email && setEmailError(res.data.message.email); }
              { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
              return;
            } 
        });
    }

    const searchFilterForUsers = (text) => {
        if (text) {
            let newData = adminList.filter(
                function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredUserData(newData);
            setSearchQueryForUsers(text);
        } else {
            setFilteredUserData(adminList);
            setSearchQueryForUsers(text);
        }
    };

    const getStatesList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_states`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setStateList(json.states);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getCityList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_cities?state_id=${isState}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setCityList(json.cities);
                setCityFieldToggle(true);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        }
    };

    const getAdminList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_admin_list`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setAdminList(json.admin_user_list);
                setFilteredUserData(json.admin_user_list);
            }
        } catch (e) {
            console.log(e);
        }
    };
 
    const selectFile = async () => {
        // Opening Document Picker to select one file
        try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        });
        console.log(res);
        setImageFile(res[0]);
        } catch (err) {
            setImageFile(null);
        if (DocumentPicker.isCancel(err)) {
            alert('Canceled');
        } else {
            // For Unknown Error
            throw err;
        }
        }
    };

    useEffect(() => {
        if(isState != undefined) getCityList();
    }, [isState]);

    useEffect(() => {
        getStatesList();
        getAdminList();
    }, []);

    return (
    <View style={styles.pageContainer}>
        { (isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
            <InputScrollView
                ref={scroll1Ref}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={8}
                behavior="padding"
            >
                <View style={{flex:1}}>
                    <Text style={styles.headingStyle}>Garage Details:</Text>
                    <TextInput
                        mode="outlined"
                        label='Garage Name'
                        style={styles.input}
                        placeholder="Garage Name"
                        textContentType="telephoneNumber"
                        value={isGarageName}
                        onChangeText={(text) => setIsGarageName(text)}
                        rightIcon={<IconX color={colors.dark_black} size={24} name="closecircle" origin={ICON_TYPE.ANT_ICON} />}
                    />
                    {garageNameError?.length > 0 &&
                        <Text style={{color: colors.danger}}>{garageNameError}</Text>
                    }

                    <TextInput
                        mode="outlined"
                        label='Garage Contact Number'
                        style={styles.input}
                        placeholder="Garage Contact Number"
                        value={isGarageContactNumber}
                        onChangeText={(text) => setIsGarageContactNumber(text)}
                        keyboardType={"phone-pad"}
                    />
                    {garageContactNumberError?.length > 0 &&
                        <Text style={{color: colors.danger}}>{garageContactNumberError}</Text>
                    }

                    <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 20}}>
                        <Picker
                            selectedValue={isState}
                            onValueChange={(v) => setIsState(v)}
                            style={{padding: 0}}
                            itemStyle={{padding: 0}}
                        >
                            <Picker.Item label="Select State" value="0" />
                            {StateList.map((StateList, i) => {
                                return (
                                    <Picker.Item
                                        key={i}
                                        label={StateList.name}
                                        value={StateList.id}
                                    />
                                );
                            })}
                        </Picker>
                    </View>
                    {stateError?.length > 0 &&
                        <Text style={{color: colors.danger}}>{stateError}</Text>
                    }

                    <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 20}}>
                        <Picker
                            selectedValue={isCity}
                            onValueChange={(v) => setIsCity(v) }
                            style={{padding: 0}}
                            itemStyle={{padding: 0}}
                            enabled={cityFieldToggle}
                        >
                            <Picker.Item label="Select City" value="0" />
                            {CityList.map((CityList, i) => {
                                return (
                                    <Picker.Item
                                        key={i}
                                        label={CityList.name}
                                        value={CityList.id}
                                    />
                                );
                            })} 
                        </Picker>
                    </View>
                    {cityError?.length > 0 &&
                        <Text style={{color: colors.danger}}>{cityError}</Text>
                    }

                    <TextInput
                        mode="outlined"
                        label='Location'
                        style={styles.input}
                        placeholder="Location"
                        value={isLocation}
                        onChangeText={(text) => setIsLocation(text)}
                    />
                    {locationError?.length > 0 &&
                        <Text style={{color: colors.danger}}>{locationError}</Text>
                    }

                    <Divider style={{marginTop: 20}} />
                    
                    <View style={{marginTop: 15}}>
                        <RadioForm
                            radio_props={radio_props}
                            initial={0}
                            onPress={(value) => setOwnerOption(value)}
                            animation={true}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonWrapStyle={{marginLeft: 10}}
                            labelStyle={{marginRight: 40}}
                        />
                    </View>
                        {/* <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                            <Picker
                                selectedValue={ownerId}
                                onValueChange={(value) => setOwnerId(value)}
                                style={{padding: 0}}
                                itemStyle={{padding: 0}}
                            >
                                <Picker.Item label="Select Admin User" value="0" />
                                {adminList.map((List, i) => {
                                    return (
                                        <Picker.Item
                                            key={i}
                                            label={List.name}
                                            value={List.id}
                                        />
                                    );
                                })} 
                            </Picker>
                        </View> */}

                

                    { ownerOption == "existing_user" ? 
                        <>
                            <View>
                                <TouchableOpacity 
                                    style={styles.userDropDownField} 
                                    onPress={() => {
                                        setUserListModal(true);
                                    }}
                                >
                                </TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label='Owner Name'
                                    style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                                    placeholder="Select User"
                                    value={isUserName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </View>
                            {userError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{userError}</Text>
                            } 
                        </>
                    :
                        <>
                            <Text style={[styles.headingStyle, { marginTop:20 }]}>Owner Details:</Text>
                            <TextInput
                                mode="outlined"
                                label='Owner Name'
                                style={styles.input}
                                placeholder="Owner Name"
                                value={isName}
                                onChangeText={(text) => setIsName(text)}
                            />
                            {nameError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{nameError}</Text>
                            }

                            <TextInput
                                mode="outlined"
                                label='Email Address'
                                style={styles.input}
                                placeholder="Email Address"
                                value={isEmail}
                                onChangeText={(text) => setIsEmail(text)}
                            />
                            {emailError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{emailError}</Text>
                            }

                            <TextInput
                                mode="outlined"
                                label='Phone Number'
                                style={styles.input}
                                placeholder="Phone Number"
                                value={isPhoneNumber}
                                onChangeText={(text) => setIsPhoneNumber(text)}
                                keyboardType={"phone-pad"}
                            />
                            {phoneNumberError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{phoneNumberError}</Text>
                            }

                            <TextInput
                                mode="outlined"
                                label='Address'
                                style={styles.input}
                                placeholder="Address"
                                value={isAddress}
                                onChangeText={(text) => setIsAddress(text)}
                            />

                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.uploadButtonStyle}
                                    onPress={selectFile}
                                >
                                    <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                                    <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
                                        Upload Profile Image
                                    </Text>
                                    {imageFile != null ? (
                                        <Text style={styles.textStyle}>
                                        File Name: {imageFile.name ? imageFile.name : ''}
                                        </Text>
                                    ) : null}
                                </TouchableOpacity>
                            </View>
                        </>
                    }
                    <Button
                        style={{marginTop:15}}
                        mode={'contained'}
                        onPress={submit}
                    >
                        Submit
                    </Button>
                </View>
                <Portal>
                    {/* Users List Modal */}
                    <Modal visible={userListModal} onDismiss={() => { setUserListModal(false); setOwnerId(0); setIsUserName(''); setUserError(''); setSearchQueryForUsers('');  searchFilterForUsers();}} contentContainerStyle={[styles.modalContainerStyle, { flex: 0.9 }]}>
                        <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select User</Text>
                        {(isLoadingUserList == true) ? <View style={{ flex: 1, justifyContent: "center"}}><ActivityIndicator></ActivityIndicator></View> :
                            <>
                                <View style={{marginTop: 20, marginBottom: 10, flex: 1 }}>
                                    <Searchbar
                                        placeholder="Search here..."
                                        onChangeText={(text) => { if(text != null) searchFilterForUsers(text)}}
                                        value={searchQueryForUsers}
                                        elevation={0}
                                        style={{ elevation: 0.8, marginBottom: 10}}
                                    />
                                    {filteredUserData?.length > 0 ?  
                                        <FlatList
                                            ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                            data={filteredUserData}
                                            // onEndReachedThreshold={1}
                                            style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                            keyExtractor={item => item.id}
                                            renderItem={({item}) => (
                                                <>
                                                    <List.Item
                                                        title={
                                                            // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setUserListModal(false);  setAddUserModal(true); }}>
                                                                <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                    <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                </View>
                                                            // </TouchableOpacity> 
                                                        }
                                                        onPress={() => {
                                                                setIsUserName(item.name); 
                                                                setOwnerId(item.id); 
                                                                setUserError('');
                                                                setUserListModal(false);  
                                                            }
                                                        }
                                                    />
                                                </>
                                            )} 
                                        />
                                        :
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                            <Text style={{ color: colors.black, textAlign: 'center'}}>No such user is associated!</Text>
                                        </View>
                                    }
                                </View>
                            </>
                        }
                    </Modal>
                </Portal>
            </InputScrollView>
            // Modal Popup Code
        }
    </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        padding:20,
        flex: 1,
        backgroundColor: colors.white, 
        justifyContent:'center',
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
     uploadButtonStyle: {
        backgroundColor: "#F3F6F8",
        borderColor: colors.light_gray,
        borderStyle: "dashed",
        borderWidth: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
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
    userDropDownField: {
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
    modalContainerStyle: {
        backgroundColor: 'white', 
        padding: 20,
        marginHorizontal: 30
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(AddGarage);