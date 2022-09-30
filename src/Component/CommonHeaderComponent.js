import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const CommonHeader = ({ selectedGarageId, selectedGarage, user, userRole }) => {
    const navigation = useNavigation();

    return (
        <View style={{ marginBottom: 35 }}>
            {(userRole == "Super Admin" || userRole == "Admin") 
            ?   (selectedGarageId == 0 ? 
                    <View style={styles.garageNameTape}>
                        <Text style={styles.titleText}>
                            All Garages - {user.name}
                        </Text>
                        <TouchableOpacity style={styles.iconStyle} onPress={() => navigation.navigate('ChooseGarage')}>
                            <Icon name={"pencil"} size={15} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                 : 
                    <View style={styles.garageNameTape}>
                        <Text  style={styles.titleText}>
                            {selectedGarage?.garage_name} - {user.name}
                        </Text>
                        <TouchableOpacity style={styles.iconStyle} onPress={() => navigation.navigate('ChooseGarage')}>
                            <Icon name={"pencil"} size={15} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                  
                )
            :   
                <View style={styles.garageNameTape}>
                    <Text style={styles.titleText}>
                        Hello {user.name}!
                    </Text>
                </View>
            }
        </View>
    )
};
const styles = StyleSheet.create({
    garageNameTape: {
        textAlign: "center",
        paddingVertical: 7,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 0,
        zIndex: 5,
        width: "100%",
        flex: 1,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 17,
        fontWeight: "500",
        color: colors.white,
    },
    iconStyle: {
        marginLeft: 10,
        backgroundColor: colors.primary,
        borderRadius: 500,
        padding: 3,
    }
});
const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    user: state.user.user,
    userRole: state.role.user_role,
})

export default connect(mapStateToProps)(CommonHeader)