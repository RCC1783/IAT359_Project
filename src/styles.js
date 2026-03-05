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
    padding: 5,
    borderRadius: 5,
    margin: 5,
  }, 

  popupView: {
    position: 'absolute',
    backgroundColor: '#b1b1b1',
    zIndex: 99,
    margin: 10,
    padding: 20,
    width: '95%',
    height: 200
  }
});