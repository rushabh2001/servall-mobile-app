import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import { Button, TextInput } from 'react-native-paper';
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';

const CustomerInfo = ({ navigation, userToken, route }) => {
    
    // User / Customer Fields
    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isCity, setIsCity] = useState();
    const [isState, setIsState] = useState();
    const [isAddress, setIsAddress] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');

    const [CityList, setCityList] =  useState([]);
    const [StateList, setStateList] =  useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const scroll1Ref = useRef();

    const validate = () => {
        return !(
            !isName || isName?.trim().length === 0  || 
            !isPhoneNumber || isPhoneNumber?.trim().length === 0 || 
            !isEmail || isEmail?.trim().length === 0 ||  isEmail?.trim().length < 6 || isEmail?.indexOf('@') < 0 || isEmail?.indexOf(' ') >= 0 ||
            !isCity || isCity === 0 ||
            !isState || isState === 0
        )
    }

    const submit = () => {
        Keyboard.dismiss();  
        if (!validate()) {
            if (!isName) setNameError("Customer Name is required");
            if (!isPhoneNumber) setPhoneNumberError("Phone Number is required");
            if (!isEmail) setEmailError("Email is required");
            else if (isEmail.length < 6) setEmailError("Email should be minimum 6 characters");
            else if (isEmail?.indexOf(' ') >= 0) setEmailError('Email cannot contain spaces');
            else if (isEmail?.indexOf('@') < 0) setEmailError('Invalid Email Format');
            return;
        }

        const data = {
            "name" : isName,
            "email" : isEmail,
            "phone_number" : isPhoneNumber,
            "city" : isCity, 
            "state" : isState, 
            "address" : isAddress,
            "vehicle_option" : "no_vehicle"
        };
        
        updateUser(data);
    }

    const updateUser = async (data) => {
        try {
            await fetch(`${API_URL}update_customer/${route?.params?.userId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
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
                console.log(res);
                if(res.statusCode == 400) {
                  { res.data.message.email && setEmailError(res.data.message.email); }
                  { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
                  return;
                } else if(res.statusCode == 201) {
                    console.log("Customer Updated SuccessFully");
                    navigation.navigate('AllStack', { screen: 'CustomerDetails', params: { userId: route?.params?.userId } });
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
            console.log(res);
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
            }
        } catch (e) {
            console.log(e);
            return alert(e);
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
            if (json !== undefined) {
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
                        behavior="padding"
                    >
                        <View style={{flex:1}}>
                            <Text style={[styles.headingStyle, { marginTop:20 }]}>Customer Details:</Text>
                            <TextInput
                                mode="outlined"
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

                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isState}
                                    onValueChange={(v) => {setIsState(v)}}
                                    style={styles.dropDownField}
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

                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isCity}
                                    onValueChange={(v) => setIsCity(v) }
                                    style={styles.dropDownField}
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
                                mode="outlined"
                                label='Address'
                                style={styles.input}
                                placeholder="Address"
                                value={isAddress}
                                onChangeText={(text) => setIsAddress(text)}
                            />

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
     datePickerIcon: {
        padding: 10,
        position: 'absolute',
        right: 7,
        top: 13,
        zIndex: 2,
    },
    dropDownContainer: {
        borderWidth:1,
        borderColor: colors.light_gray, 
        borderRadius: 5, 
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
        backgroundColor: '#F0F2F5',
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(CustomerInfo);