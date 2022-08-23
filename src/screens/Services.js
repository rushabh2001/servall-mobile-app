import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Badge } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { API_URL } from '../constants/config';
import { useIsFocused } from '@react-navigation/native';

const Services = ({ navigation, selectedGarageId, userToken }) => {
  const { colors } = useTheme();
  const [isGarageId, setIsGarageId] = useState(selectedGarageId);
  const [isOpenOrders, setIsOpenOrders] = useState(0);
  const [isWipOrders, setIsWipOrders] = useState(0);
  const [isReadyOrders, setIsReadyOrders] = useState(0);
  const [isPaymentDue, setIsPaymentDue] = useState(0);
  const [isCompletedOrders, setIsCompletedOrders] = useState(0);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const isFocused = useIsFocused();

  const getDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      const res = await fetch(`${API_URL}fetch_dashboard_data/${isGarageId}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
      });
      const json = await res.json();
      if (json !== undefined) {
        console.log(json);
        setIsOpenOrders(json.order_status_1);
        setIsWipOrders(json.order_status_2);
        setIsReadyOrders(json.order_status_3);
        setIsPaymentDue(json.due_payment);
        setIsCompletedOrders(json.order_status_4);
        // setPartList(json.data);
        // setFilteredPartData(json.data);
      }
    } catch (e) {
        console.log(e);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [isFocused]);

  return (
    <View style= {styles.customSurface}>
      {/* {isLoadingDashboard == true ? <ActivityIndicator></ActivityIndicator> : */}
        <ScrollView>

          {/* Create Repair Order Card */}
          <View style={styles.mainCards}>
            <TouchableOpacity style={[styles.cardContainer, {  marginTop:0, elevation: 3, flex:1 }]} onPress={() => navigation.navigate("ServicesStack" , {screen:"AddRepairOrder"}) }>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/addorder.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Create Repair Order
                </Text>
                <Text>
                  Click to open new job card
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

            {/* Add Payment */}
            <TouchableOpacity style={[styles.cardContainer, { marginTop:10, elevation: 3, flex:1 }]} 
              onPress={() => 
                navigation.navigate("AddPaymentSelectOrder") 
                // console.log("Pressed Me!")
              }>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/online-payment.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Add Payment
                </Text>
                <Text>
                  Add payment for order
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

       
            <View style={[styles.mainVerticleCard, { marginTop:10 }]}>
              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]} onPress={ () => navigation.navigate("ServicesStack" , {screen:"OpenOrderList"}) }>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/logistic.png')} />
                </View>
                <View style={styles.haveBadge}>
                  <Badge style={styles.badgeTag} rounded="full" mb={0} mr={-50} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>{isOpenOrders}</Badge>
                  <Text style={styles.verticleCardTitle}>
                    Open Order 
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Repair order created
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{flex:0.08}}></View>
              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]} onPress={ () => navigation.navigate("WIPOrderList") }>
                <View  style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/in-progress.png')} />
                </View>
                <View>
                  <Badge style={styles.badgeTag} rounded="full" mb={0} mr={-50} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>{isWipOrders}</Badge>
                  <Text style={styles.verticleCardTitle}>
                    WIP Orders
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Work in progress
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.mainVerticleCard, { marginTop:10 }]}>
              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]} onPress={ () => navigation.navigate("VehicleReadyOrderList") }>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/delivery.png')} />
                </View>
                <View>
                  <Badge style={[styles.badgeTag, {right: -2}]} rounded="full" mb={0} mr={-50} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>{isReadyOrders}</Badge>
                  <Text style={styles.verticleCardTitle}>
                    Ready Orders
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Vehicle is ready
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{flex:0.08}}></View>

              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]} onPress={ () => navigation.navigate("InvoicePreviewSelectOrder") }>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/payment.png')} />
                </View>
                <View>
                  <Text style={styles.verticleCardTitle}>
                    Share Invoice
                  </Text>
                  <Text style={styles.duePaymentText}>
                    Due: ₹ {isPaymentDue}
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Invoice prepared
                  </Text>
                </View>
              </TouchableOpacity>
              
            </View>

              {/* Create Invoice Card */}
              {/* <TouchableOpacity style={[styles.cardContainer, { marginTop:10, elevation: 3, flex:1 }]} 
                onPress={() => 
                navigation.navigate("AddPaymentSelectOrder") 
                // console.log("Pressed Me!")
              }>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/package.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Share Invoice
                </Text>
                <Text>
                  Share direct parts/service invoice
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity> */}


            <TouchableOpacity style={[styles.cardContainer, { marginTop:10, elevation: 2 }]} onPress={ () => navigation.navigate("OrderCompletedList") }>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/packageready.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Badge style={[styles.badgeTag, {right: 40, top: 3}]} rounded="full" mb={0} mr={-50} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>{isCompletedOrders}</Badge>
                <Text style={styles.cardTitle}>
                  Completed Orders
                </Text>
                <Text>
                  Click to view order history
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      {/* } */}
    </View>
  )
}

const styles = StyleSheet.create({
  customSurface: {
    padding: 15,
    flexDirection: "column",
    flex: 1,
  },
  mainCards: {
    marginTop: 5,
    marginBottom: 15,
  },
  mainVerticleCard: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  cardContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticleCardContainer: {
    padding: 15,
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: '#000',
    borderRadius: 5,
  },
  verticleCardTitle:{
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 3,
  },
  cardImage: {
      flex:1,
      width:50,
      height:50,
      resizeMode: 'cover',
  },
  verticleImage: {
    width: 50,
    height: 50,
    marginBottom:10,
    marginTop:5,
  },
  cardRightContent: {
    flex:2.4,
    justifyContent: 'center',
  },
  duePaymentText: {
    textAlign:'center', 
    color:"#ff0000",
    fontSize:16,
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "500",
  },
  cardArrow: {
    flex: 0.2,
    justifyContent: 'center',
  },
  breakRow: {
    flexBasis: "100%",
    height: 0,
  },
  badgeTag: {
    // top: -5,
    right: 5,
    position: "absolute",
  },
  haveBadge: {
    position: "relative",
    color: colors.black
  },
});

const mapStateToProps = state => ({
  userToken: state.user.userToken,
  selectedGarageId: state.garage.selected_garage_id,
  garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(Services);
// export default Services;