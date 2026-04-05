import { StyleSheet } from 'react-native';
import { shopList } from './shopItems';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const insets = useSafeAreaInsets();
export const styles = StyleSheet.create({
  container: {
    // paddingTop: insets.top,
    // paddingBottom: insets.bottom,
    // paddingLeft: insets.left,
    // paddingRight: insets.right,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "visible",
    backgroundColor: '#EDDEFF',
    zIndex: -1
  },

  // Navigation Header
  navHeader: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems:'center', 
    maxHeight: 50, 
    minHeight: 55, 
    minWidth: "100%"
  },
  screenName: {
    color: "#FFFF", 
    backgroundColor: '#5A53BF',
    paddingLeft: 50,
    paddingRight: 30,
    paddingTop: 7,
    paddingBottom: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 30,
    textAlignVertical: 'top',
    textAlign:'right',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 22,
    backgroundColor: '#5A53BF',
    color: '#FFF',
    textAlignVertical:"top" 
  },

  projHeader: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projSubtitle: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  projNote: {
    color: 'white',
    fontSize: 16,

  },

  shopHeader: {
    flex: 1,
    // justifyContent: "space-between",
    alignItems: 'flex-end',
    margin: 5,
    padding: 5,
    minHeight: '30%',
    minWidth: '90%',
    backgroundColor: '#B6BCFB',
    borderRadius: 15,
  },
  minutesDisplay: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  keeperText: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,

    maxWidth: '80%',
    alignSelf: 'center',
    marginBottom: 5,
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
    backgroundColor: '#D95635',
    margin: 5,
    padding: 15,
    borderRadius: 15,

    minWidth: '90%',
  },
  shopItemTxt: {
    color: 'white',
    fontSize: 14,
  },

  roomContainer:{
    width: '100%',
    maxWidth: 500,
    maxHeight: 500,
    height: undefined,
    aspectRatio: 1,
    // backgroundColor: '#ffe7e7',
    alignSelf: "center"
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
    alignSelf: "center",
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
    alignSelf:"center"
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
    zIndex: -1
  },

  smallHome: {
    transform: [{ rotateX: '60deg'}, { rotateZ: '45deg' }],
    width: 100,
    height: 100,
    backgroundColor: 'black',
    borderWidth: 2,
  }
});