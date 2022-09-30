import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { connect } from "react-redux";

const CommonHeader = ({ selectedGarageId, selectedGarage, user, userRole }) => {
    return (
        <View style={{ marginBottom: 35 }}>
            {(userRole == "Super Admin" || userRole == "Admin") 
            ?   (selectedGarageId == 0 ? 
                    <Text style={styles.garageNameTitle}>
                        All Garages - {user.name}
                    </Text>
                 : 
                    <Text style={styles.garageNameTitle}>
                        {selectedGarage?.garage_name} - {user.name}
                    </Text>
                )
            :   
                <View>
                    <Text style={styles.garageNameTitle}>
                        Hello {user.name}!
                    </Text>
                </View>
            }
        </View>
    )
};
const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
        color: colors.white,
        paddingVertical: 7,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 0,
        zIndex: 5,
        width: "100%",
        flex: 1,
        left: 0,
        right: 0,
    },
});
const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    user: state.user.user,
    userRole: state.role.user_role,
})

export default connect(mapStateToProps)(CommonHeader)