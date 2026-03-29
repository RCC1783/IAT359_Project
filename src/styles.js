import { StyleSheet } from 'react-native';
import { shopList } from './shopItems';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDDEFF',
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
    backgroundColor: "#D95635",
    padding: 15,
    borderRadius: 25,
    margin: 10,
    width: '80%',
    
    alignContent: 'center',
    justifyContent: 'center',
  },

  btnText: {
    textAlign: 'center',
    color: 'white',
    textTransform: 'uppercase',
  }, 

  headerText: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
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
    borderRadius: 25,
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
    borderColor: '#D95635',
    borderRadius: 25,

    padding: 15,
    width: '80%',

    backgroundColor: 'white',
  }, 
  popupView: {

    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    backgroundColor: '#70a1e4',
    zIndex: 99,
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
  },

  // Welcome Screen
  cloud: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
    width: 200,
    height: 200,
  },

  smallHome: {
    transform: [{ rotateX: '60deg'}, { rotateZ: '45deg' }],
    width: 100,
    height: 100,
    backgroundColor: 'black',
    borderWidth: 2,
  }
});