import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, TextInput, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import { Button } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';

const CustomerInfo = ({ navigation, userToken, route }) => {
    
    // User / Customer Fields
    const [isUserDetails, setIsUserDetails] = useState('');

    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isCity, setIsCity] = useState();
    const [isState, setIsState] = useState();
    const [isAddress, setIsAddress] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');

    const [CityList, setCityList] =  useState([]);
    const [StateList, setStateList] =  useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const scroll1Ref = useRef();

    const submit = () => {
     
        Keyboard.dismiss();  

        if(isName.length == 0){ setNameError("Customer Name is required"); }    
        if(isPhoneNumber.length == 0){ setPhoneNumberError("Phone Number is required"); }
        else if(isPhoneNumber.length < 9){ setPhoneNumberError("Phone Number should be minimum 13 characters"); }       
        if(isCity.length == 0){ setCityError("City is required"); }    
        if(isState.length == 0){ setStateError("State is required"); }    
        if(isAddress.length == 0){ setAddressError("Address is required"); }    

        if(isEmail.length == 0){ setEmailError("Email is required"); }    
        else if(isEmail.length < 6){ setEmailError("Email should be minimum 6 characters"); }      
        else if(isEmail?.indexOf(' ') >= 0){ setEmailError('Email cannot contain spaces'); }    
        else if(isEmail?.indexOf('@') < 0){ setEmailError('Invalid Email Format'); }
        

        let dataCheck = ({'email': isEmail, 'phone_number': isPhoneNumber});
        userCheck(dataCheck);
        setEmailError("");
        setPhoneNumberError("");

        const data = {
            "name" : isName,
            "email" : isEmail,
            "phone_number" : isPhoneNumber,
            "city" : isCity, 
            "state" : isState, 
            "address" : isAddress,
            "vehicle_option" : "no_vehicle"
        };

        console.log(data);
        updateUser(data);
    }

    const updateUser = async (data) => {
        try {
            const res = await fetch(`${API_URL}update_customer/${route?.params?.userId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify(data)
            });
            console.log(res);

            const json = await res.json();
            if (json !== undefined) {
                console.log(json);
                console.log("Customer Updated SuccessFully");
                navigation.navigate('AllStack', { screen: 'CustomerDetails', params: { userId: route?.params?.userId } });
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            const statusCode = response.status;
            let data;
            return response.json().then(obj => {
                data = obj;
                return { statusCode, data };
            });
        })
        .then((res) => {
            if(res.statusCode == 401) {
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
    
    const getUserDetails = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_customer_details?id=${route?.params?.userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            // console.log(res);
            if (json !== undefined) {
                // console.log(json.user_details);
                setIsName(json?.user_details?.name);
                setIsEmail(json?.user_details?.email);
                setIsPhoneNumber(json?.user_details?.phone_number);
                setIsAddress(json?.user_details?.address);
                setIsState(parseInt(json?.user_details?.state));
                setTimeout(function () {
                    setIsCity(parseInt(json?.user_details?.city))
                  }, 200);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
                
        }
    };

    useEffect(() => {
        getStatesList();
    }, []);

    useEffect(() => {
        getUserDetails();
    }, [StateList]);

    useEffect(() => {
        getCityList();
    }, [isState]);
    
    return (
        <View style={styles.pageContainer}>
                { (isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={8}
                        // keyboardOffset={160}
                        behavior="padding"
                    >
                        <View style={{flex:1}}>
                            <Text style={[styles.headingStyle, { marginTop:20 }]}>Customer Details:</Text>
                            <TextInput
                                label='Customer Name'
                                style={styles.input}
                                placeholder="Customer Name"
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
                            <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                                <Picker
                                    selectedValue={isState}
                                    onValueChange={(v) => {setIsState(v)}}
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
                            <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                                <Picker
                                    selectedValue={isCity}
                                    onValueChange={(v) => setIsCity(v) }
                                    style={{padding: 0}}
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
                                label='Address'
                                style={styles.input}
                                placeholder="Address"
                                value={isAddress}
                                onChangeText={(text) => setIsAddress(text)}
                            />
                            {addressError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{addressError}</Text>
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

export default connect(mapStateToProps)(CustomerInfo);