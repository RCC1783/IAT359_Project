import { StyleSheet } from 'react-native';
import { shopList } from './shopItems';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shopHeader: {
    flex: 1,
    // justifyContent: "space-between",
    alignItems: 'flex-end',
    margin: 5,
    padding: 5,
    minHeight: '30%',
    backgroundColor: '#656565'
  },
  minutesDisplay: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 10,
  },
  shopList: {
    height: '70%',
    margin: 10
  },
  shopItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#b5b5b5',
    margin: 5,
    padding: 10,
    borderRadius: 15
  },

  roomContainer:{
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    backgroundColor: '#ffe7e7'
  },
  roomImage:{
    width:'100%',
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  homeButton: {
    backgroundColor: "#ffffff",
    borderColor: '#6ac1ff',
    borderWidth: 3,
    padding: 15,
    borderRadius: 5,
    margin: 10,
    
    alignContent: 'center',
    justifyContent: 'center',
  },

  btnText: {
    textAlign: 'center',
  }, 

  headerText: {
    textAlign: 'center',
    fontSize: 18,
  },

  boxShadow: {
    shadowColor: '#333333',
    shadowOffset: { 
      width: 6,
      height: 6
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

  androidBoxShdw: {
    elevation: 10,
  },

  setSwitch: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 15,
    borderRadius: 5,
    margin: 10,

    alignContent: 'center',
    justifyContent: 'center',
  },

  input: {
    margin: 5,
    borderWidth: 1,

    backgroundColor: 'white',
  }, 
  popupView: {

    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    backgroundColor: '#b1b1b1',
    zIndex: 99,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20,

    width: '95%',
    height: 'fit-content',
    margin: 10,
    padding: 10,
    gap: 10,
    top: 100
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 40 
  }
});