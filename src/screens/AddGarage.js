import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, Image, TextInput, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import { Button } from 'react-native-paper';
import { IconX, ICON_TYPE } from '../icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
// import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


const AddGarage = ({navigation, userToken}) => {
    
    // Garage Fields
    const [isGarageName, setIsGarageName] = useState('');
    const [isGarageContactNumber, setIsGarageContactNumber] = useState('');
    const [isCity, setIsCity] = useState('');
    const [isState, setIsState] = useState('');
    const [isLocation, setIsLocation] = useState('');
    const [garageNameError, setGarageNameError] = useState('');
    const [garageContactNumberError, setGarageContactNumberError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [ownerOption, setOwnerOption] = useState('Existing User');
    const [ownerId, setOwnerId] = useState(0);
   
    // User / Owner Fields
    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isAddress, setIsAddress] = useState('');
    const [isProfileImage, setIsProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [addressError, setAddressError] = useState('');

    const [CityList, setCityList] =  useState([]);
    const [StateList, setStateList] =  useState([]);
    const [adminList, setAdminList] =  useState([]);

    const [isLoading, setIsLoading] = useState(false);

    var radio_props = [
        {label: 'New User', value: 'new_user' },
        {label: 'Existing User', value: 'existing_user' }
      ];

    const scroll1Ref = useRef();

    // const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    // });


    const submit = () => {
        setIsLoading(true);
        Keyboard.dismiss();
        if(isGarageName.length == 0){ setGarageNameError("Garage Name is required"); }        
        if(isGarageContactNumber.length == 0){ setGarageContactNumberError("Garage Contact Number is required");  }    
        if(isCity.length == 0){ setCityError("City is required"); }    
        if(isState.length == 0){ setStateError("State is required"); }    
        if(isLocation.length == 0){ setLocationError("Location is required"); }    
        if(isName.length == 0){ setNameError("Owner Name is required"); }    
        if(isPhoneNumber.length == 0){ setPhoneNumberError("Phone Number is required"); }
        else if(isPhoneNumber.length < 9){ setPhoneNumberError("Phone Number should be minimum 10 characters"); }       
        if(isAddress.length == 0){ setAddressError("Address is required"); }    
  
        if(isEmail.length == 0){ setEmailError("Email is required"); }    
        else if(isEmail.length < 6){ setEmailError("Email should be minimum 6 characters"); }      
        else if(isEmail?.indexOf(' ') >= 0){ setEmailError('Email cannot contain spaces'); }    
        else if(isEmail?.indexOf('@') < 0){ setEmailError('Invalid Email Format'); }
        else{
            let formOTP = ({'email': isEmail, 'phone_number': isPhoneNumber});
            userCheck(formOTP);
            setEmailError("");
            setPhoneNumberError("");
            console.log('All Fields are Valid');
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
            console.log(ownerId);
        } else {
            console.log('owner options is not working');
        }
        // if(imageFile != null) { 
        //     const fileToUpload = imageFile;
        //     formData.append('filename', 'Image Upload');
        //     formData.append('profile_image', fileToUpload);
        // }
        // console.log(isProfileImage);
        addGarage(data);
        console.log(data);
    }

    const addGarage = async (data) => {
        try {
            const res = await fetch(`${API_URL}add_garage`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; ',
                    // 'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: data
                // body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (json !== undefined) {
                console.log(json);
                // console.log("Garage Added SuccessFully");
                // setStateList(json.states);
                navigation.navigate('AllStack', { screen: 'ChooseGarage'});
            }
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
                // console.log(json.states);
                setStateList(json.states);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
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
                // console.log(json);
                setCityList(json.cities);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        } finally {
            // setIsLoading(false);
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
                // console.log(json.admin_user_list);
                setAdminList(json.admin_user_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
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
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
        }
        }
    };


    useEffect(() => {
        getCityList();
    }, [isState]);

    useEffect(() => {
        getStatesList();
        getAdminList();
    }, []);
    

    return (
    <View style={styles.pageContainer}>
        {/* <View> */}
            {/* <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            > */}
            { (isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                <InputScrollView
                    // style={{ ...styles.container }}
                    ref={scroll1Ref}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    // keyboardOffset={160}
                    behavior="padding"
                >
                    <View style={{flex:1}}>
                        <Text style={styles.headingStyle}>Garage Details:</Text>
                        <TextInput
                            label='Garage Name'
                            style={styles.input}
                            // innerRef={passwordRef}
                            placeholder="Garage Name"
                            textContentType="telephoneNumber"
                            value={isGarageName}
                            onChangeText={(text) => setIsGarageName(text)}
                            rightIcon={<IconX color={colors.dark_black} size={24} name="closecircle" origin={ICON_TYPE.ANT_ICON} />}
                            // left={<IconX color={colors.dark_black} size={24} name="closecircle" origin={ICON_TYPE.ANT_ICON} />}
                        />
                        {garageNameError?.length > 0 &&
                            <Text style={{color: colors.danger}}>{garageNameError}</Text>
                        }
                        <TextInput
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
                        {/* <Picker
                            selectedValue={isState}
                            onValueChange={(itemValue, itemIndex) =>
                                setIsState(itemValue)
                            }>
                            <Picker.Item label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker> */}
                        <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                            <Picker
                                selectedValue={isState}
                                onValueChange={(v) => setIsState(v)}
                                style={{padding: 0}}
                                // itemStyle={{height: 44, paddingTop:0, marginTop: 0}}
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
                        <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                            <Picker
                                selectedValue={isCity}
                                onValueChange={(v) => setIsCity(v) }
                                style={{padding: 0}}
                                // itemStyle={{height: 44, paddingTop:0, marginTop: 0}}
                                itemStyle={{padding: 0}}
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
                            label='Location'
                            style={styles.input}
                            placeholder="Location"
                            value={isLocation}
                            onChangeText={(text) => setIsLocation(text)}
                        />
                        {locationError?.length > 0 &&
                            <Text style={{color: colors.danger}}>{locationError}</Text>
                        }
                     
                        <View style={{marginTop: 15}}>
                            <RadioForm
                                radio_props={radio_props}
                                initial={ownerOption}
                                onPress={(value) => setOwnerOption(value)}
                                animation={true}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonWrapStyle={{marginLeft: 10}}
                                labelStyle={{marginRight: 40}}
                            />
                        </View>

                            { ownerOption == "existing_user" ? 
                                    <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                                        <Picker
                                            selectedValue={ownerId}
                                            onValueChange={(value) => setOwnerId(value)}
                                            style={{padding: 0}}
                                            // itemStyle={{height: 44, paddingTop:0, marginTop: 0}}
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
                                    </View>
                                : 
                                <>
                                    <Text style={[styles.headingStyle, { marginTop:20 }]}>Owner Details:</Text>
                                    <TextInput
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
                                        label='Address'
                                        style={styles.input}
                                        placeholder="Address"
                                        value={isAddress}
                                        onChangeText={(text) => setIsAddress(text)}
                                    />
                                    {addressError?.length > 0 &&
                                        <Text style={{color: colors.danger}}>{addressError}</Text>
                                    }
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.uploadButtonStyle}
                                            onPress={selectFile
                                                // (imageFile) => {
                                                //     DocumentPicker.pick({
                                                //         type: [DocumentPicker.types.images],
                                                //     });
                                                //     setIsProfileImage(imageFile)
                                                //     // console.log(isProfileImage);
                                                // }
                                            }>
                                            <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                                            <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
                                            Upload Profile Image
                                            </Text>
                                            {imageFile != null ? (
                                                <Text style={styles.textStyle}>
                                                File Name: {imageFile.name ? imageFile.name : ''}
                                                </Text>
                                            ) : null}
                                            {/* { (isProfileImage?.length > 0) &&
                                                {isProfileImage}} */}
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
                </InputScrollView>
            }
            {/* </KeyboardAvoidingView> */}
        {/* </> */}
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
        marginTop: 15,
        marginBottom: 5,
        padding: 10,
        height: 40,
        borderColor: colors.light_gray, // 7a42f4
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
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
     }
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
})

// export default AddGarage;
export default connect(mapStateToProps)(AddGarage);