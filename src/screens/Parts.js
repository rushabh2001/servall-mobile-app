import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { TextInput, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { API_URL } from "../constants/config";
import { useIsFocused  } from '@react-navigation/native';
import { Table, Row, Cell } from 'react-native-table-component';
import { FlatList } from 'react-native-gesture-handler';

const Parts = ({ navigation, userToken, selectedGarageId, user, selectedGarage }) => {
  const [isLoading, setIsLoading] = useState(true);
  // const [singleFile, setSingleFile] = useState('');
  const [partList, setPartList] = useState([]);
  const isFocused = useIsFocused();
  const tableHead = ['(P No.) Name', 'Stock', 'MRP','Rack No', 'Action'];
  const [isGarageId, setIsGarageId] = useState(selectedGarageId);

  const [page, setPage] = useState(1);
  const [isScrollLoading, setIsScrollLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filteredPartData, setFilteredPartData] = useState([]);
  const [searchQueryForParts, setSearchQueryForParts] = useState(); 

  // const selectOneFile = async () => {
  //   //Opening Document Picker for selection of one file
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     //Setting the state to show single file attributes
  //     setSingleFile(res);
  //   } catch (err) {
  //     //Handling any exception (If any)
  //     if (DocumentPicker.isCancel(err)) {
  //       //If user canceled the document selection
  //       alert('Canceled from single doc picker');
  //     } else {
  //       //For Unknown Error
  //       alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };

  const getPartList = async () => {
    { page == 1 && setIsLoading(true) }
    { page != 1 && setIsScrollLoading(true) }
    try {
      const res = await fetch(`${API_URL}fetch_garage_inventory/${selectedGarageId}?page=${page}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken
        },
        body: JSON.stringify({
            search: searchQueryForParts,
        }),
      });
      const json = await res.json();
      if (json !== undefined) {
        setPartList([
          ...partList,
          ...json.data.data,
        ]);
        // setTableData(json.data);
        setFilteredPartData([
          ...filteredPartData,
          ...json.data.data,
        ]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      { page == 1 && setIsLoading(false) }
      { page != 1 && setIsScrollLoading(false) }
      setPage(page + 1);
      console.log(page);
    }
  };

  const searchFilterForParts = async () => {
    try {
      const response = await fetch(`${API_URL}fetch_garage_inventory/${selectedGarageId}`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({
            search: searchQueryForParts,
          }),
      });
      const json = await response.json();
      if (response.status == '200') {
          setPartList(json.data.data);
          setFilteredPartData(json.data.data);
          setPage(2);
          setRefreshing(false);
      } else {
          setRefreshing(false);
      }
    } catch (error) {
        console.error(error);
    }
  };

  const pullRefresh = async () => {
    setSearchQueryForParts(null);
    try {
      const response = await fetch(`${API_URL}fetch_garage_inventory/${selectedGarageId}`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
          body: JSON.stringify({
            search: '',
          }),
      });
      const json = await response.json();
      if (response.status == '200') {
          setPartList(json.data.data);
          setFilteredPartData(json.data.data);
          setPage(2);
      }
    } catch (error) {
        console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderFooter = () => {
    return (
        <>
            {isScrollLoading && (
                <View style={styles.footer}>
                    <ActivityIndicator
                        size="large"
                    />
                </View>
            )}
        </>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    pullRefresh();
  };

  useEffect(() => {
    getPartList();
  }, [isFocused]);

  const element = (data, index) => (
      <Icon name="chevron-circle-right" size={18} style={styles.actionArrow} />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 35 }}>
      { selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages - {user.name}</Text> : <Text style={styles.garageNameTitle}>{selectedGarage?.garage_name} - {user.name}</Text> }
      </View>
      <View style= {styles.customSurface}>
          
        {/* Search Bar */}
        <View>
          <View style={{ marginBottom: 15, flexDirection: 'row'}}>
              <TextInput
                  mode={'flat'}
                  placeholder="Search here..."
                  onChangeText={(text) => setSearchQueryForParts(text)}
                  value={searchQueryForParts}
                  activeUnderlineColor={colors.transparent}
                  underlineColor={colors.transparent}
                  style={{ elevation: 4, height: 50, backgroundColor: colors.white, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5  }}
                  right={(searchQueryForParts != null && searchQueryForParts != '') && <TextInput.Icon icon="close" color={colors.light_gray} onPress={() => onRefresh()} />}
              />
              <TouchableOpacity onPress={() => searchFilterForParts()} style={{ elevation: 4, borderTopRightRadius: 5, borderBottomRightRadius: 5, paddingRight: 25, paddingLeft: 25, zIndex: 2, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name={'search'} size={17} color={colors.white} />
              </TouchableOpacity>
          </View>
        </View>

        <View style={{flex:1}}>
          {isLoading ? <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator></ActivityIndicator></View>  :
            <ScrollView>
              <View style={styles.container}>
                <Table>
                  <Row 
                    data={tableHead} 
                    style={styles.head} 
                    textStyle={styles.textHeading}
                    flexArr= {[2, 1, 1, 1, 1]}
                  />
                    {filteredPartData?.length > 0 ?  
                      <FlatList
                          ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                          data={filteredPartData}
                          onEndReached={filteredPartData?.length > 9 && getPartList}
                          onEndReachedThreshold={0.5}
                          refreshControl={
                              <RefreshControl
                                  refreshing={refreshing}
                                  onRefresh={onRefresh}
                                  colors={['green']}
                              />
                          }
                          ListFooterComponent={filteredPartData?.length > 9 && renderFooter}
                          keyExtractor={item => item.id}
                          renderItem={({item, index}) => (
                            <View style={{margin: 5}}>
                              <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {navigation.navigate('EditStock', {'data': item})}}>
                                <Cell data={item.parts.name} style={{flex: 2}} textStyle={styles.text} />
                                <Cell data={item.current_stock} style={{flex: 1}} textStyle={styles.text} />
                                <Cell data={item.mrp} style={{flex: 1}} textStyle={styles.text} />
                                <Cell data={item.rack_id} style={{flex: 1}} textStyle={styles.text} />
                                <Cell data={element(item, index)} style={{ flex: 1 }} textStyle={styles.text} />
                              </TouchableOpacity>
                            </View>
                          )} 
                      />
                      :
                      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                          <Text style={{ color: colors.black, textAlign: 'center'}}>No such part is associated to your garage!</Text>
                      </View>
                    }
                </Table>
              </View>
            </ScrollView>
          }
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  garageNameTitle: {
    textAlign: 'center', 
    fontSize: 17, 
    fontWeight: '500', 
    color: colors.white, 
    paddingVertical: 7, 
    backgroundColor: colors.secondary,
    position: 'absolute',
    top: 0,
    zIndex: 5,
    width: '100%',
    flex: 1,
    left: 0, 
    right: 0
  },
  container: { 
    flex: 1, 
    borderRadius: 5,
    backgroundColor: '#fff' 
  },
  head: { 
    height: 60,
    backgroundColor: colors.secondary,
    padding: 7, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  text: { 
    margin: 6,
    color: colors.black,
  },
  textHeading: { 
    margin: 6,
    color: colors.white 
  },
  row: { 
    flexDirection: 'row',
    padding: 7,  
  },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  customSurface: {
    padding: 15,
    flexDirection: "column",
    flex: 1,
  },
  buttonBlue: {
    marginBottom: 15,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  downloadIcon: {
    marginRight: 10,
    fontSize: 22,
  },
  tableHeaderText: {
    color: colors.black,
    fontSize: 16,
  },
  actionArrow: {
    fontSize:16,
    color: colors.black,
    marginLeft: 15,
  }
})

const mapStateToProps = state => ({
  userRole: state.role.user_role,
  userToken: state.user.userToken,
  selectedGarageId: state.garage.selected_garage_id,
  user: state.user.user,
  selectedGarage: state.garage.selected_garage,
  garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(Parts);