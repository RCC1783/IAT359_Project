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
  }
});