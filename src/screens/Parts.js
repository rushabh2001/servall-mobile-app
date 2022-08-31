import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme, Searchbar, Button, DataTable, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux';
import { API_URL } from "../constants/config";
import { useIsFocused  } from '@react-navigation/native';
import { Table, Row, Cell } from 'react-native-table-component';
import { FlatList } from 'react-native-gesture-handler';

const Parts = ({ navigation, userToken, selectedGarageId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [singleFile, setSingleFile] = useState('');
  const [partList, setPartList] = useState([]);
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const tableHead = ['(P No.) Name', 'Stock', 'MRP','Rack No', 'Action'];
  const [isGarageId, setIsGarageId] = useState(selectedGarageId);

  const [page, setPage] = useState(1);
  const [isScrollLoading, setIsScrollLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filteredPartData, setFilteredPartData] = useState([]);
  const [searchQueryForParts, setSearchQueryForParts] = useState(); 

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      //Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const getPartList = async () => {
    { page == 1 && setIsLoading(true) }
    { page != 1 && setIsScrollLoading(true) }
    try {
      const res = await fetch(`${API_URL}fetch_garage_inventory/${isGarageId}?page=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken
        },
      });
      const json = await res.json();
      if (json !== undefined) {
        // setPartList(json.data);
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

  const searchFilterForParts = (text) => {
    if (text) {
        let newData = partList.filter(
            function (listData) {
            let itemData = listData.parts.name ? listData.parts.name.toUpperCase() : ''.toUpperCase()
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

  const pullRefresh = async () => {
    try {
        const res = await fetch(`${API_URL}fetch_garage_inventory/${isGarageId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
        });
        const json = await response.json();
        console.log('1', json);
        if (response.status == '200') {
            setSearchQueryForParts('');
            setFilteredPartData(json.data.data);
            setPage(2);
            setRefreshing(false);
        } else {
            // console.log('2', response.status);
            setRefreshing(false);
        }
    } catch (error) {
        // if (error?.message == 'Unauthenticated.') signOut();
        console.error(error);
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
    // <TouchableOpacity onPress={() => {navigation.navigate('EditStock', {'data': data})}} style={{marginLeft: 20}}>
      <Icon name="chevron-circle-right" size={18} style={styles.actionArrow} />
    // </TouchableOpacity>
  );

  return (
    <View style= {styles.customSurface}>
        
      {/* Search Bar */}
      <Searchbar
        placeholder="Search here..."
        onChangeText={(text) => { if(text != null) searchFilterForParts(text)}}
        value={searchQueryForParts}
      />

      <View style={{flexDirection:'row',  marginTop: 15}}>
        <View style={{flex:1}}>
          {/* <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={selectOneFile}>
            Single file selection button
            <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
            <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
              Upload CSV
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={{flex:0.7}}>
          {/* <Button
              style={styles.buttonBlue}
              color="#123038"
              icon={({color}) => (<Icon name="plus" color={color} size={18} />) }
              mode="contained"
              onPress={() => navigation.navigate('PartsStack', {screen: 'AddStock'})}
              uppercase={false} 
            > Add Stock
          </Button> */}
        </View>

      </View>

      <View style={{flex:1}}>
        <ScrollView>
          {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
            <View style={styles.container}>
              <Table>
                <Row 
                  data={tableHead} 
                  style={
                    styles.head 
                    } 
                  textStyle={styles.textHeading}
                  flexArr= {[2, 1, 1, 1, 1]}
                />
                  {filteredPartData?.length > 0 ?  
                    <FlatList
                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                        data={filteredPartData}
                        onEndReached={filteredPartData?.length > 10 && getPartList}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['green']}
                            />
                        }
                        ListFooterComponent={renderFooter}
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
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(Parts);