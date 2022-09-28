import React, { useState, useEffect } from "react";
import {View, FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import { connect } from "react-redux";

const CommonHeader = ({ selectedGarageId, selectedGarage, user }) => {
    const [isGarageId, setIsGarageId] = useState(selectedGarageId);
    return (
        <View style={{ marginBottom: 35 }}>
            {selectedGarageId == 0 ? (
                <Text style={styles.garageNameTitle}>
                    All Garages - {user.name}
                </Text>
            ) : (
                <Text style={styles.garageNameTitle}>
                    {selectedGarage?.garage_name} - {user.name}
                </Text>
            )}
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
})

export default connect(mapStateToProps)(CommonHeader)